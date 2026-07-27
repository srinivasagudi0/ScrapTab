const titleInput = document.getElementById('title');
const noteInput = document.getElementById('note');
const categoryInput = document.getElementById('category');
const status = document.getElementById('status');

document.getElementById('save-note-btn').addEventListener('click', async () => {
  await saveCard({
    type: 'note',
    title: titleInput.value,
    note: noteInput.value,
    category: categoryInput.value,
    sourceUrl: ''
  });

  status.textContent = 'Saved note';
});

document.getElementById('save-page-btn').addEventListener('click', async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  await saveCard({
    type: 'page',
    title: tab.title,
    note: '',
    category: 'random',
    sourceUrl: tab.url
  });

  window.close();
});

document.getElementById('open-scrapbook-btn').addEventListener('click', () => {
  browser.tabs.create({ url: browser.runtime.getURL('scrapbook.html') });
});