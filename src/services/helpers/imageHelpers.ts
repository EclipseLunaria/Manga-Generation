import path from "path";
import fs from "fs-extra";
import { sortChapters } from "./generateHtmlHelpers";
import sharp from "sharp";
export const getCombinedChapterImages = async (seriesPath:string, workingDir:string = 'html')=> {
    const chapterPath = path.join(seriesPath, "chapters");
    const workingPath = path.join(seriesPath, workingDir);
    await fs.ensureDir(workingPath);

    const chapters = (await fs.readdir
    (chapterPath)).sort((a: string, b: string) => sortChapters(a, b))
    const chapterImages = [];
    for (const chapter of chapters) {
        const currentChapter = path.join(chapterPath, chapter);
        const pages = (await fs.readdir(currentChapter)).sort((a: string, b: string) => sortChapters(a, b));
        
        
        const chapterPageUris = pages.map((p: string) => path.join(currentChapter, p));
        const combinedImage = await combineImages(chapterPageUris, workingPath, chapter);
        chapterImages.push(combinedImage);
    }
    return chapterImages;

}

const combineImages = async (imagePaths:string[], outputDir:string, chapter:string) => {
    const { width, height } = { width: 800, height: 1200 };
    
    let totalHeight = height * imagePaths.length;

    // Create a blank canvas to composite the images onto
    let combinedImage = sharp({
        create: {
            width: width,
            height: totalHeight,
            channels: 3,
            background: { r: 255, g: 255, b: 255 }
        }
    }).jpeg();

    let currentHeight = 0;
    const composites: sharp.OverlayOptions[] = [];
    for (const imagePath of imagePaths) {
        const imageBuffer = await sharp(imagePath)
            .resize(width, height, { fit: 'contain' })
            .toBuffer();
        
        composites.push(
            {
                input: imageBuffer,
                top: currentHeight,
                left: 0,
            },
        )
            
        currentHeight += height;
    }
    combinedImage = combinedImage.composite(composites);
    const combinedImagePath = path.join(outputDir, `${chapter}.jpeg`);
    await combinedImage.toFile(combinedImagePath);
    return combinedImagePath;
};
