// import ExtractChapter from "../mangaExtraction/extractChapter";
// import ExtractChapterUrls from "../mangaExtraction/extractChapterUrls";
import {
  extractChapterUrls,
  extractChapter,
  searchSeries,
} from "./helpers/mangaExtractionHelpers";
import * as path from "path";

const extractSeries = async (SeriesName: string, outputDir: string = "./") => {
  const link = await searchSeries(SeriesName);
  // given manga home url
  const chapters = await extractChapterUrls(link);
  for (const chapter of chapters) {
    const chapterName = chapter.split("/").pop();

    if (!chapterName) {
      console.log("Chapter name not found");
      continue;
    }
    console.log("Chapter url:", chapter);
    await extractChapter(
      chapter,
      path.join(path.join(outputDir, SeriesName), "chapters", chapterName)
    );
    setTimeout(() => {}, 2000);
  }
};

export default extractSeries;
