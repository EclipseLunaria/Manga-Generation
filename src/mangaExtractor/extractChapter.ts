import puppeteer from "puppeteer";
import * as fs from "fs-extra";
const ExtractChapter = async (chapter_url: string, chapterDir: string) => {
  fs.ensureDirSync(chapterDir);
  console.log("Extracting chapter to", chapterDir);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(chapter_url, { timeout: 60000 });
  } catch {
    console.error("Failed to load page");
    await browser.close();
    return;
  }
  const imageElements = await page.$$(".container-chapter-reader img");
  var i = 0;
  for (const imageElement of imageElements) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const boundingBox = await imageElement.boundingBox();
    if (!boundingBox || boundingBox.height < 1000) {
      continue;
    }

    await page.evaluate((boundingBox) => {
      window.scrollTo(boundingBox.x, boundingBox.y);
    }, boundingBox);
    console.log("Taking screenshot of page", i);
    await imageElement.screenshot({
      path: `./${chapterDir}/page-${i}.jpeg`,
      type: "jpeg",
      quality: 70,
    });
    i++;
  }

  await browser.close();
};

export default ExtractChapter;
