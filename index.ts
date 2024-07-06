import SeriesExtractor from "./src/mangaExtractor/seriesExtractor";
import { ConvertToEpub, GenerateHtml } from "./src/epubGenerator";

(async () => {
  const SERIES_NAME = "Kimi No Love Wo Misetekure";
  const outputDir = "./Series";
  await SeriesExtractor(SERIES_NAME, outputDir);
  await GenerateHtml(`./Series/${SERIES_NAME}`);
  await ConvertToEpub(`./Series/${SERIES_NAME}`);
})();
