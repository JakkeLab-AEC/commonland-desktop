import * as THREE from 'three';
import { DefaultDimensions } from '../defaultConfigs/DefaultDimensionConfigs';

export class ThreeBoringPost {
    static readonly dims = DefaultDimensions.getInstance().getDims();

    static createPost(layers:{name: string, thickness:number}[]) {
        // Create cylinder segments
        const radius = ThreeBoringPost.dims.shoringPostRadius;
        const cylinders: THREE.CylinderGeometry[] = [];
        layers.forEach(layer => {
            cylinders.push(new THREE.CylinderGeometry(radius, radius, layer.thickness, 64));
        });
    }
}