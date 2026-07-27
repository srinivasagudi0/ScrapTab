let activeCategory = 'all';

async function getCards() {
  const data = await browser.storage.local.get('cards');
  return data.cards || [];
}

async function updateCardPosition(id, x, y) {
  const data = await browser.storage.local.get('cards');
  const cards = data.cards || [];
  const card = cards.find(c => c.id === id);
  if (card) {
    card.x = x;
    card.y = y;
    await browser.storage.local.set({ cards });
  }
}

function makeDraggable(elm, card) {
  let offsetX, offsetY, isDragging = false;
  
  elm.addEventListener('mousedown', (e) => {
    isDragging = true;
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
    el.className = 'card';
    el.style.left = (card.x ?? (40 + (i % 4) * 240)) + 'px';
    el.style.top = (card.y ?? (40 + Math.floor(i / 4) * 180)) + 'px';
    el.style.background = card.color || '#fff8e7';
    el.innerHTML = `
    <div class="title">${card.title || '(untitled)'}</div>
    <div class="note">${card.note || ''}</div>
    ${card.sourceUrl ? `<a href="${card.sourceUrl}" target="_blank">Source</a>` : ''}
    `;
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

render();