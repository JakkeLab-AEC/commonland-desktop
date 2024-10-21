import * as THREE from 'three';
import { DefaultDimensions } from '../defaultConfigs/DefaultDimensionConfigs';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export class ThreeBoringPost {
    private static fontLoader : FontLoader = new FontLoader();

    static createPost(layers:{name: string, thickness:number}[]) {
        console.log(DefaultDimensions.getInstance());
        const dims = DefaultDimensions.getInstance().getDims();
        // Create cylinder segments
        const radius = dims.shoringPostRadius;
        const layerSegments: {name: string, thickness: number, geometry: THREE.CylinderGeometry}[] = [];
        layers.forEach(layer => {
            layerSegments.push({
                name: layer.name,
                thickness: layer.thickness,
                geometry: new THREE.CylinderGeometry(radius, radius, layer.thickness, 64),
            });
        });
    }

    static async createPostSegmenet(
        name: string, 
        levelDescription: string, 
        thickness: number, 
        radius: number, 
        curvedLeader: boolean,
        offsetText = 0.1,
        postColor = 0xbfff75
    ):Promise<{postMesh: THREE.Object3D, textMesh: THREE.Object3D, leaderLine: THREE.Line}> {
        // Create post
        const geometry = new THREE.CylinderGeometry(radius, radius, thickness, 64);
        const segmentMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: postColor,
        }));

        geometry.computeBoundingBox();
        
        // Create leader
        let leaderSet: {textMesh: THREE.Object3D, leaderLine: THREE.Line}; 
        if(curvedLeader) {
            leaderSet = await this.createLeader(
                `${name} (${levelDescription})`, 
                0.5, 
                0x000000, 
                {
                curved: curvedLeader,
                leaderSegmentLength: [4, 4, 4],
                }, 
                radius,
                offsetText,
                geometry.boundingBox.max.y
            );
            console.log(leaderSet);
        } else {
            leaderSet = await this.createLeader(
                `${name} (${levelDescription})`,
                0.5,
                0x000000,
                {
                    curved: curvedLeader,
                    leaderLength: 4,
                },
                radius,
                offsetText,
                geometry.boundingBox.max.y
            );
            console.log(leaderSet);
        }

        return {postMesh: segmentMesh, textMesh: leaderSet.textMesh, leaderLine: leaderSet.leaderLine}
    }

    static async createLeader(
        text: string,
        fontSize = 0.5,
        textColor = 0x000000,
        leaderOption: { curved: boolean, leaderLength?: number, leaderSegmentLength?: number[]}, 
        offset: number,
        offsetText: number,
        coordY: number,
        leaderColor = 0x000000
    ): Promise<{ textMesh: THREE.Object3D, leaderLine: THREE.Line }> {
        return new Promise((resolve, reject) => {
            const { curved, leaderLength, leaderSegmentLength } = leaderOption;
            const trueCases = 
                (curved && leaderSegmentLength.length === 3) ||
                (!curved && leaderLength);
    
            if (!trueCases) {
                if (!curved) {
                    return reject(new Error('When leader is not curved, leaderLength should be given.'));
                } else {
                    return reject(new Error('When leader is curved, leaderSegmentLength should contain 3 numbers.'));
                }
            }
    
            const material = new THREE.LineBasicMaterial({
                color: leaderColor
            });
    
            // Leader lines
            let line: THREE.Line;
            if (curved) {
                const pt1 = new THREE.Vector3(offset, coordY, 0);
                const pt2 = new THREE.Vector3(offset + leaderSegmentLength[0], coordY, 0);
                const pt3 = new THREE.Vector3(offset + leaderSegmentLength[0], coordY - leaderSegmentLength[1], 0);
                const pt4 = new THREE.Vector3(offset + leaderSegmentLength[0] + leaderSegmentLength[2], coordY - leaderSegmentLength[1], 0);
                const segmentPts = [pt1, pt2, pt3, pt4];
                const geometry = new THREE.BufferGeometry().setFromPoints(segmentPts);
                line = new THREE.Line(geometry, material);
            } else {
                const pt1 = new THREE.Vector3(offset, coordY, 0);
                const pt2 = new THREE.Vector3(offset + leaderLength, coordY, 0);
                const segmentPts = [pt1, pt2];
                const geometry = new THREE.BufferGeometry().setFromPoints(segmentPts);
                line = new THREE.Line(geometry, material);
            }
    
            // Load font and create text geometry
            const fontLoader = new FontLoader();
            fontLoader.load('/src/fontjson/font_default.json', (font) => {
                const textGeometry = new TextGeometry(text, {
                    font: font,
                    size: fontSize,
                    height: 0.0,
                    curveSegments: 12,
                    bevelEnabled: false,
                });
    
                // Compute the bounding box of the text
                textGeometry.computeBoundingBox();
                const verLength = Math.abs(textGeometry.boundingBox.min.y - textGeometry.boundingBox.max.y)
                // Adjust position of the text
                const textTranslationMatrix = new THREE.Matrix4();
                textTranslationMatrix.makeTranslation(
                    offset + (curved ? leaderSegmentLength[0] + leaderSegmentLength[2] : leaderLength) + offsetText,
                    coordY - (curved ? leaderSegmentLength[1] : 0) - verLength*0.5,
                    0
                );
                textGeometry.applyMatrix4(textTranslationMatrix);
    
                // Create the text mesh
                const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
                    color: textColor,
                }));
    
                // Resolve the promise with the created objects
                resolve({
                    textMesh: textMesh,
                    leaderLine: line,
                });
            }, undefined, (error) => {
                reject(error);  // Reject the promise if font loading fails
            });
        });
    }

    // static async textGeometryTest() {
    //     const loader = new FontLoader();
        
    //     const font = await loader.loadAsync('/src/fontjson/font_default.json');
    //     console.log(font);
    // }
}