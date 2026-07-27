function showCaptureBox(prefill) {
  const box = document.createElement('div');
  box.style.cssText = `position:fixed; bottom:20px; right:20px; z-index:999999;
    background:white; border:1px solid #ccc; border-radius:8px; padding:12px; width:220px;
    font-family:sans-serif; box-shadow:0 2px 8px rgba(0,0,0,0.2);`;
  box.innerHTML = `
    <input id="sc-title" placeholder="Title" style="width:100%; margin-bottom:6px;">
    <textarea id="sc-note" placeholder="Short note" style="width:100%; margin-bottom:6px;">${prefill.note || ''}</textarea>
    <select id="sc-category" style="width:100%; margin-bottom:6px;">
      <option value="coding">Coding</option><option value="recipes">Recipes</option>
      <option value="places">Places</option><option value="random" selected>Random</option>
    </select>
    <button id="sc-save" style="width:100%;">Save to scrapbook</button>`;
  document.body.appendChild(box);

  document.getElementById('sc-save').addEventListener('click', async () => {
    await saveCard({
      type: prefill.type,
      title: document.getElementById('sc-title').value,
      note: document.getElementById('sc-note').value,
      category: document.getElementById('sc-category').value,
      sourceUrl: prefill.url,
      imageUrl: prefill.imageUrl || ""

    });
    box.remove();
  });
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "capture-selection") showCaptureBox({ type: "selection", note: msg.text, url: msg.url });
  if (msg.action === "capture-image") showCaptureBox({ type: "image", imageUrl: msg.imageUrl, url: msg.url });
});

