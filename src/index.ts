import getVendors from './getVendors';
import scrapeInventoryFromVendor from './scrapeRoutines';

const init = async () => {
    const vendors = await getVendors();
    vendors.forEach(scrapeInventoryFromVendor);
};

init()
    .then(() => console.log('yay'))
    .catch((e: unknown) => console.log('oh no!', e));
