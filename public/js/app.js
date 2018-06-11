$("#update-button").on("click", function (event) {
  event.preventDefault();
  console.log("clicked");
  window.location.assign("/update/");
})

$(".save-article").on("click", function() {
  console.log("save-article");
})