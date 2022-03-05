import { Vendor } from '../generated/graphql';
import albumScrapeRoutine from './album';

enum ScrapeRoutinesEnum {
    ALBUM = 'Album Surf',
}

type ScrapeRoutine = (vendorId: number) => void;

type ScrapeRoutinesType = {
    [key in ScrapeRoutinesEnum]: ScrapeRoutine;
};

const ScrapeRoutines: ScrapeRoutinesType = {
    [ScrapeRoutinesEnum.ALBUM]: albumScrapeRoutine,
};

const scrapeInventoryFromVendor = (vendor: Vendor) => {
    const scrapeRoutineTitle = vendor.title;
    if (!isValidScrapeRoutine(scrapeRoutineTitle)) {
        throw new Error(`Scrape routine does not exist for vendor with title ${vendor.title}`);
    }
    const executeRoutine = ScrapeRoutines[scrapeRoutineTitle as ScrapeRoutinesEnum];
    executeRoutine(vendor.id);
};

const isValidScrapeRoutine = (name: string) => {
    return Object.values(ScrapeRoutinesEnum as object).includes(name);
};

export default scrapeInventoryFromVendor;
