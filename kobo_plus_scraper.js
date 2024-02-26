const puppeteer = require("puppeteer");
const { parse } = require("json2csv");
const fs = require("fs");

async function scrapePage(url) {
//   const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const books = [];

  // Wait for the specific selector to be visible before proceeding
  await page.waitForSelector('.item-detail', { timeout: 60000 }); // Set timeout to 60 seconds (60000 milliseconds)

  const bookElements = await page.$$(".item-detail");
  for (const bookElement of bookElements) {
    const book = {};

    const titleElement = await bookElement.$(".title.product-field a");
    if (!titleElement) {
      console.log("Title element not found for a book.");
      continue; // Move to the next book if title element not found
    }

    book.bookName = await page.evaluate(
      (element) => element.innerText.trim(),
      titleElement
    );

    const authorElement = await bookElement.$(
      ".contributors .contributor-name"
    );
    const seriesElement = await bookElement.$(".series.product-field a");
    const summaryElement = await bookElement.$(".synopsis .synopsis-text");
    const ratingElement = await bookElement.$(".star-rating");
    const priceElement = await bookElement.$(".price-value");

    book.author = authorElement
      ? await page.evaluate(
          (element) => element.innerText.trim(),
          authorElement
        )
      : "N/A";
    book.series = seriesElement
      ? await page.evaluate(
          (element) => element.innerText.trim(),
          seriesElement
        )
      : "N/A";
    book.summary = summaryElement
      ? await page.evaluate(
          (element) => element.innerText.trim(),
          summaryElement
        )
      : "N/A";
    // Replace the rating with emoji representation
    book.rating = ratingElement
      ? await page.evaluate((element) => {
          const ratingText = element.getAttribute("aria-label").trim();
          const ratingMatch = ratingText.match(/(\d+(\.\d+)?) out of 5 stars/);

          if (!ratingMatch) {
            return "N/A";
          }

          const ratingValue = parseFloat(ratingMatch[1]);
          const ratingPercentage = (ratingValue / 5) * 100;
          const fullStars = Math.floor(ratingPercentage / 20);
          const hasHalfStar =
            ratingPercentage % 20 >= 10 && ratingPercentage !== 100;

          let ratingEmoji = "";
          for (let i = 0; i < fullStars; i++) {
            ratingEmoji += "⭐";
          }
          if (hasHalfStar) {
            ratingEmoji += "½";
          }

          return ratingEmoji || "N/A";
        }, ratingElement)
      : "N/A";

    // Replace the price with the second price if two prices are present
    book.price = priceElement
      ? await page.evaluate((element) => {
          const priceText = element.innerText.trim();
          const prices = priceText.match(/NT\$[\d\s.]+ TWD/g);

          // If there are no prices found or only one price, return it
          if (!prices || prices.length <= 1) {
            return priceText;
          }

          // Otherwise, return the second price
          return prices[1];
        }, priceElement)
      : "N/A";

    books.push(book);
  }

  await browser.close();
  return books;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const baseUrl =
    "https://www.kobo.com/tw/zh/search?query=&fcmedia=BookSubscription";
  let bookList = [];

  for (let page = 1; page <= 99; page++) {
    const url = `${baseUrl}&pageNumber=${page}`;
    console.log(`Scraping page ${page}...`);
    const booksOnPage = await scrapePage(url);
    console.log({ booksOnPage });
    bookList = bookList.concat(booksOnPage);
    console.log(`Page ${page} scraped successfully.`);

    // Sleep for a random period between 3 to 5 seconds before making the next request
    const sleepTime = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
    console.log(`Sleeping for ${sleepTime / 1000} seconds...`);
    await sleep(sleepTime);
  }

  // Check if bookList is empty before converting to CSV
  if (bookList.length > 0) {
    // Convert bookList to CSV format string
    const csvData = parse(bookList);

    // Write CSV data to a file
    fs.writeFileSync("book_info.csv", csvData, "utf8");

    console.log("Book information successfully written to book_info.csv file.");
  } else {
    console.log("No data found. Exiting...");
  }

  console.log("Book information successfully written to book_info.csv file.");
}

// Call the main function to start scraping
main();
