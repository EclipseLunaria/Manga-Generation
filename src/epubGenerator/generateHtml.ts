import * as fs from "fs-extra";
import * as path from "path";
import * as ejs from "ejs";

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

    const imgPageUrls = buildImagePaths(pages, chapter);

    const chapterHTML = await generateChapterHTML(chapter, imgPageUrls);

    await saveChapterHtmlFile(chapter, chapterHTML);
  }

  async function saveChapterHtmlFile(chapter: string, chapterHTML: string) {
    await fs.outputFile(
      path.join(seriesPath, "html", `${chapter}.html`),
      chapterHTML
    );
  }

  // HELPER FUNCTIONS
  function buildImagePaths(pages: string[], chapter: string) {
    return pages
      .map((p: string) => {
        console.log(path.join(chapterPath, chapter, p));
        return path.join(chapterPath, chapter, p);
      })
      .sort((a: string, b: string) => sortChapters(a, b));
  }
  async function generateChapterHTML(chapter: string, imgPageUrls: string[]) {
    return await ejs.renderFile(
      path.join(__dirname, "./templates", "chapter.ejs"),
      { chapterNumber: chapter.split("-")[1], pages: imgPageUrls }
    );
  }

  const sortChapters = (a: string, b: string) => {
    const regex = /-(\d+)/;
    const chapterNumberA = Number(a.match(regex)?.[1]);
    const chapterNumberB = Number(b.match(regex)?.[1]);

    if (chapterNumberA && chapterNumberB) {
      return chapterNumberA - chapterNumberB;
    } else {
      return a.localeCompare(b);
    }
  };
};

export default GenerateHtml;
