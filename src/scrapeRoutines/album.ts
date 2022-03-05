import puppeteer from 'puppeteer';
import { Board } from '../generated/graphql';

type ScrapedBoard = Omit<Board, 'id'>

const albumScrapeRoutine = async (vendorId: number) => {
    const URL = 'https://albumsurf.com/collections/new-boards';
    const INVENTORY_ITEM_SELECTOR = '.product-block';
    const PAGINATION_ELEMENT_SELECTOR = '.pagination__number';
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        await page.goto(URL, {waitUntil: 'load', timeout: 0});

        const numberOfPagesInventory = await page.$$eval(PAGINATION_ELEMENT_SELECTOR, items => items.length);

        for (let inventoryPageNumber = 0; inventoryPageNumber < numberOfPagesInventory; inventoryPageNumber += 1) {

            // go to the right page
            if (inventoryPageNumber > 0) {
                await page.goto(`${URL}?page=${inventoryPageNumber + 1}`, {waitUntil: 'load', timeout: 0});
            }

            // Get the list of inventory items on each page
            const latestInventory: ScrapedBoard[] = await page.$$eval(INVENTORY_ITEM_SELECTOR, items =>
                items.map(item => {
                    const productId = item.getAttribute('data-product-id');
                    const title = item.querySelector('.product-block__title')?.textContent;
                    return {
                        productId,
                        title,
                        vendorId,
                    };
                })
            );

            // If the item is not in the db, then add it
            latestInventory.forEach((item: ScrapedBoard) => {
                // const existsInDb = !!(db.select().byPKey(item.productId));
                // if (!existsInDb) {
                //     db.upsert(item);
                // }
                console.log(item);
            });
        }

    } catch (e: unknown) {
        console.log('Oh no!', e);
    }

    await browser.close();
};

export default albumScrapeRoutine;