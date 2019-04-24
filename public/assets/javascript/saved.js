/* global bootbox */
$(document).ready(function() {
  // Articlecontainerdiv rendering all articles 
  var articleContainer = $(".article-container");
  // Event listeners for deleting articles,
  // pulling up article notes, saving article notes, and deleting article notes
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    // Empty article container, run AJAX request 
    $.get("/api/headlines?saved=true").then(function(data) {
      articleContainer.empty();
      // Render headline to page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // or no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // Appending HTML article data to page
    // JSON of available articles 
    var articleCards = [];
    // Pass JSON object to createCard function return bootstrap with article data
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Append HTML to articleCards container
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    // Single JSON object for article/headline
    // jQuery element of  HTML for the article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
        $("<a class='btn btn-info notes'>Article Notes</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);

    // Attach article id 
    card.data("_id", article._id);
    // return card 
    return card;
  }

  function renderEmpty() {
    // Renders HTML to no articles to view
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending  data to page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // Rendering note list items to notes modal
    // Setting up an array of notes to render after finished
    // Setting up currentNote variable to temporarily store each note
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // If no notes, display a message 
      currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
      notesToRender.push(currentNote);
    } else {
      // If do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Element to contain noteText, delete button
        currentNote = $("<li class='list-group-item note'>")
          .text(data.notes[i].noteText)
          .append($("<button class='btn btn-danger note-delete'>x</button>"));
        // Store note id on delete button 
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding currentNote to notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Append notesToRender to note-container inside note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    // Deleting articles/headlines
    var articleToDelete = $(this)
      .parents(".card")
      .data();
    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // Run initPage re-render list
      if (data.ok) {
        initPage();
      }
    });
  }
  function handleArticleNotes(event) {
    // Opening notes modal and displaying notes
    var currentArticle = $(this)
      .parents(".card")
      .data();
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // HTML add to notes modal
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Notes For Article: " + currentArticle._id),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Note</button>")
      );
      // Add HTML to note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      $(".btn.save").data("article", noteData);
      // renderNotesList 
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    // Save new note   
    var noteData;
    var newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    // Delete  notes
    var noteToDelete = $(this).data("_id");
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("api/clear")
      .then(function() {
        articleContainer.empty();
        initPage();
      });
  }
});
