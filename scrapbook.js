let activeCategory = 'all';

async function getCards() {
  const data = await browser.storage.local.get('cards');
  return Array.isArray(data.cards) ? data.cards : [];
}

async function updateCardPosition(id, x, y) {
  const data = await browser.storage.local.get('cards');
  const cards = Array.isArray(data.cards) ? data.cards : [];
  const card = cards.find(c => c.id === id);
  if (card) {
    card.x = x;
    card.y = y;
    await browser.storage.local.set({ cards });
  }
}

function getLinkText(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function addText(el, className, text) {
  const child = document.createElement('div');
  child.className = className;
  child.textContent = text;
  el.appendChild(child);
  return child;
}

function addSourceLink(el, className, url, label) {
  const link = document.createElement('a');
  link.className = className;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = label;
  link.addEventListener('mousedown', (e) => e.stopPropagation());
  el.appendChild(link);
  return link;
}

function renderPageCard(el, card) {
  const image = document.createElement('img');
  image.className = 'page-shot';
  image.src = card.screenshotUrl;
  image.alt = card.title || 'Saved page screenshot';
  el.appendChild(image);

  addText(el, 'title', card.title || '(untitled)');
  addText(el, 'note', card.note || '');

  if (card.sourceUrl) {
    addSourceLink(el, 'source', card.sourceUrl, getLinkText(card.sourceUrl));
  }
}

function renderQuoteCard(el, card) {
  addText(el, 'quote-mark', '"');
  addText(el, 'quote-text', card.note || card.title || '');
  addText(el, 'cut-line', '');

  if (card.sourceUrl) {
    addSourceLink(el, 'quote-source', card.sourceUrl, `from: ${getLinkText(card.sourceUrl)}`);
  }
}

function renderImageCard(el, card) {
  const pin = document.createElement('div');
  pin.className = 'pushpin';
  el.appendChild(pin);

  const image = document.createElement('img');
  image.className = 'saved-image';
  image.src = card.imageUrl;
  image.alt = card.title || 'Saved image';
  el.appendChild(image);

  if (card.title) {
    addText(el, 'image-title', card.title);
  }

  if (card.note) {
    addText(el, 'image-caption', card.note);
  }
}

function renderBasicCard(el, card) {
  addText(el, 'title', card.title || '(untitled)');
  addText(el, 'note', card.note || '');

  if (card.sourceUrl) {
    addSourceLink(el, 'source', card.sourceUrl, getLinkText(card.sourceUrl));
  }
}

function makeDraggable(elm, card) {
  let offsetX, offsetY, isDragging = false;
  
  elm.addEventListener('mousedown', (e) => {
    isDragging = true;
    elm.classList.add('dragging');
    offsetX = e.clientX - elm.offsetLeft;
    offsetY = e.clientY - elm.offsetTop;
  });

  document.addEventListener('mousemove', (e) =>{
    if (!isDragging) return;
    elm.style.left = `${e.clientX - offsetX}px`;
    elm.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      elm.classList.remove('dragging');
      updateCardPosition(card.id, parseInt(elm.style.left), parseInt(elm.style.top));
    }
  });
}

async function render() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  const cards = await getCards();
  const filtered = activeCategory === 'all' ? cards : cards.filter(c => c.category === activeCategory);

  filtered.forEach((card, i) => {
    const el = document.createElement('div');
    if (card.type === 'page' && card.screenshotUrl) {
      el.className = 'card page-card';
    } else if (card.type === 'selection') {
      el.className = 'card quote-card';
    } else if (card.type === 'image') {
      el.className = 'card image-card';
    } else {
      el.className = 'card';
    }

    el.style.left = (card.x ?? (40 + (i % 4) * 240)) + 'px';
    el.style.top = (card.y ?? (40 + Math.floor(i / 4) * 180)) + 'px';

    if (card.type === 'page' && card.screenshotUrl) {
      renderPageCard(el, card);
    } else if (card.type === 'selection') {
      renderQuoteCard(el, card);
    } else if (card.type === 'image') {
      renderImageCard(el, card);
    } else {
      renderBasicCard(el, card);
    }

    board.appendChild(el);
    makeDraggable(el, card);
  });
}

document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    render();
  });
});

document.getElementById('clear-all-btn').addEventListener('click', async () => {
  if (!confirm('Delete all the scraps?')) return;

  await browser.storage.local.set({ cards: [] });
  render();
});

render();
