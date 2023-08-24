# chromevariations

A Chrome extension allows users to select text on any webpage and then view multiple variations of the selected text, using the OpenAI GPT model.

## Using

1. Select some text on any webpage.
2. Right-click and choose the relevant option from the context menu.
3. The popup will display multiple variations of the selected text.
4. Click on the icon next to a variation to copy it. Use the secondary icon if you wish to copy and immediately close the popup.

## Install

### From a zip file

1. Ask me for a zip file
2. Go to `chrome://extensions/`
3. Drag the file to this page

### From source

1. Use the correct API key:
   1. Rename `config.template.js` to `config.js`.
   2. Open `config.js` and replace `PLACE_YOUR_API_KEY_HERE` with your OpenAI API key.
2. Load as an unpacked extension:
   1. Go to `chrome://extensions/`
   2. Click "Load unpacked"
   3. Select this directory

### FAQ

#### Q: Why the polar bear icon?

**A:** Seriously? STFU
