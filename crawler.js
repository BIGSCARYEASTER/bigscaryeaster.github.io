const puppeteer = require("puppeteer");
const fs = require("fs");

const START_URL = "https://www.nasa.gov";
const visited = new Set();
const queue = [START_URL];
const pages = [];

const MAX_PAGES = 20;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;

    visited.add(url);
    console.log("Crawling:", url);

    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      const data = await page.evaluate(() => {
        return {
          title: document.title,
          content: document.body.innerText,
          links: Array.from(document.querySelectorAll("a"))
            .map(a => a.href)
        };
      });

      pages.push({
        url,
        title: data.title,
        content: data.content
      });

      data.links.forEach(link => {
        if (
          link.startsWith("https://www.nasa.gov") &&
          !visited.has(link)
        ) {
          queue.push(link);
        }
      });

    } catch (err) {
      console.log("Failed:", url);
    }
  }

  fs.writeFileSync("index.json", JSON.stringify(pages, null, 2));

  await browser.close();
  console.log("Saved", pages.length, "pages");
})();