import { app } from "electron";
import {Database, open} from 'sqlite';
import sqlite3 from 'sqlite3';
import path from "path";
import fs from 'fs';
import { DB_TABLENAMES } from "../../public/databaseProps";

export async function openDB() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.db');

    console.log(dbPath);
    // Ensure the directory exists
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        // Enable foreign key support
        await db.run('PRAGMA foreign_keys = OFF');
    
        await initializeDB(db);

        return db;
    } catch (error) {
        console.error('Failed to open database:', error);
        throw error;
    }
}

async function initializeDB(db: Database) {
    //DB Truncate : Delete all table
    await db.run("PRAGMA foreign_keys = OFF;");
    const tables = await db.all(`
        SELECT name FROM sqlite_master WHERE type='table';
    `);
    
    let i = 1;
    for (const { name } of tables) {
        console.log(`Job ${i++} : Drop Table ${name}`);
        // 테이블에 해당하는 트리거 삭제
        await db.run(`DROP TRIGGER IF EXISTS insert_layer_color_if_not_exists;`);
        await db.run(`DROP TRIGGER IF EXISTS delete_layer_color_if_no_layers;`);
        await db.run(`DROP TABLE IF EXISTS "${name}";`);
    }
    
    console.log("Existing tables dropped");

    await db.exec(`
        CREATE TABLE ${DB_TABLENAMES.LAND_INFO} (
            land_id TEXT PRIMARY KEY,
            name TEXT
        );

        CREATE TABLE ${DB_TABLENAMES.BORINGS} (
            boring_id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            location_x NUMERIC NOT NULL,
            location_y NUMERIC NOT NULL,
            topo_top NUMERIC NOT NULL,
            is_batched INTEGER NOT NULL CHECK (is_batched IN (0, 1)),
            underground_water NUMERIC NOT NULL
        );

        CREATE TABLE ${DB_TABLENAMES.LAYERS} (
            layer_id TEXT PRIMARY KEY,
            boring_id TEXT NOT NULL,
            layer_index NUMERIC NOT NULL,
            name TEXT NOT NULL,
            thickness NUMERIC NOT NULL,
            FOREIGN KEY (boring_id) REFERENCES ${DB_TABLENAMES.BORINGS} ON DELETE CASCADE,
            UNIQUE (boring_id, layer_index)
        );

        CREATE TABLE ${DB_TABLENAMES.SPT_RESULTS} (
            spt_id TEXT PRIMARY KEY,
            boring_id TEXT NOT NULL,
            depth NUMERIC NOT NULL,
            hitcount NUMERIC NOT NULL,
            distance NUMERIC NOT NULL,
            FOREIGN KEY (boring_id) REFERENCES ${DB_TABLENAMES.BORINGS} ON DELETE CASCADE,
            UNIQUE (boring_id, depth)
        );

        CREATE TABLE ${DB_TABLENAMES.LAYER_COLORS} (
            name TEXT NOT NULL UNIQUE,
            color_index NUMERIC NOT NULL
        );
    `);

    console.log("Tables recreated");

    // Add layer trigger
    await db.exec(`
        CREATE TRIGGER insert_layer_color_if_not_exists
        AFTER INSERT ON ${DB_TABLENAMES.LAYERS}
        FOR EACH ROW
        WHEN (NEW.name IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM ${DB_TABLENAMES.LAYER_COLORS} WHERE name = NEW.name
        ))
        BEGIN
            INSERT INTO 
                ${DB_TABLENAMES.LAYER_COLORS} (name, color_index)
            VALUES
                (NEW.name, 1);
        END;
    `);

    // Remove layer trigger
    await db.exec(`
        CREATE TRIGGER delete_layer_color_if_no_layers
        AFTER DELETE ON ${DB_TABLENAMES.LAYERS}
        FOR EACH ROW
        WHEN NOT EXISTS (
            SELECT 1 FROM ${DB_TABLENAMES.LAYERS} WHERE name = OLD.name
        )
        BEGIN
            DELETE FROM ${DB_TABLENAMES.LAYER_COLORS} WHERE name = OLD.name;
        END;
    `);

    // Update trigger
    await db.exec(`
        CREATE TRIGGER update_layer_color_on_name_change
        AFTER UPDATE ON ${DB_TABLENAMES.LAYERS}
        FOR EACH ROW
        BEGIN
            -- 새로운 이름이 기존 레이어에 존재하지 않는 경우에만 색상 추가
            INSERT OR IGNORE INTO ${DB_TABLENAMES.LAYER_COLORS} (name, color_index)
            VALUES (NEW.name, 1);
    
            -- 기존 이름이 더 이상 사용되지 않으면 색상 삭제
            DELETE FROM ${DB_TABLENAMES.LAYER_COLORS}
            WHERE name = OLD.name
            AND NOT EXISTS (
                SELECT 1 FROM ${DB_TABLENAMES.LAYERS} WHERE name = OLD.name
            );
    
            -- 병합된 경우 중복된 색상 삭제
            DELETE FROM ${DB_TABLENAMES.LAYER_COLORS}
            WHERE name = NEW.name
            AND EXISTS (
                SELECT 1 FROM ${DB_TABLENAMES.LAYER_COLORS} WHERE name = OLD.name
            );
        END;
    `);

    // Restore foreign key option
    await db.run("PRAGMA foreign_keys = ON;");
}

export async function truncateDB(db: Database) {
    try {
        await db.run('PRAGMA foreign_keys = OFF');

        const tables = await db.all(`
            SELECT name FROM sqlite_master WHERE type='table';
        `);
        
        let i = 1;
        for (const { name } of tables) {
            console.log(`Job ${i++} : Drop Table ${name}`);
            // 테이블에 해당하는 트리거 삭제
            await db.run(`DROP TRIGGER IF EXISTS insert_layer_color_if_not_exists;`);
            await db.run(`DROP TRIGGER IF EXISTS delete_layer_color_if_no_layers;`);
            await db.run(`DROP TABLE IF EXISTS "${name}";`);
        }

        console.log('Dropped all tables.');
    } catch (error) {
        console.error('Failed to truncate database:', error);
        throw error;
    }
}