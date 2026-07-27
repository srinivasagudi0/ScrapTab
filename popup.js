const status = document.getElementById('status')
const btn = document.getElementById("save-btn")

async function loadStatus() {
    const data = await browser.storage.local.get('scrap');
    if (data.scrap) status.textContent = `Saved: "${data.scrap}"`;
}

btn.addEventListener('click', async () => {
    const note = `Hello from ${new Date().toLocaleTimeString()}`;
    await browser.storage.local.set({ scrap: note });
    loadStatus();
})

loadStatus();
