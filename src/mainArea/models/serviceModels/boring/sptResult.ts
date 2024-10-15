import { ServiceModel } from "../servicemodel";

export class SPTResult extends ServiceModel {
    private results: Map<number, {hitCount: number, distance: number}>;
    
    registerResult(depth: number, result: {hitCount: number, distance: number}){
        this.results.set(depth, result);
    }

    unregisterResult(depth: number) {
        this.results.delete(depth);
    }

    buildEmptySets(totalDepth: number) {
        for(let i = 1; i <= totalDepth; i += 0.5){
            this.results.set(i, {hitCount: 0, distance: 0});
        }
    }
    
    getAllResults():{id: string, depth: number, hitCount: number, distance: number}[] {
        const results: {id: string, depth: number, hitCount: number, distance: number}[] = [];
        this.results.forEach((value, key) => {
            results.push({
                id: this.elementId.getValue(),
                depth: key,
                hitCount: value.hitCount,
                distance: value.distance,
            });
        })

        return results;
    }

    constructor(key?: string) {
        super(key);
        this.results = new Map();
    }
}