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
    offsetX = e.clientX - elm.offsetXleft;
    offsetY = e.clientY - elm.offsetYtop;
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

