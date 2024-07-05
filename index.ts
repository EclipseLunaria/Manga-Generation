import SeriesExtractor from "./src/mangaExtractor/seriesExtractor";
import GenerateHtml from "./src/epubGenerator/generateHtml";
import FindSeries from "./src/mangaExtractor/findSeries";
import * as fs from "fs";
import { convertToEpub } from "./join";
fs.mkdirSync("./chapter-1", { recursive: true });
(async () => {
  const collectChaptersAndConvcertToEpub = async (
    url: string,
    seriesName: string
  ) => {
    await SeriesExtractor(url, seriesName);
    await GenerateHtml(`./${seriesName}`);
    await convertToEpub(`./${seriesName}`);
  };
  const data = await FindSeries("Alya Sometimes Hides Her Feelings In Russian");
  if (!data?.title || !data?.link) {
    console.log("No series found");
    return;
  }
  await collectChaptersAndConvcertToEpub(data.link, data.title);
  
})();
