import puppeteer from 'puppeteer';

const URL = 'https://albumsurf.com';
const INVENTORY_ITEM_SELECTOR = '.product-block';

interface InventoryItem {
  productId: string;
  title: string;
}

const init = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  try {
    const data: InventoryItem[] = await page.$$eval(INVENTORY_ITEM_SELECTOR, items => 
      items.map(item => {
        const productId = item.getAttribute('data-product-id');
        const title = item.querySelector('.product-block__title')?.textContent;
        return {
          productId,
          title
        };
      })
    );
    console.log(JSON.stringify(data));
  } catch (e) {
    console.log('e', e);
  }

  await browser.close();
};

init();
