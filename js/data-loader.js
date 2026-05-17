async function loadFaq() {
  const res = await fetch('data/faq.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить data/faq.json');
  return await res.json();
}

function getCategoryById(faq, id) {
  return faq.categories.find(c => c.id === id) || null;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const safe = escapeHtml(text);
  const q = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(q, 'gi'), m => `<mark class="hl">${m}</mark>`);
}

function renderAnswer(q) {
  if (q.answer == null && !q.link && !q.embed) {
    return `<div class="coming-soon rounded-lg px-4 py-3 text-sm text-gray-500">🛠 Ответ скоро появится</div>`;
  }
  let html = '';
  if (q.answer) {
    html += `<p class="text-gray-700 leading-relaxed whitespace-pre-line">${escapeHtml(q.answer)}</p>`;
  }
  if (q.link) {
    html += `<a href="${escapeHtml(q.link.url)}" target="_blank" rel="noopener"
              class="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-[#1FA94F] hover:bg-[#178a3f] text-white font-medium text-sm transition">
                ${escapeHtml(q.link.text)}
                <span aria-hidden="true">↗</span>
            </a>`;
  }
  if (q.embed) {
    html += `<div class="mt-3 rounded-lg overflow-hidden border border-gray-200">`;
    html += `<div class="coming-soon rounded-lg px-4 py-6 text-sm text-gray-500 text-center">${escapeHtml(q.embed.placeholder || 'Скоро тут будет встроенный модуль')}</div>`;
    html += `</div>`;
  }
  if (q.image) {
    html += `<img src="${escapeHtml(q.image)}" alt="" loading="lazy" decoding="async" class="mt-3 rounded-lg max-w-full">`;
  }
  return html;
}
