// scrape script
// =============

// Require axios and cheerio,
var axios = require("axios");
var cheerio = require("cheerio");

// Scrape  NYTimes website
var scrape = function() {
  return axios.get("http://www.nytimes.com").then(function(res) {
    var $ = cheerio.load(res.data);
    // Save article info
    var articles = [];

    // Loop through each element that has the "css-8atqhb" for "article" class
    $("article.css-8atqhb").each(function(i, element) {
      //  article headline
      var head = $(this)
        .find("h2")
        .text()
        .trim();

      // Article URL
      var url = $(this)
        .find("a")
        .attr("href");

      // Article summary
      var sum = $(this)
        .find("p")
        .text()
        .trim();

      if (head && sum && url) {
        // trim function 
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // Initialize object, push to the articles array

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: "https://www.nytimes.com" + url
        };

        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

// Export function, 
module.exports = scrape;
