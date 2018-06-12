$("#update-button").on("click", function (event) {
  event.preventDefault();
  console.log("clicked");
  // window.location.assign("/update/");
  $.ajax("/update/", {
    type: "GET"
  }).then(function(res){
    console.log(res);
  })
})

$(".save-article").on("click", function() {
  console.log("save-article");
  let articleId = $(this).attr("article-id");
  console.log(articleId);
  $.ajax("/articles/" + articleId, {
    type: "GET"
  }).then(function(res){
    console.log(res);
  })
})