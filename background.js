browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({ id: "save-selection", title: "Add to Scraplet", contexts: ["selection"] });
  browser.contextMenus.create({ id: "save-image", title: "Add Image to Scraplet", contexts: ["image"] });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId==="save-selection") {
    browser.tabs.sendMessage(tab.id, { action: "capture-selection", text: info.selectionText , url: tab.url });
  } else if (info.menuItemId==="save-image") {
    browser.tabs.sendMessage(tab.id, { action: "capture-image", imageUrl: info.srcUrl, url: tab.url });
  }
} )

