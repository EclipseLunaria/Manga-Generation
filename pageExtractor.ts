import puppeteer from "puppeteer";
 import * as fs from "fs"
const ExtractChapter = async (chapter_url:string, dir_name:string) => {
    console.log(dir_name)
    fs.mkdirSync(dir_name, {recursive:true})

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto(chapter_url,{timeout:60000});
    }
    catch{
        console.log("retrying "+chapter_url)
        try{
            await page.goto(chapter_url,{timeout:30000});
        }
        catch {
            browser.close()
            return
        }
        
    }
    const imageElements = await page.$$(".container-chapter-reader img");
    var i = 0;
    for (const imageElement of imageElements) {
        // scroll to 0, 0
        await page.evaluate(() => window.scrollTo(0, 0));
        const boundingBox = await imageElement.boundingBox();
        console.log(boundingBox);
        if (!boundingBox || boundingBox.height < 1000) {
            console.log("Image is not visible");
            continue;
        }

        await page.evaluate((boundingBox) => {
            window.scrollTo(boundingBox.x, boundingBox.y);
        }, boundingBox);
        await imageElement.screenshot({ path: `./${dir_name}/page-${i}.png` });
        i++;
    }

    await browser.close();
};

export default ExtractChapter;