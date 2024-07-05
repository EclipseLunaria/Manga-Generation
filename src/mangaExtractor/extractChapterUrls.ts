import puppeteer from "puppeteer";

const ExtractChapterUrls = async (manga_url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(manga_url);
  const chapterUrls = await page.$$eval(
    ".panel-story-chapter-list a",
    (anchors) => {
      return anchors.map((anchor, index) => anchor.href);
    }
  );
  console.log("Found", chapterUrls.length, "chapters");
  await browser.close();
  return chapterUrls.reverse();
};

export default ExtractChapterUrls;
