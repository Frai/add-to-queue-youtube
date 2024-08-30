chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "addToQueue") {
    addNotificationVideosToQueue();
  }
});

function addNotificationVideosToQueue() {
  // Select all notification items
  const notificationItems = document.querySelectorAll('ytd-notification-renderer');
  
  notificationItems.forEach(item => {
    // Find the video link within the notification item
    const videoLink = item.querySelector('a#thumbnail');
    if (videoLink) {
      const videoId = videoLink.href.split('v=')[1];
      if (videoId) {
        addVideoToQueue(videoId);
      }
    }
  });
}

function addVideoToQueue(videoId) {
  // Create a new XMLHttpRequest
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://www.youtube.com/watch_queue_ajax', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  
  // Prepare the data to be sent
  const data = `action_add_to_watch_queue_ajax=1&video_id=${videoId}`;
  
  // Send the request
  xhr.send(data);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(`Video ${videoId} added to queue successfully`);
    } else {
      console.error(`Failed to add video ${videoId} to queue`);
    }
  };
}

