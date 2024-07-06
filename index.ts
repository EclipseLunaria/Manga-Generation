import ExtractSeries from "./src/services/extractSeries";
import ConvertToEpub from "./src/services/convertToEpub";
import GenerateHtml from "./src/services/generateHtml";

(async () => {
  const SERIES_NAME = "Kimi No Love Wo Misetekure";
  const outputDir = "./Series";
  await ExtractSeries(SERIES_NAME, outputDir);
  await GenerateHtml(`./Series/${SERIES_NAME}`);
  await ConvertToEpub(`./Series/${SERIES_NAME}`);
})();
