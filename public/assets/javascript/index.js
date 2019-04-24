/* global bootbox */
$(document).ready(function() {
  // Setting article-container div 
  // Event listeners to "save article"
  // "scrape new article" buttons
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    // AJAX request for any unsaved headlines
    $.get("/api/headlines?saved=false").then(function(data) {
      articleContainer.empty();
      // headlines render to page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // else no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // Appending HTML article data to page
    // JSON containing all available articles in database
    var articleCards = [];
    // Pass JSON object to createCard return bootstrap
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    //  HTML for the articles stored in our articleCards array,
    // append to articleCards container
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    // Take a single JSON object for an article/headline
    // Construct a jQuery element containing all HTML for the article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);
    // Attach article id to jQuery element
    card.data("_id", article._id);
    // Return card 
    return card;
  }

  function renderEmpty() {
    // Render HTML to Page 
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Append data to page
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    // Save article
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card 
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // update to existing record 
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      if (data.saved) {
        // Run initPage. Reload list 
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    // "scrape new article" button
    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  function handleArticleClear() {
    $.get("api/clear").then(function() {
      articleContainer.empty();
      initPage();
    });
  }
});
