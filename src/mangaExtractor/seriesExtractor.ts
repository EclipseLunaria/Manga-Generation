import ExtractChapter from "./pageExtractor";
import ExtractChapterUrls from "./extractChapterUrls";
import * as fs from "fs";
import * as path from "path";
const SeriesExtractor = async (mangaUrl: string, seriesDir: string) => {
  // given manga home url
  const chapters = await ExtractChapterUrls(mangaUrl);
  for (const chapter of chapters) {
    const chapterName = chapter.split("/").pop();

    if (!chapterName) {
      console.log("no chapter name");
      continue;
    }
    console.log(chapterName); //change
    await ExtractChapter(chapter, path.join(seriesDir,chapterName));
    setTimeout(() => {}, 2000);
  }
};

export default SeriesExtractor
