import fs from 'fs';
import { InventoryItem } from './types';

const CHARACTER_ENCODING = 'utf-8';
const DATABASE_FILE = 'db.json';

interface DatabaseInterface {
    select: () => DatabaseInterface;
    all: () => DatabaseTable;
    byPKey: (key: string) => string;
    upsert: (item: InventoryItem) => void;
}

export interface DatabaseTable {
    [key: string]: string;
}

class Database implements DatabaseInterface {
    private filePath: string;
    private currentSelection: DatabaseTable;

    constructor() {
        this.filePath = DATABASE_FILE;
        this.currentSelection = {};
    }

    private dbFileExists(): boolean {
        return fs.existsSync(this.filePath);
    }

    public select(): this {
        if (this.dbFileExists) {
            const data = fs.readFileSync(this.filePath, CHARACTER_ENCODING);
            this.currentSelection = JSON.parse(data) as DatabaseTable;
        } else {
            throw new Error('Database file does not exist!');
        }
        return this;
    }

    public all(): DatabaseTable {
        return this.currentSelection;
    }

    public byPKey(key: string): string {
        return this.currentSelection[key];
    }

    public upsert(item: InventoryItem): void {
        let data: DatabaseTable;
        if (this.dbFileExists) {
            data = JSON.parse(fs.readFileSync(this.filePath, CHARACTER_ENCODING)) as DatabaseTable;
        } else {
            data = {};
        }
        const newData: DatabaseTable = {
            ...data,
            [item.productId]: item.title,
        };
        fs.writeFileSync(this.filePath, JSON.stringify(newData, null, 4), CHARACTER_ENCODING);
    }
}

export default Database;
