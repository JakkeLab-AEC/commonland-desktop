import * as THREE from 'three';
import { DefaultDimensions } from '../defaultConfigs/DefaultDimensionConfigs';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { LayerColorConfig } from '../../../../mainArea/models/uimodels/layerColorConfig';
import { Boring } from '../../../../mainArea/models/serviceModels/boring/boring';
import { colorPaletteValues } from '../../../../public/colorPalette';


export class ThreeBoringPost {
    static async createPostFromModel(boring: Boring, layerColorConfig: LayerColorConfig):Promise<THREE.Object3D[]> {
        console.log(layerColorConfig.getAllLayerColors());
        const layers = boring.getLayers().map(r=>{ return {
            name: r.getName(),
            thickness: r.getThickness(),
            color: parseInt(colorPaletteValues[layerColorConfig.getLayerColor(r.getName())].slice(1), 16)
        }})

        const sptValues = boring.getSPTResultSet().getAllResults();

        const threeItems = await ThreeBoringPost.createPost(
            boring.getName(),
            boring.getTopoTop(),
            layers,
            sptValues
        );

        const moveMatrix = new THREE.Matrix4()
        moveMatrix.makeTranslation(boring.getLocationX(), 0, boring.getLocationY());
        
        const threeObjs: THREE.Object3D[] = [];

        threeItems.sptObjects.forEach(obj => {
            obj.leaderLine.applyMatrix4(moveMatrix);
            obj.textDepthObject.applyMatrix4(moveMatrix);
            obj.textSPTResultObject.applyMatrix4(moveMatrix);
            threeObjs.push(obj.leaderLine);
            threeObjs.push(obj.textDepthObject);
            threeObjs.push(obj.textSPTResultObject);
        })

        threeItems.postSegments.forEach(obj => {
            obj.textMesh.applyMatrix4(moveMatrix);
            obj.postMesh.applyMatrix4(moveMatrix);
            obj.leaderLine.applyMatrix4(moveMatrix);
            threeObjs.push(obj.textMesh);
            threeObjs.push(obj.postMesh);
            threeObjs.push(obj.leaderLine);
        })

        threeItems.postNameLeader.leaderLine.applyMatrix4(moveMatrix);
        threeItems.postNameLeader.textMesh.applyMatrix4(moveMatrix);
        threeObjs.push(threeItems.postNameLeader.leaderLine);
        threeObjs.push(threeItems.postNameLeader.textMesh);

        threeItems.boringEndLeader.textMesh.applyMatrix4(moveMatrix);
        threeItems.boringEndLeader.leaderLine.applyMatrix4(moveMatrix);
        threeObjs.push(threeItems.boringEndLeader.textMesh);
        threeObjs.push(threeItems.boringEndLeader.leaderLine);

        return threeObjs;
    }
    
    static async createPost(boringName: string, topoTop: number, layers:{name: string, thickness:number, color: number}[], sptValues: {depth: number, hitCount: number, distance: number}[]) {
        const dims = DefaultDimensions.getInstance().getDims();
        const radius = dims.shoringPostRadius;
        const offsetText = 0.2;

        // Create post name objects
        const postNameLeader = await this.createLeader(boringName, 0.5, 0x000000, {curved: false, leaderLength: 3}, radius, 0.2, topoTop, 0x000000, -1);

        // Create cylinder segments
        let topoLevel = topoTop;
        const postSegments:{postMesh: THREE.Object3D; textMesh: THREE.Object3D; leaderLine: THREE.Line}[] = [];
        for(let i = 0; i < layers.length; i++) {
            const {name, thickness, color} = layers[i];
            if(i == 0) {
                const moveMatrix = new THREE.Matrix4();
                moveMatrix.makeTranslation(0, topoLevel - thickness*0.5, 0);
                const postSegment = await this.createPostSegmenet(
                    name,
                    `EL ${topoLevel}`,
                    thickness,
                    radius,
                    false,
                    offsetText,
                    color
                );

                postSegment.leaderLine.applyMatrix4(moveMatrix);
                postSegment.postMesh.applyMatrix4(moveMatrix);
                postSegment.textMesh.applyMatrix4(moveMatrix);

                postSegments.push(postSegment);
            } else {
                const moveMatrix = new THREE.Matrix4();
                moveMatrix.makeTranslation(0, topoLevel - thickness*0.5, 0);

                const postSegment = await this.createPostSegmenet(
                    name,
                    `EL ${topoLevel}`,
                    thickness,
                    radius,
                    layers[i-1].thickness < 0.6,
                    offsetText,
                    color
                );

                postSegment.leaderLine.applyMatrix4(moveMatrix);
                postSegment.postMesh.applyMatrix4(moveMatrix);
                postSegment.textMesh.applyMatrix4(moveMatrix);

                postSegments.push(postSegment);
            }

            topoLevel -= thickness;
        }

        // Create boring end leader
        let sum = 0;
        layers.forEach(layer => sum += layer.thickness);
        const boringEndLedaer = await this.createLeader(
            `시추종료 : ${topoTop - sum}`,
            0.5,
            0x000000,
            {curved: true, leaderSegmentLength: [1, 1, 1]},
            radius,
            0.2,
            topoTop - sum,
            0x000000,
            -1
        );

        const sptObjects = await this.createSPTResults(sptValues, topoTop);

        return {
            postNameLeader: postNameLeader,
            postSegments: postSegments,
            boringEndLeader: boringEndLedaer,
            sptObjects: sptObjects
        };
    }

    private static async createPostSegmenet(
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
                leaderSegmentLength: [2, 2, 2],
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

    private static async createLeader(
        text: string,
        fontSize = 0.5,
        textColor = 0x000000,
        leaderOption: { curved: boolean, leaderLength?: number, leaderSegmentLength?: number[]}, 
        offset: number,
        offsetText: number,
        coordY: number,
        leaderColor = 0x000000,
        directionFactor = 1
    ): Promise<{ textMesh: THREE.Object3D, leaderLine: THREE.Line, textGeometry: TextGeometry }> {
        const { curved, leaderLength, leaderSegmentLength } = leaderOption;
        const trueCases = 
            (curved && leaderSegmentLength.length == 3) ||
            (!curved && leaderLength);

        if (!trueCases) {
            if (!curved) {
                throw new Error('When leader is not curved, leaderLength should be given.');
            } else {
                throw new Error('When leader is curved, leaderSegmentLength should contain 3 numbers.');
            }
        }

        const material = new THREE.LineBasicMaterial({
            color: leaderColor
        });

        // Leader lines
        let line: THREE.Line;
        if (curved) {
            const pt1 = new THREE.Vector3(directionFactor*offset, coordY, 0);
            const pt2 = new THREE.Vector3(directionFactor*(offset + leaderSegmentLength[0]), coordY, 0);
            const pt3 = new THREE.Vector3(directionFactor*(offset + leaderSegmentLength[0]), coordY - leaderSegmentLength[1], 0);
            const pt4 = new THREE.Vector3(directionFactor*(offset + leaderSegmentLength[0] + leaderSegmentLength[2]), coordY - leaderSegmentLength[1], 0);
            const segmentPts = [pt1, pt2, pt3, pt4];
            console.log(segmentPts);
            const geometry = new THREE.BufferGeometry().setFromPoints(segmentPts);
            line = new THREE.Line(geometry, material);
        } else {
            const pt1 = new THREE.Vector3(directionFactor*offset, coordY, 0);
            const pt2 = new THREE.Vector3(directionFactor*(offset + leaderLength), coordY, 0);
            const segmentPts = [pt1, pt2];
            const geometry = new THREE.BufferGeometry().setFromPoints(segmentPts);
            line = new THREE.Line(geometry, material);
        }

        // Load font and create text geometry
        const textGeometry = await this.createTextGeometry(text, fontSize);
        const horLength = Math.abs(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        const verLength = Math.abs(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
        
        // Adjust position of the text
        const matrixCoord: {x: number, y: number, z: number} = {
            x: directionFactor == 1 ? directionFactor * (offset + (curved ? leaderSegmentLength[0] + leaderSegmentLength[2] : leaderLength) + offsetText) :
                                      directionFactor * (offset + (curved ? leaderSegmentLength[0] + leaderSegmentLength[2] : leaderLength) + offsetText + horLength),
            y: coordY - (curved ? leaderSegmentLength[1] : 0) - verLength*0.5,
            z: 0,
        };
        const textTranslationMatrix = new THREE.Matrix4();
        textTranslationMatrix.makeTranslation(
            matrixCoord.x,
            matrixCoord.y,
            matrixCoord.z
        );
        textGeometry.applyMatrix4(textTranslationMatrix);

        // Create the text mesh
        const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
            color: textColor,
        }));

        return {
            textMesh: textMesh,
            leaderLine: line,
            textGeometry: textGeometry
        }
    }

    private static async createTextGeometry(
        text: string,
        fontSize: number,
        textColor = 0x000000
    ): Promise<TextGeometry> {
        return new Promise((resolve, reject) => {
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
    
                // Resolve the promise with the created objects
                resolve(textGeometry);
            }, undefined, (error) => {
                reject(error);  // Reject the promise if font loading fails
            });
        })
    }

    static async createSPTResults(sptValues: {depth: number, hitCount: number, distance: number}[], topLevel: number, directionFactor = -1, offsetText = 0.1, leaderLength = 2, textColor = 0x000000) {
        const threeObjects:{ textSPTResultObject: THREE.Object3D, textDepthObject:THREE.Object3D, leaderLine: THREE.Line }[] = [];
        for(const spt of sptValues) {
            // Create leader objects
            const leaderObjects = await this.createLeader(
                `${spt.hitCount} / ${spt.distance}`,
                0.3,
                0x000000,
                {curved: false, leaderLength: leaderLength},
                0.2,
                offsetText,
                topLevel - spt.depth,
                0x000000,
                directionFactor
            );

            const hitCountTextLength = Math.abs(leaderObjects.textGeometry.boundingBox.max.x - leaderObjects.textGeometry.boundingBox.min.x);
            

            // Create depth geomtery
            const textGeometry = await this.createTextGeometry(spt.depth.toFixed(1).toString(), 0.3);
            const horLength = Math.abs(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
            const verLength = Math.abs(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);

            const matrix = new THREE.Matrix4();
            matrix.makeTranslation(
                directionFactor == 1 ? directionFactor*(leaderLength + offsetText) : directionFactor*(leaderLength + offsetText + horLength + hitCountTextLength + 1),
                topLevel - spt.depth - verLength*0.5,
                0
            );
            textGeometry.applyMatrix4(matrix);

            const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
                color: textColor,
            }));

            threeObjects.push({
                textSPTResultObject: leaderObjects.textMesh,
                textDepthObject: textMesh,
                leaderLine: leaderObjects.leaderLine
            });
        }

        return threeObjects;
    }
}