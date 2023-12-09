function loadScript(scriptName, callback) {
  var scriptEl = document.createElement("script");
  scriptEl.src = chrome.runtime.getURL("dist/" + scriptName + ".js");
  scriptEl.addEventListener("load", callback, false);
  document.head.appendChild(scriptEl);
}

document.addEventListener("DOMContentLoaded", function () {
  loadScript("index.bundle", function () {
    console.log("Loaded index.bundle.js");
  });
});

window.addEventListener("message", function (event) {
  // Check the event source and data, and handle the message
  if (event.source === window && event.data?.name === "multilane-content") {
    chrome.runtime.sendMessage(event.data, function (response) {
      window.postMessage(
        { name: "multilane-website", text: response },
        event.source.origin
      );
    });
  }
});
