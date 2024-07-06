import * as fs from "fs-extra";
import * as path from "path";
import {
  SortChapters,
  GenerateChapterHTML,
  SaveChapterHtmlFile,
  BuildImagePaths,
} from "./helpers/generateHtmlHelpers";

const GenerateHtml = async (seriesPath: string) => {
  console.log("Generating HTML for", seriesPath);
  await fs.ensureDir(path.join(seriesPath, "html"));
  const chapterPath = path.join(seriesPath, "chapters");

  // const outputDir = path.join(seriesPath);
  const chapters = (await fs.readdir(chapterPath)).sort(
    (a: string, b: string) => SortChapters(a, b)
  );

  for (const chapter of chapters) {
    const currentChapter = path.join(chapterPath, chapter);
    console.log(currentChapter);

    const pages = (await fs.readdir(currentChapter)).sort(
      (a: string, b: string) => SortChapters(a, b)
    );

    const chapterPageUrls = BuildImagePaths(pages, currentChapter);

    const chapterHTML = await GenerateChapterHTML(chapter, chapterPageUrls);

    await SaveChapterHtmlFile(seriesPath, chapter, chapterHTML);
  }
};

export default GenerateHtml;
