import SeriesExtractor from "./src/mangaExtractor/seriesExtractor";
import GenerateHtml from "./src/epubGenerator/generateHtml";
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

  await collectChaptersAndConvcertToEpub(
    "https://chapmanganato.to/manga-ui971665/",
    "Hajimete No Gal"
  );
  // await SeriesExtractor(
  //   "https://chapmanganato.to/manga-ui971665/",
  //   "Kimi No Love Wo Misetekure"
  // );
  // await GenerateHtml("./Kimi No Love Wo Misetekure");
  // await convertToEpub("./Kimi No Love Wo Misetekure");
})();
