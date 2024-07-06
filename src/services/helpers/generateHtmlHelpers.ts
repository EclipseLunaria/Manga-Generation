import path from "path";
import ejs from "ejs";
import fs from "fs-extra";
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

export const generateChapterHTML = async (
  chapter: string,
  imgPageUrls: string[]
) => {
  return await ejs.renderFile(
    path.join(__dirname, "../templates", "chapter.ejs"),
    { chapterNumber: chapter.split("-")[1], pages: imgPageUrls }
  );
};

export const saveChapterHtmlFile = async (
  seriesPath: string,
  chapter: string,
  chapterHTML: string
) => {
  await fs.outputFile(
    path.join(seriesPath, "html", `${chapter}.html`),
    chapterHTML
  );
};

export const buildImagePaths = (pages: string[], chapterPath: string) => {
  return pages
    .map((p: string) => {
      console.log(path.join(chapterPath, p));
      return path.join(chapterPath, p);
    })
    .sort((a: string, b: string) => sortChapters(a, b));
};
