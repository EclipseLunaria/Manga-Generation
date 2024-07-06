// import ExtractChapter from "../mangaExtraction/extractChapter";
// import ExtractChapterUrls from "../mangaExtraction/extractChapterUrls";
import {
  ExtractChapterUrls,
  ExtractChapter,
  searchSeries,
} from "./helpers/mangaExtractionHelpers";
import * as path from "path";

const ExtractSeries = async (SeriesName: string, outputDir: string = "./") => {
  const { title, link } = await searchSeries(SeriesName);
  // given manga home url
  const chapters = await ExtractChapterUrls(link);
  for (const chapter of chapters) {
    const chapterName = chapter.split("/").pop();

    if (!chapterName) {
      console.log("Chapter name not found");
      continue;
    }
    console.log("Chapter url:", chapter);
    await ExtractChapter(
      chapter,
      path.join(path.join(outputDir, SeriesName), "chapters", chapterName)
    );
    setTimeout(() => {}, 2000);
  }
};

export default ExtractSeries;
