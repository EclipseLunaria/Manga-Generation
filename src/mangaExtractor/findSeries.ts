import axios from "axios";
import cheerio from "cheerio";

const FindSeries = async (series: string) => {
  try {
    const seriesSearch = series.replace(/ /g, "_").toLowerCase();
    console.log("Searching for series:", seriesSearch);
    const searchUrl = `https://manganato.com/search/story/${seriesSearch}`;
    console.log("Searching for series:", series, "at", searchUrl);
    const res = await axios.get(searchUrl);
    if (res.status !== 200) {
      throw new Error("Failed to fetch series");
    }
    const html = res.data;
    const $ = cheerio.load(html);

    const stories = $(".item-img");
    if (stories.length === 0) {
      console.log("No stories found");
      throw new Error("No stories found");
    }
    const firstStory = stories[0];
    const link = $(firstStory).attr("href");
    const title = $(firstStory).attr("title");
    return { title, link };
  } catch (error) {
    console.error("Error:", (error as any).message);
  }
};

export default FindSeries;
