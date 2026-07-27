async function saveCard(card) {
    const data = await browser.storage.local.get('cards');
    const cards = data.cards || [];
    cards.push({ id: Date.now(), createdAt: new Date().toISOString(), ...card });
    await browser.storage.local.set({ cards });
}
