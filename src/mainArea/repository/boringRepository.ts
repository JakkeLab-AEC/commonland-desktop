import { BoringDTO } from "../../dto/serviceModel/BoringDTO";
import { Database } from "sqlite";
import { RepositryQueryBuilder } from "./utils/queryBuilder";
import { DB_TABLENAMES } from "../../public/databaseProps";
import { ModelType } from "../models/modelType";

interface BoringCRUDMethods {
    insertBoring(boringDto: BoringDTO): Promise<{ result: boolean, message?: string }>;
    fetchAllBorings(): Promise<{ result: boolean, message?: string, boringDatas?: BoringDTO }>;
}

interface BoringData {
    boring_id: string;
    name: string;
    location_x: number;
    location_y: number;
    topo_top: number;
    underground_water: number;
}

interface LayerData {
    layer_id: string;
    boring_id: string;
    layer_index: number;
    name: string;
    thickness: number;
}

interface SptResultData {
    spt_id: string;
    boring_id: string;
    depth: number;
    hitCount: number;
    distance: number;
}

type BoringWithLayer = BoringData & LayerData ;
type BoringWithSPT = BoringData & SptResultData;

export class BoringRepository implements BoringCRUDMethods {
    private db: Database;
    
    constructor(db: Database) {
        this.db = db;
    }

    async fetchAllBorings(): Promise<{result: boolean, message?: string, fetchedBorings?: BoringDTO[]}> {
        try {

            // Pre-defined props
            const boringColumns = ['boring_id', 'name', 'location_x', 'location_y', 'topo_top', 'underground_water'];
            const layerColumns = ['layer_id', 'boring_id', 'layer_index', 'name', 'thickness'];
            const sptResultColumns = ['spt_id', 'boring_id', 'depth', 'hitCount', 'distance'];
            
            const propsLayer = [
                ...boringColumns.map(col => `br.${col}`), 
                ...layerColumns.map(col => `ly.${col}`)
            ];
        
            const propsSPT = [
                ...boringColumns.map(col => `br.${col}`), 
                ...sptResultColumns.map(col => `sp.${col}`)
            ];

            // Prepare prestatement query
            const queryBorings = `
                SELECT
                    ${boringColumns}
                FROM
                    ${DB_TABLENAMES.BORINGS}
            `;

            const queryLayer =`
                SELECT
                    ${propsLayer.join(', ')}
                FROM
                    ${DB_TABLENAMES.BORINGS} br
                JOIN
                    ${DB_TABLENAMES.LAYERS} ly ON br.boring_id = ly.boring_id
                ORDER BY
                    br.boring_id, ly.layer_index
            `;
        
            const querySPT =`
                SELECT
                    ${propsSPT.join(', ')}
                FROM
                    ${DB_TABLENAMES.BORINGS} br
                JOIN
                    ${DB_TABLENAMES.SPT_RESULTS} sp ON br.boring_id = sp.boring_id
                ORDER BY
                    br.boring_id, sp.depth
            `;

            // Select borings
            const borings: BoringData[] = await this.db.all(queryBorings);

            // Select layers
            const layers: BoringWithLayer[] = await this.db.all(queryLayer);

            // Select spts
            const spts: BoringWithSPT[] = await this.db.all(querySPT);

            // Build boring DTO
            const fetchedBorings: BoringDTO[] = [];

            borings.forEach(boring => {
                const targetBoring: BoringDTO = {
                    name: boring.name,
                    topoTop: boring.topo_top,
                    undergroundWater: boring.underground_water,
                    layers: [],
                    location: {
                        x: 0,
                        y: 0
                    },
                    sptResults: [],
                    id: boring.boring_id,
                    modelType: ModelType.Service
                }

                // Get layers
                const targetLayers = layers.filter(layer => layer.boring_id == boring.boring_id);
                if(targetLayers.length > 0) {
                    const boringLayers = targetLayers.map(layer => {
                        return {
                            id: layer.layer_id,
                            layerIndex: layer.layer_index,
                            name: layer.name,
                            thickness: layer.thickness,
                        }
                    });

                    const orderedLayers = boringLayers.sort((a, b) => a.layerIndex - b.layerIndex);
                    targetBoring.layers = orderedLayers;
                }

                const targetSPTs = spts.filter(spt => spt.boring_id == boring.boring_id);
                if(targetSPTs.length > 0) {
                    const boringSPTs = targetSPTs.map(spt => {
                        return {
                            id: spt.spt_id,
                            depth: spt.depth,
                            hitCount: spt.hitCount,
                            distance: spt.distance,
                        }
                    });

                    const orderedSPTs = boringSPTs.sort((a, b) => a.depth - b.depth);
                    targetBoring.sptResults = orderedSPTs;
                }

                fetchedBorings.push(targetBoring);
            });
            
            return {
                result: true,
                fetchedBorings: fetchedBorings
            }
        } catch (error) {
            console.log(error);
            return {
                result: false,
                message: error
            };
        }
    }

    async insertBoring(boringDto: BoringDTO): Promise<{result: boolean, message?: string}> {
        const boringColumns = ['boring_id', 'name', 'location_x', 'location_y', 'topo_top', 'underground_water'];
        const layerColumns = ['layer_id', 'boring_id', 'layer_index', 'name', 'thickness'];
        const sptResultColumns = ['spt_id', 'boring_id', 'depth', 'hitCount', 'distance'];

        const boringInsertQuery = RepositryQueryBuilder.buildInsertQuery(DB_TABLENAMES.BORINGS, boringColumns);
        const boringParams = [
            boringDto.id,
            boringDto.name,
            boringDto.location.x,
            boringDto.location.y,
            boringDto.topoTop,
            boringDto.undergroundWater
        ];
        
        const layerInsertQuery = RepositryQueryBuilder.buildInsertQuery(DB_TABLENAMES.LAYERS, layerColumns);
        const layerParams = boringDto.layers.map(layer => {
            return [
                layer.id,
                boringDto.id,
                layer.layerIndex,
                layer.name,
                layer.thickness
            ];
        })

        const sptResultInsertQuery = RepositryQueryBuilder.buildInsertQuery(DB_TABLENAMES.SPT_RESULTS, sptResultColumns);
        const sptResultParams = boringDto.sptResults.map(spt => {
            return [
                spt.id,
                boringDto.id,
                spt.depth,
                spt.hitCount,
                spt.distance
            ];
        })

        try {
            // Transaction start
            await this.db.exec('BEGIN TRANSACTION');
            
            // Insert all datas
            await this.db.all(boringInsertQuery, boringParams);

            if(layerParams.length > 0){
                await this.db.all(layerInsertQuery, layerParams);
            }

            if(sptResultParams.length > 0){
                await this.db.all(sptResultInsertQuery, sptResultParams);
            }

            // COMMIT
            await this.db.exec('COMMIT');
            
            console.log('Insert Done');
            return {result: true}
        } catch (error) {
            await this.db.exec('ROLLBACK');
            console.log(error);
            return {result: false, message: error}
        }
    }
}