$("#update-button").on("click", function (event) {
  event.preventDefault();
  console.log("clicked");
  window.location.assign("/");
})

$(".save-article").on("click", function () {
  const articleId = $(this).attr("article-id");
  const title = $(this).attr("article-title");
  const link = $(this).attr("article-link");
  const thisButton = $(this);
  const buttonsParent = $(this).parent().parent();

  console.log(articleId);
  $.ajax("/save/", {
    type: "POST",
    data: {
      title: title,
      link: link
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
  console.log("show");
  //functions to make the buttons and append them to the modal
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
  let newNote = $("#new-note-data").val();
  $.ajax("/note/", {
    type: "POST",
    data: {
      note: newNote
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