import ExtractChapter from "./pageExtractor";
import ExtractChapterUrls from "./extractChapterUrls";
import * as fs from "fs";
fs.mkdirSync("./chapter-1", { recursive: true });
(async () => {
    // given manga home url
    const manga_url = "https://chapmanganato.to/manga-ui971665";
    const chapters = await ExtractChapterUrls(manga_url)
    for (const chapter of chapters) {
        const chapterName = chapter.split('/').pop();
        
        if (!chapterName){
            console.log('no chapter name');
            continue
        }
        console.log(chapterName)
        await ExtractChapter(chapter, chapterName);
    };
   
    // await ExtractChapter("https://chapmanganato.to/manga-ui971665/chapter-1", "chapter-1");
})();
