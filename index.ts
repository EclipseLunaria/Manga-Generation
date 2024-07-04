import ExtractChapter from "./pageExtractor";
import ExtractChapterUrls from "./extractChapterUrls";
import SeriesExtractor from "./seriesExtractor";
import * as fs from "fs";
fs.mkdirSync("./chapter-1", { recursive: true });
(async () => {
  SeriesExtractor("https://chapmanganato.to/manga-ui971665/", "Hajimete No Gal")
//   
})();
