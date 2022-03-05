export interface InventoryItem {
    productId: string;
    title: string;
    vendorId: number
}

export enum ScrapeRoutinesEnum {
    ALBUM = 'Album Surf',
}

export type ScrapeRoutine = (vendorId: number) => Promise<void>;

export type ScrapeRoutinesType = {
    [key in ScrapeRoutinesEnum]: ScrapeRoutine;
};
