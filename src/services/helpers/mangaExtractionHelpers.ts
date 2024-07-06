import puppeteer from "puppeteer";
import * as fs from "fs-extra";
import axios from "axios";
import { load as loadhtml } from "cheerio";

export const ExtractChapter = async (
  chapter_url: string,
  chapterDir: string
) => {
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

export const ExtractChapterUrls = async (manga_url: string) => {
  // TODO: remove puppeteer as dependency
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(manga_url);
  const chapterUrls = await page.$$eval(
    ".panel-story-chapter-list a",
    (anchors) => {
      return anchors.map((anchor) => anchor.href);
    }
  );
  console.log("Found", chapterUrls.length, "chapters");
  await browser.close();
  return chapterUrls.reverse();
};
export const searchSeries = async (series: string) => {
  // TODO: Clean up implementation
  series = series.replace(/ /g, "_").replace(/,/g, "").toLowerCase();

  const searchUrl = `https://manganato.com/search/story/${series}`;
  console.log("Searching for series:", series, "at", searchUrl);

  const res = await axios.get(searchUrl);
  if (res.status !== 200) {
    throw new Error("Failed to fetch series");
  }

  const html = res.data;
  const $ = loadhtml(html);

  const stories = $(".item-img");
  if (stories.length === 0) {
    throw new Error("No stories found");
  }
  const firstStory = stories[0];
  const link = $(firstStory).attr("href");
  const title = $(firstStory).attr("title");

  if (!link || !title) {
    throw new Error("Failed to find series");
  }

  return { title, link };
};

export default searchSeries;
