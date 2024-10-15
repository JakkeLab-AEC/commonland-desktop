import { DTOBase } from "../DTOBase";

export interface BoringDTO extends DTOBase {
    topoTop: number;
    undergroundWater: number,
    layers: {
        id: string,
        name: string,
        thickness: number,
    }[],
    location: {x: number, y: number},
    sptResults: {
        id: string,
        depth: number,
        hitCount: number,
        distance: number,
    }[],
}