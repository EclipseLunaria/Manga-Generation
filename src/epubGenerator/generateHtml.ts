import * as fs from "fs-extra";
import * as path from "path";
import * as ejs from "ejs";

const GenerateHtml = async (seriesPath: string) => {
  await fs.ensureDir(path.join(seriesPath, "html"));
  const outputDir = path.join(seriesPath);
  const chapters = (await fs.readdir(seriesPath)).sort((a: string, b: string) =>
    sortChapters(a, b)
  );

  for (const chapter of chapters) {
    const chapterPath = path.join(seriesPath, chapter);
    const pages = (await fs.readdir(chapterPath)).sort((a: string, b: string) =>
      sortChapters(a, b)
    );
    console.log(pages);

    const imgPageUrl = pages
      .map((p: string) => {
        return path.join(seriesPath, chapter, p);
      })
      .sort((a: string, b: string) => sortChapters(a, b));

    const chapterHTML = await ejs.renderFile(
      path.join(__dirname, "./templates", "chapter.ejs"),
      { chapterNumber: chapter.split("-")[1], pages: imgPageUrl }
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
