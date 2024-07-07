import  fs from "fs-extra";
import path from "path";
import axios from "axios";
import { load as loadhtml } from "cheerio";
import { MangaWebDriver } from "../utils/WebDriver";
import { downloadImage } from "./imageHelpers";
 
export const extractSeries = async (SeriesName: string, workingDir: string = "./") => {
  const seriesPath = path.join(workingDir, SeriesName);
  const mangaUrl = await searchSeries(SeriesName);
  //extract metadata
  extractCoverImage(mangaUrl,seriesPath);
  //check for new chapters
  const chapters = await extractChapterUrls(mangaUrl);
  for (const chapterUrl of chapters) {
    const chapterName = chapterUrl.split("/").pop();
    if (!chapterName) {
      throw Error("Chapter name not found");
    }
    
    await extractChapterContent(chapterUrl, path.join(workingDir, SeriesName), chapterName);
    setTimeout(() => {}, 2000);
  }
};

export const extractChapterContent = async (chapter_url: string, seriesPath: string, chapter:string) => {
  console.log("Extracting chapter: ", chapter.split("-").pop());
  fs.ensureDirSync(`${seriesPath}/chapters/${chapter}`);
  
  let driver = new MangaWebDriver();
  let page;
  try{
    page = await driver.getPage(chapter_url);
  const imageElements = await page.getElements(".container-chapter-reader img");
  let j = 0;

  for (const imageElement of imageElements) {
    const pagePath = `${seriesPath}/chapters/${chapter}/page-${j}.jpeg`;
    if (await page.screenshotElement(imageElement, pagePath)){
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

export const extractCoverImage = async (series_url: string, seriesPath: string) => {
  const $ = await fetchWebpage(series_url);
  
  const coverImageUrl = $(".info-image .img-loading").attr("src");
  if (coverImageUrl){
    downloadImage(coverImageUrl, `${seriesPath}/cover.jpeg`);
  }
}


export const extractChapterUrls = async (manga_url: string) => {
  const $ = await fetchWebpage(manga_url);

  const chapterUrls = $(".chapter-name").map((i, el) => {
    return $(el).attr("href");
  }).get();

  console.log("Found", chapterUrls.length, "chapters");
  return chapterUrls.reverse();
};
export const searchSeries = async (seriesName: string) => {
  seriesName = seriesName.replace(/ /g, "_").replace(/,/g, "").toLowerCase();
  const searchUrl = `https://manganato.com/search/story/${seriesName}`;
  console.log("Searching for series:", seriesName, "at", searchUrl);
  
  const $ = await fetchWebpage(searchUrl);
  const seriesElement = $(".item-img").first();
  if (!seriesElement) {
    throw new Error("No series found");
  }
  const seriesUrl = seriesElement.attr("href");
  if (!seriesUrl) {
    throw new Error("Failed to find series");
  }

  return seriesUrl;
};

const fetchWebpage = async (url: string) => {
  const res = await axios.get(url);
  if (res.status !== 200) {
    throw new Error("Failed to fetch webpage");
  }
  
  const html = res.data;
  const $ = loadhtml(html);
  return $;
}

