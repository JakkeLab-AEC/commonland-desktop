export const DB_TABLENAMES = {
    LAND_INFO: 'land_info',
    BORINGS: 'borings',
    LAYERS: 'layers',
    SPT_RESULTS: 'spt_results',
    LAYER_COLORS: 'layer_colors',
} as const;

/**
 * Type definition for database properties.
 */
type DBProps = typeof DB_TABLENAMES;

declare global {
    interface Window {
        DB: {
            Props: DBProps;
        }
    }
}

if (typeof window !== 'undefined') {
    window.DB = {
        Props: DB_TABLENAMES
    };
}