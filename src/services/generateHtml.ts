import * as fs from "fs-extra";
import * as path from "path";
import * as ejs from "ejs";
import {
  sortChapters,
  generateChapterHTML,
  saveChapterHtmlFile,
  buildImagePaths,
} from "./helpers/generateHtmlHelpers";

const GenerateHtml = async (seriesPath: string) => {
  console.log("Generating HTML for", seriesPath);
  await fs.ensureDir(path.join(seriesPath, "html"));
  const chapterPath = path.join(seriesPath, "chapters");

  // const outputDir = path.join(seriesPath);
  const chapters = (await fs.readdir(chapterPath)).sort(
    (a: string, b: string) => sortChapters(a, b)
  );

  for (const chapter of chapters) {
    const currentChapter = path.join(chapterPath, chapter);
    console.log(currentChapter);

    const pages = (await fs.readdir(currentChapter)).sort(
      (a: string, b: string) => sortChapters(a, b)
    );

    const chapterPageUrls = buildImagePaths(pages, currentChapter);

    const chapterHTML = await generateChapterHTML(chapter, chapterPageUrls);

    await saveChapterHtmlFile(seriesPath, chapter, chapterHTML);
  }
};

export default GenerateHtml;
