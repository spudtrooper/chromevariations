let previousSelection = "";

function checkForTextSelection() {
  const selectedText = window.getSelection().toString().trim();

  // Check if there's a new selection and it's different from the previous one
  if (selectedText.length > 0 && selectedText !== previousSelection) {
    previousSelection = selectedText;
    chrome.runtime.sendMessage({ message: "text_selected", data: selectedText });
  }
}

// Trigger on mouse up (end of mouse-based text selection)
document.addEventListener('mouseup', checkForTextSelection);

// Trigger on key up (end of keyboard-based text selection)
document.addEventListener('keyup', checkForTextSelection);
