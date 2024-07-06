import ExtractChapter from "./extractChapter";
import ExtractChapterUrls from "./extractChapterUrls";
import FindSeries from "./findSeries";
import * as path from "path";

const SeriesExtractor = async (
  SeriesName: string,
  outputDir: string = "./"
) => {
  const { title, link } = await FindSeries(SeriesName);
  // given manga home url
  const chapters = await ExtractChapterUrls(link);
  for (const chapter of chapters) {
    const chapterName = chapter.split("/").pop();

    if (!chapterName) {
      console.log("Chapter name not found");
      continue;
    }
    console.log("Extracting chapter:", chapterName);
    console.log("Chapter url:", chapter);
    await ExtractChapter(
      chapter,
      path.join(path.join(outputDir, SeriesName), "chapters", chapterName)
    );
    setTimeout(() => {}, 2000);
  }
};

export default SeriesExtractor;
