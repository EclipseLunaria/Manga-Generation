// import ExtractChapter from "../mangaExtraction/extractChapter";
// import ExtractChapterUrls from "../mangaExtraction/extractChapterUrls";
import {
  extractChapterUrls,
  searchSeries,
  extractChapterContent
} from "./helpers/mangaExtractionHelpers";
import * as path from "path";

const extractSeries = async (SeriesName: string, outputDir: string = "./") => {
  const link = await searchSeries(SeriesName);

  //extract metadata
  
  //check for new chapters

  //extract chapter contents
  const chapters = await extractChapterUrls(link);
  for (const chapterUrl of chapters) {
    const chapterName = chapterUrl.split("/").pop();

    if (!chapterName) {
      console.log("Chapter name not found");
      continue;
    }
    console.log("Chapter url:", chapterUrl);

    await extractChapterContent(chapterUrl, path.join(outputDir, SeriesName), chapterName);;

    setTimeout(() => {}, 2000);
  }
};

export default extractSeries;
