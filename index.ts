import extractSeries from "./src/services/extractSeries";
import convertToEpub from "./src/services/convertToEpub";
import generateHtml from "./src/services/generateHtml";

(async () => {
  const SERIES_NAME = "Kimi No Love Wo Misetekure";
  const outputDir = "./Series";
  await extractSeries(SERIES_NAME, outputDir);
  await generateHtml(`./Series/${SERIES_NAME}`);
  await convertToEpub(`./Series/${SERIES_NAME}`);
})();
