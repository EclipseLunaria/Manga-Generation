import axios from "axios";
import { load as loadhtml } from "cheerio";

const FindSeries = async (series: string) => {
  series = series.replace(/ /g, "_").replace(/,/g, "").toLowerCase();

  const searchUrl = `https://manganato.com/search/story/${series}`;
  console.log("Searching for series:", series, "at", searchUrl);

  const res = await axios.get(searchUrl);
  if (res.status !== 200) {
    throw new Error("Failed to fetch series");
  }

  const html = res.data;
  const $ = loadhtml(html);

  const stories = $(".item-img");
  if (stories.length === 0) {
    throw new Error("No stories found");
  }
  const firstStory = stories[0];
  const link = $(firstStory).attr("href");
  const title = $(firstStory).attr("title");

  if (!link || !title) {
    throw new Error("Failed to find series");
  }

  return { title, link };
};

export default FindSeries;
