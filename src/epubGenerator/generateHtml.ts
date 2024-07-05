import * as fs from "fs-extra";
import * as path from "path";
import * as ejs from "ejs";

const GenerateHtml = async (
  seriesPath: string,
  outputDir: string = seriesPath
) => {
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
    console.log(pages);

    const imgPageUrls = pages
      .map((p: string) => {
        console.log(path.join(chapterPath, chapter, p));
        return path.join(chapterPath, chapter, p);
      })
      .sort((a: string, b: string) => sortChapters(a, b));

    const chapterHTML = await ejs.renderFile(
      path.join(__dirname, "./templates", "chapter.ejs"),
      { chapterNumber: chapter.split("-")[1], pages: imgPageUrls }
    );

    await fs.outputFile(
      path.join(seriesPath, "html", `${chapter}.html`),
      chapterHTML
    );
  }
};

const sortChapters = (a: string, b: string) => {
  // handle case where fil contains a .jpg
  let as = a;
  let bs = b;
  if (
    (as.includes(".jpeg") && bs.includes(".jpeg")) ||
    (as.includes(".png") && bs.includes(".png"))
  ) {
    as = a.split(".")[0];
    bs = b.split(".")[0];
  }
  as = as.split("-")[1];
  bs = bs.split("-")[1];

  if (Number(as) < Number(bs)) {
    return -1;
  } else if (Number(as) > Number(bs)) {
    return 1;
  } else {
    return 0;
  }
};

export default GenerateHtml;
