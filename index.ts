import SeriesExtractor from "./src/mangaExtractor/seriesExtractor";
import GenerateHtml from "./src/epubGenerator/generateHtml";
import FindSeries from "./src/mangaExtractor/findSeries";
import { convertToEpub } from "./join";

(async () => {
  const SERIES_NAME = "Alya Sometimes Hides Her Feelings In Russian";

  const collectChaptersAndConvcertToEpub = async (
    url: string,
    seriesName: string
  ) => {
    await SeriesExtractor(url, seriesName);
    await GenerateHtml(`./${seriesName}`);
    await convertToEpub(`./${seriesName}`);
  };
  const data = await FindSeries(SERIES_NAME);
  if (
    !data?.title ||
    !data?.link ||
    data.title.toLowerCase() !== SERIES_NAME.toLowerCase()
  ) {
    console.log("No series found");
    return;
  }
  await collectChaptersAndConvcertToEpub(data.link, data.title);
})();
