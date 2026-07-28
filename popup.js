const titleInput = document.getElementById('title');
const noteInput = document.getElementById('note');
const categoryInput = document.getElementById('category');
const status = document.getElementById('status');

function getSelectedType() {
  return document.querySelector('input[name="capture-type"]:checked').value;
}

document.getElementById('save-card-btn').addEventListener('click', async () => {
  const type = getSelectedType();

  if (type === 'note') {
    await saveCard({
      type: 'note',
      title: titleInput.value,
      note: noteInput.value,
      category: categoryInput.value,
      sourceUrl: ''
    });
  }

  if (type === 'page') {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const screenshoot = await browser.tabs.captureVisibleTab();

    await saveCard({
      type: 'page',
      title: titleInput.value || tab.title,
      note: noteInput.value,
      category: categoryInput.value,
      sourceUrl: tab.url,
      screenshotUrl: screenshoot
    });
  }

  status.textContent = 'Saved';
  window.close();
});

document.getElementById('open-scrapbook-btn').addEventListener('click', () => {
  browser.tabs.create({ url: browser.runtime.getURL('scrapbook.html') });
});
