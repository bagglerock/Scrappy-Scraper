$("#update-button").on("click", function (event) {
  event.preventDefault();
  console.log("clicked");
  window.location.assign("/");
})

$(".save-article").on("click", function() {
  let articleId = $(this).attr("article-id");
  let title = $(this).attr("article-title");
  let link = $(this).attr("article-link");
  let thisButton = $(this);
  let buttonsParent = $(this).parent().parent();

  console.log(articleId);
  $.ajax("/save/", {
    type: "POST",
    data: {
      title: title,
      link: link
    }
  }).then(function(res){
    //might have to look at this again later
    if (res.error){
      console.log("error has occured");
    } else {
      buttonsParent.removeClass("article-container").addClass("article-container-saved");
      thisButton.attr("value", "Already Saved"). attr("disabled", true);
    }
  })
})