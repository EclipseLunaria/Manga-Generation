import { exec } from "child_process";
import ejs from "ejs";
import path from "path";
import fs from "fs-extra";
import {getCombinedChapterImages} from "./imageHelpers";

export const generateHtml = async (seriesPath: string) => {
  console.log("Generating HTML for", seriesPath);
  await fs.ensureDir(path.join(seriesPath, "html")); // used as working directory
  
  const chapterImageUris = await getCombinedChapterImages(seriesPath);
  await renderHtml(seriesPath, chapterImageUris);
};

export const convertToEpub = async (seriesPath: string) => {
  const outputFile = `"${seriesPath.split("/").pop()}.epub"`;
  const input = path.join(seriesPath, "html", "index.html");
  const metadata = `--toc --toc-depth=2 --metadata title="\
    ${seriesPath
    .split("/")
    .pop()
    }" --epub-cover-image="${path.join(seriesPath,"cover.jpeg")}"`;
    
  const pandocCommand = `pandoc "${input}" -o ${outputFile}  ${metadata}`;
  console.log("Converting to EPUB with command:", pandocCommand);
  // Execute the Pandoc command
  await new Promise((resolve, reject) => {
    exec(pandocCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log("Ebook created successfully");
      Promise.resolve();
    });
  });
};


export const sortChapters = (a: string, b: string) => {
  const regex = /-(\d+)/;
  const chapterNumberA = Number(a.match(regex)?.[1]);
  const chapterNumberB = Number(b.match(regex)?.[1]);

  if (chapterNumberA && chapterNumberB) {
    return chapterNumberA - chapterNumberB;
  } else {
    return a.localeCompare(b);
  }
};

export const renderHtml = async (seriesPath: string, chapterImageUris:string[]) => {
  const seriesName = seriesPath.split("/").pop();
  const html = await ejs.renderFile(
    path.join(__dirname, "../templates/series.ejs"),
    { "seriesName":seriesName, "chapterImageUris":chapterImageUris }
  );
  await fs.outputFile(path.join(seriesPath, "html", "index.html"), html);

}