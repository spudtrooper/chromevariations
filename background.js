importScripts('config.js');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fetchVariations",
    title: "Get Text Variations",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "fetchVariations") {
    latestSelectedText = info.selectionText;
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 300
    });
  }
});

let latestSelectedText = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "text_selected") {
    latestSelectedText = message.data;
  } else if (message.message === "get_latest_text") {
    sendResponse(latestSelectedText);
  } else if (message.message === "fetch_variations") {
    getVariations(message.data).then(variations => {
      sendResponse(variations);
    });
    return true; // Indicate we want to send a response asynchronously
  }
});

async function getVariations(text) {
  const apiKey = OPENAI_API_KEY; // Defined in config.js

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          role: "user",
          content: `Rewrite the following phrase multiple ways and return a JSON object where the result is an array with key "variations":\n\n${text}`
        }
      ]
    })
  });

  const data = await response.json();

  const variations = JSON.parse(data.choices[0].message.content).variations;
  console.log("text", text);
  console.log("variations", variations);
  return variations;
}

