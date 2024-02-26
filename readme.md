# Kobo Plus Subscription Scraper

This script is designed to scrape book information from the Kobo Plus subscription service. Since Kobo Plus lacks a comprehensive book list, this web scraper extracts book details including titles, authors, series, summaries, ratings, and prices. The scraped data is then saved to a CSV file named book_info.csv for further analysis or use.

## Prerequisites
Ensure you have Node.js installed on your system.

## Installation
1. Clone or download this repository to your local machine.
2. Install dependencies by running npm install in the project directory.

## Usage
To start scraping book information from Kobo Plus, run the script using Node.js:

```sh
node kobo_plus_scraper.js
```

The script will iterate through multiple pages of Kobo Plus books, scraping the information for each book. It waits for a random period between 3 to 5 seconds between requests to avoid overwhelming the server.

## Output

After scraping, the script will generate a CSV file named book_info.csv in the project directory. This file contains the following columns:

1. bookName: Title of the book.
2. author: Author(s) of the book.
3. series: Series information of the book, if available.
4. summary: Summary or synopsis of the book.
5. rating: Rating of the book represented by emojis.
6. price: Price of the book in TWD.

If no data is found during scraping, the script will terminate with a corresponding message.

## Notes
- This script utilizes Puppeteer, a Node library which provides a high-level API over the Chrome DevTools Protocol, to automate web scraping.
- Make sure to adhere to Kobo's terms of service and usage policies while using this script. Automated scraping may be against the terms of service of certain websites.
- Adjustments to the script may be necessary based on changes in the structure of the Kobo Plus website.

## Disclaimer

This script is provided for educational purposes only. The user is solely responsible for any actions taken using this script.




