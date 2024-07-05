import SeriesExtractor from "./src/mangaExtractor/seriesExtractor";
import GenerateHtml from "./src/epubGenerator/generateHtml";
import FindSeries from "./src/mangaExtractor/findSeries";
import { convertToEpub } from "./src/epubGenerator/join";

(async () => {
  const SERIES_NAME = "Kimi No Love Wo Misetekure";
  const collectChaptersAndConvcertToEpub = async (
    url: string,
    seriesName: string
  ) => {
    // await SeriesExtractor(url, seriesName);
    await GenerateHtml(`./${seriesName}`);
    await convertToEpub(`./${seriesName}`);
  };
  const data = await FindSeries(SERIES_NAME);
  console.log(data);
  if (!data?.title || !data?.link) {
    console.log("No series found");
    return;
  }
  await collectChaptersAndConvcertToEpub(data.link, data.title);
})();
