importScripts("browser-polyfill-min.js");

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({ id: "save-selection", title: "Add to Scraplet", contexts: ["selection"] });
  browser.contextMenus.create({ id: "save-image", title: "Add Image to Scraplet", contexts: ["image"] });
  browser.alarms.create('memory-check', { periodInMinutes: 1440 });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId==="save-selection") {
    browser.tabs.sendMessage(tab.id, { action: "capture-selection", text: info.selectionText , url: tab.url });
  } else if (info.menuItemId==="save-image") {
    browser.tabs.sendMessage(tab.id, { action: "capture-image", imageUrl: info.srcUrl, url: tab.url });
  }
} )


browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'memory-check') return;

  const data = await browser.storage.local.get('cards');
  const cards = Array.isArray(data.cards) ? data.cards : [];
  const threeWeeksAgo = Date.now() - (21 * 24 * 60 * 60 * 1000);
  
  const candidates = cards.filter((card) => {
    const createdAt = new Date(card.createdAt).getTime();
    return createdAt < threeWeeksAgo && !card.dismissed;
  });

  if (candidates.length === 0) {
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];

  browser.notifications.create(String(pick.id), {
    type: "basic",
    iconUrl: "image.png",
    title: "Still Interested?",
    message:`You saved "${pick.title || pick.note || 'this'}" a few weeks ago.`
  });
});

browser.notifications.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL('scrapbook.html') });
});
