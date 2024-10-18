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
    `);

    console.log("Tables recreated");
}