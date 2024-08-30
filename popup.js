document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("Sending message to add to queue");
    chrome.tabs.sendMessage(tabs[0].id, {action: "addToQueue"});
  });
});