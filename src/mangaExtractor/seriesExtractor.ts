import ExtractChapter from "./pageExtractor";
import ExtractChapterUrls from "./extractChapterUrls";
import * as path from "path";

const SeriesExtractor = async (mangaUrl: string, seriesDir: string) => {
  // given manga home url
  const chapters = await ExtractChapterUrls(mangaUrl);
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
      path.join(seriesDir, "chapters", chapterName)
    );
    setTimeout(() => {}, 2000);
  }
};

export default SeriesExtractor;
