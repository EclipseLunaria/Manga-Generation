import {extractSeries} from './helpers/mangaExtractionHelpers';
import { generateHtml, convertToEpub } from './helpers/generateHtmlHelpers';

// This function will take a series name and convert it to an epub file
export const convertManga = async (seriesName: string) => {
    const workingDir = "./tmp";
    const seriesPath = `${workingDir}/${seriesName}`
    await extractSeries(seriesName, workingDir);
    await generateHtml(seriesPath);
    await convertToEpub(seriesPath);

}