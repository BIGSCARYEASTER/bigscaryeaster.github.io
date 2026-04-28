const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const START_URL = "https://www.nasa.gov";
const visited = new Set();
const pages = [];

const MAX_PAGES = 30; // keep small for demo

async function crawl(url) {
  if (visited.has(url) || visited.size >= MAX_PAGES) return;

  visited.add(url);
  console.log("Crawling:", url);

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text();
    const content = $("body").text().replace(/\s+/g, " ").trim();

    pages.push({
      url,
      title,
      content
    });

    $("a").each((i, el) => {
      let link = $(el).attr("href");

      if (!link) return;

      // Convert relative → absolute
      if (link.startsWith("/")) {
        link = START_URL + link;
      }

      // Only crawl NASA domain
      if (link.startsWith(START_URL)) {
        crawl(link);
      }
    });

  } catch (err) {
    console.log("Failed:", url);
  }
}

(async () => {
  await crawl(START_URL);

  fs.writeFileSync("index.json", JSON.stringify(pages, null, 2));
  console.log("Saved index.json");
})();
