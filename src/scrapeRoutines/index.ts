import { ScrapeRoutinesType, ScrapeRoutinesEnum } from '../types';
import { Vendor } from '../generated/graphql';
import albumScrapeRoutine from './album';

const ScrapeRoutines: ScrapeRoutinesType = {
    [ScrapeRoutinesEnum.ALBUM]: albumScrapeRoutine,
};

const scrapeInventoryFromVendor = async (vendor: Vendor) => {
    const scrapeRoutineTitle = vendor.title;
    if (!isValidScrapeRoutine(scrapeRoutineTitle)) {
        throw new Error(`Scrape routine does not exist for vendor with title ${vendor.title}`);
    }
    const executeRoutine = ScrapeRoutines[scrapeRoutineTitle as ScrapeRoutinesEnum];
    await executeRoutine(vendor.id);
};

const isValidScrapeRoutine = (name: string) => {
    return Object.values(ScrapeRoutinesEnum as object).includes(name);
};

export default scrapeInventoryFromVendor;
