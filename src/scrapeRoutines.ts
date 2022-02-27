export enum ScrapeRoutinesEnum {
    ALBUM = 'Album',
}

export type ScrapeRoutinesType = {
    [key in ScrapeRoutinesEnum]: () => void;
};
