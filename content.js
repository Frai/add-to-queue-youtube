let href = null;

// Create a MutationObserver to observe changes in the DOM
const observer = new MutationObserver(function (mutations) {
  function addVideoToQueue(videoUrl) {
    const videoId = videoUrl.split("v=")[1];
    console.log("Adding video to queue:", videoId);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.youtube.com/watch_queue_ajax', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    console.log("Sending request to add video to queue");
    // Prepare the data to be sent
    const data = `action_add_to_watch_queue_ajax=1&video_id=${videoId}`;
    console.log("Data:", data);
    // Send the request
    xhr.send(data); 
    console.log("Request sent");
    xhr.onload = function() {
      console.log("Request completed");
      if (xhr.status === 200) {
        console.log(`Video ${videoId} added to queue successfully`);
      } else {
        console.error(`Failed to add video ${videoId} to queue`);
      }
    };
  }

  mutations.forEach(function (mutation) {
    if (mutation.type === 'attributes' && mutation.target.id === 'interaction') {
      // get the previous sibling of the grand grand parent of the mutation target
      const previousSibling = mutation.target.parentElement.parentElement.parentElement.parentElement.firstElementChild;
      href = previousSibling.href;
      console.log("Href:", href);
    }


    if (mutation.type === 'attributes' && mutation.attributeName === 'focused') {
      const focusedElement = mutation.target;
      if (focusedElement.matches('tp-yt-iron-dropdown')) {
        // Find the <tp-yt-paper-listbox> element within the focused element
        const listbox = focusedElement.querySelector('tp-yt-paper-listbox#items');

        if (listbox && !listbox.querySelector('ytd-menu-service-item-renderer#add-to-queue-button')) {
          // Create the new <ytd-menu-service-item-renderer> element
          const newItem = document.createElement('ytd-menu-service-item-renderer');
          newItem.className = 'style-scope ytd-menu-popup-renderer iron-selected';
          newItem.setAttribute('system-icons', '');
          newItem.setAttribute('role', 'menuitem');
          newItem.setAttribute('use-icons', '');
          newItem.setAttribute('tabindex', '-1');
          newItem.setAttribute('aria-selected', 'true');
          newItem.setAttribute('id', 'add-to-queue-button');
          newItem.innerHTML = `
            <ytd-menu-service-item-renderer class="style-scope ytd-menu-popup-renderer iron-selected" system-icons="" role="menuitem" use-icons="" tabindex="0" aria-selected="true">
              <tp-yt-paper-item class="style-scope ytd-menu-service-item-renderer" style-target="host" role="option" tabindex="0" aria-disabled="false">
                <button class="add-to-queue-button")">Add to Queue</button>
              </tp-yt-paper-item>
            </ytd-menu-service-item-renderer>
          `;

          // Add a click event listener to the new item
          newItem.querySelector('button').addEventListener('click', function() {
            console.log("Button clicked");
            addVideoToQueue(href);
          });

          // Insert the new item at the beginning of the listbox
          listbox.insertBefore(newItem, listbox.firstChild);
          console.log("Inserted new item");
        }
        console.log("Finished");
      }
    }
  });
});

// Configure the observer to watch for attribute changes in the entire document
const config = { attributes: true, subtree: true };

// Start observing the document with the configured parameters
observer.observe(document, config);



