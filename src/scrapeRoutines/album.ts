import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import getBoardByVendorProductId from '../getBoardByVendorProductId';
import { Board } from '../generated/graphql';
import upsertBoard from '../upsertBoard';
import { sendSmsMessage } from '../aws';

dotenv.config();

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
                        vendorProductId: productId,
                        title,
                        inStock: true,
                    };
                })
            );

            const inventoryWithVendorIds = latestInventory.map(i => ({ ...i, vendorId }));

            // If the item is not in the db, then add it
            for (const scrapedBoard of inventoryWithVendorIds) {
                const matchingBoards = await getBoardByVendorProductId(scrapedBoard.vendorId, scrapedBoard.vendorProductId);
                if (!matchingBoards.length) {
                    await sendSmsMessage(process.env.MY_PHONE_NUMBER, `
                        New board! ${scrapedBoard.title}
                    `);
                }
                await upsertBoard(scrapedBoard);
            }
        }

    } catch (e: unknown) {
        console.log('Oh no!', e);
    }

    await browser.close();
};

export default albumScrapeRoutine;
