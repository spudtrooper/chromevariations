document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.sendMessage({ message: "get_latest_text" }, function (response) {
    const selectedText = response;
    if (selectedText) {
      showSelectedText(selectedText);
      getVariationsFromBackground(selectedText).then(variations => showVariations(selectedText, variations));
    }
  });
});

function copyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  showConfirmationMessage("Text copied to clipboard!");
}

function showVariations(selectedText, variations) {
  const variationsList = document.getElementById('variationsList');
  const displayDiv = document.getElementById('selectedTextDisplay');

  displayDiv.style.display = "none";

  // Create a bold element for the selected text
  const boldSelectedText = document.createElement('strong');
  boldSelectedText.textContent = "Original text: ";

  const selectedTextSpan = document.createElement('span');
  selectedTextSpan.textContent = selectedText;

  boldSelectedText.appendChild(selectedTextSpan);
  const br = document.createElement('br');
  boldSelectedText.appendChild(br);

  // Append the bold selected text to the top of the variations list
  variationsList.insertBefore(boldSelectedText, variationsList.firstChild);

  variations.forEach((variation, index) => {
    // Skip the first variation since it's the original selected text
    if (index === 0) return;

    const listItem = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.textContent = variation;

    const copyIcon = createCopyIcon(variation);
    const copyAndCloseIcon = createCopyAndCloseIcon(variation);

    listItem.appendChild(textSpan);
    listItem.appendChild(copyIcon);
    listItem.appendChild(copyAndCloseIcon);

    variationsList.appendChild(listItem);
  });

  variationsList.style.display = "block";
}


function createCopyIcon(variation) {
  const copyIcon = document.createElement('img');
  copyIcon.src = chrome.runtime.getURL('images/copy_to_clipboard.png');
  copyIcon.alt = "Copy to clipboard";
  copyIcon.title = "Copy to clipboard";
  copyIcon.classList.add('copy-icon');

  copyIcon.addEventListener('click', function () {
    copyTextToClipboard(variation);
    showConfirmationMessage(`Copied "${variation}" to clipboard`);
  });

  return copyIcon;
}

function createCopyAndCloseIcon(variation) {
  const copyAndCloseIcon = document.createElement('img');
  copyAndCloseIcon.src = chrome.runtime.getURL('images/copy_to_clipboard_and_close.png');
  copyAndCloseIcon.alt = "Copy and close";
  copyAndCloseIcon.title = "Copy to clipboard and close";
  copyAndCloseIcon.classList.add('copy-icon');

  copyAndCloseIcon.addEventListener('click', function () {
    copyTextToClipboard(variation);
    setTimeout(() => {
      window.close();
    }, 500); // XXX: Hack around race condition of copying to clipnoard
  });

  return copyAndCloseIcon;
}

function showConfirmationMessage(message) {
  const confirmationDiv = document.getElementById('confirmationMessage');
  confirmationDiv.textContent = message;
  confirmationDiv.style.display = "block";

  // Hide the confirmation after a few seconds
  setTimeout(() => {
    confirmationDiv.style.display = "none";
  }, 3000);
}


function hideSelectedText() {
  const displayDiv = document.getElementById('selectedTextDisplay');
  displayDiv.style.display = "none";
}

function showSelectedText(text) {
  const variationsList = document.getElementById('variationsList');
  variationsList.style.display = "none";

  const displayDiv = document.getElementById('selectedTextDisplay');
  const displayText = document.getElementById('displayText');

  displayDiv.style.display = "block";
  displayText.textContent = "Finding variations of: ";

  const boldText = document.createElement('strong');
  boldText.textContent = text;

  displayText.appendChild(boldText);
}

function getVariationsFromBackground(text) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: "fetch_variations", data: text }, function (response) {
      resolve(response);
    });
  });
}