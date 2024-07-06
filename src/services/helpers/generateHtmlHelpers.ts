import ejs from "ejs";
import path from "path";
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

export const renderHtml = async (seriesPath: string, chapterImageUris:string[]) => {
  const seriesName = seriesPath.split("/").pop();
  const html = await ejs.renderFile(
    path.join(__dirname, "../templates/series.ejs"),
    { "seriesName":seriesName, "chapterImageUris":chapterImageUris }
  );
  await fs.outputFile(path.join(seriesPath, "html", "index.html"), html);

}