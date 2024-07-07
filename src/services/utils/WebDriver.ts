import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';

export class MangaWebDriver {
    private driver: Browser | null = null;

    public isOpen = () => this.driver !== null;

    public async initialize() {
        this.driver = await puppeteer.launch();
    }

    public close = async () => {
        if (this.driver) {
            await this.driver.close();
            this.driver = null;
        }
    }

    public getPage = async (url: string) => {
        if (!this.isOpen()){
            await this.initialize();
        }
        if (!this.driver) {
            throw new Error("Driver not initialized");
        }
        const page = await this.driver.newPage();
        await page.goto(url);
        return new MangaPage(page);
    }
}

export class MangaPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public getElements = async (selector: string) => {
        return this.page.$$(selector);
    }

    public screenshotElement = async (element: ElementHandle, outputpath: string) => {
        const boundingBox = await element.boundingBox();
        if (!boundingBox || boundingBox.height < 1000) {
            return false;
        }
        await this.page.evaluate((boundingBox) => {
            window.scrollTo(boundingBox.x, boundingBox.y);
        }, boundingBox);

        await element.screenshot({
            path: outputpath,
            type: "jpeg",
            quality: 70,
        });
        return true;
    }

    public close = async () => {
        await this.page.close();
    }
}


