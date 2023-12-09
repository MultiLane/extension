console.log("Load index.js of multilane");

(async () => {

})();

window.addEventListener("message", function (event) {
  // Check the event source and data, and handle the message
  if (event.source === window && event.data?.name === "multilane-website") {
    console.log("Message received!", event.data);
  }
});
