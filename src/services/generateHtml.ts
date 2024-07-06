import * as fs from "fs-extra";
import * as path from "path";
import {renderHtml} from "./helpers/generateHtmlHelpers";
import {getCombinedChapterImages} from "./helpers/imageHelpers";

const generateHtml = async (seriesPath: string) => {
  console.log("Generating HTML for", seriesPath);
  await fs.ensureDir(path.join(seriesPath, "html")); // used as working directory
  
  const chapterImageUris = await getCombinedChapterImages(seriesPath);
  await renderHtml(seriesPath, chapterImageUris);
};

export default generateHtml;
