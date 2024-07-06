import * as fs from "fs-extra";
import axios from "axios";
import { load as loadhtml } from "cheerio";
import { MangaWebDriver, MangaPage } from "./WebDriver";
 
export const extractChapterContent = async (chapter_url: string, seriesPath: string, chapter:string) => {
  fs.ensureDirSync(`${seriesPath}/chapters/${chapter}`);
  let driver = new MangaWebDriver();
  let page;
  try{
    page = await driver.getPage(chapter_url);
  const imageElements = await page.getElements(".container-chapter-reader img");
  let j = 0;

  for (const imageElement of imageElements) {
    const shotTaken = await page.screenshotElement(imageElement, `${seriesPath}/chapters/${chapter}/page-${j}.jpeg`);
    if (shotTaken){
      j++;
    }
  }
} finally{
  if (page){
    page.close()
  }
  driver.close();
  }

}

export const extractChapterUrls = async (manga_url: string) => {
  // TODO: remove puppeteer as dependency

  console.log("Extracting chapter urls from", manga_url); 
  const res = await axios.get(manga_url);
  if (res.status !== 200) {
    throw new Error("Failed to fetch series");
  }
  const html = res.data;
  const $ = loadhtml(html);

  const urls: string[] = [];
  $(".chapter-name").each((i, el) => {
    const url = $(el).attr("href");
    
    if (url) {
      urls.push(url);
    }
  });

  console.log("Found", urls.length, "chapters");

  return urls.reverse();
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

  if (!link) {
    throw new Error("Failed to find series");
  }

  return link;
};

export default searchSeries;
