import puppeteer from 'puppeteer';
import Database from './db';
import { InventoryItem } from './types';

const URL = 'https://albumsurf.com';
const INVENTORY_ITEM_SELECTOR = '.product-block';

const db: Database = new Database();

const init = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);

    // Get latest inventory
    const latestInventory: InventoryItem[] = await page.$$eval(INVENTORY_ITEM_SELECTOR, items =>
      items.map(item => {
        const productId = item.getAttribute('data-product-id');
        const title = item.querySelector('.product-block__title')?.textContent;
        return {
          productId,
          title
        };
      })
    );

    latestInventory.forEach((item: InventoryItem) => {
      const existsInDb = !!(db.select().byPKey(item.productId));
      if (!existsInDb) {
        db.upsert(item);
      }
    });

    await browser.close();

  } catch (e: unknown) {
    console.log('Oh no!');
  }

};

init();
