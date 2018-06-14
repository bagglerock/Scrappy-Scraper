$("#update-button").on("click", function (event) {
  event.preventDefault();
  console.log("clicked");
  window.location.assign("/");
})

$(".save-article").on("click", function () {
  //const articleId = $(this).attr("article-id");
  const title = $(this).attr("article-title");
  const link = $(this).attr("article-link");
  const summary = $(this).attr("article-summary");
  const thisButton = $(this);
  const buttonsParent = $(this).parent().parent();

  $.ajax("/save/", {
    type: "POST",
    data: {
      title: title,
      link: link,
      summary: summary
    }
  }).then(function (res) {
    //might have to look at this again later
    if (res.error) {
      console.log("error has occured");
    } else {
      buttonsParent.removeClass("article-container").addClass("article-container-saved");
      thisButton.attr("value", "Already Saved").attr("disabled", true);
    }
  })
})

//  Event listener:  click to open filters modal
$(".show-article").on("click", function () {
  //functions to make the buttons and append them to the modal
  let articleId = $(this).attr("article-id");
  $.ajax("/saved/" + articleId, {
    type: "GET"
  }).then(function(article){
    $("#note-article-title").text(article.title);
    $("#note-post").attr("article-id", article._id);
    $("#last-note-title").text(article.note.title);
    $("#last-note-body").text(article.note.body);
  });
  $("#note-modal").show();
})

$(".remove-article").on("click", function () {
  let articleId = $(this).attr("article-id");

  $.ajax("/remove/" + articleId, {
    type: "DELETE"
  }).then(
    function () {
      location.reload();
    }
  );
})

$("#saved-page").on("click", function () {
  window.location.assign("/saved/");
})

$("#new-page").on("click", function () {
  console.log("new");
  window.location.assign("/");
})


$("#note-post").on("click", function() {
  let newNote = $("#new-note-body").val();
  let newTitle = $("#new-note-title").val();
  let articleId = $("#note-post").attr("article-id");

  $.ajax("/note/" + articleId, {
    type: "POST",
    data: {
      title: newTitle,
      body: newNote
    }
  }).then(function(res){
    console.log(res);
  });
})


$("#note-cancel").on("click", function () {
  $(".modal").hide();
})


//  Event listener:  click to close a general modal when clicked outside of the modal
$(document).on("click", function (event) {
  var modalClass = document.getElementsByClassName("modal");
  for (var i = 0; i < modalClass.length; i++) {
    if (event.target == modalClass[i]) {
      $(".modal").hide();
    }
  }
});