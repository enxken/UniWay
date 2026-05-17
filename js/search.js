(async function init() {
  const queryEl = document.getElementById('search-query-text');
  const inputEl = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  const summaryEl = document.getElementById('search-summary');

  const initialQ = getQueryParam('q');
  inputEl.value = initialQ;
  queryEl.textContent = initialQ;

  let faq;
  try {
    faq = await loadFaq();
  } catch (e) {
    resultsEl.innerHTML = `<p class="text-red-600">Не удалось загрузить данные. Запусти через Live Server.</p>`;
    return;
  }

  function runSearch(q) {
    q = q.trim();
    queryEl.textContent = q;
    if (!q) {
      summaryEl.textContent = 'Введи слово в поле поиска';
      resultsEl.innerHTML = '';
      return;
    }
    const lower = q.toLowerCase();
    const hits = [];
    for (const cat of faq.categories) {
      for (const ques of cat.questions) {
        const hay = (ques.question + ' ' + (ques.answer || '')).toLowerCase();
        if (hay.includes(lower)) hits.push({ cat, ques });
      }
    }
    summaryEl.textContent = hits.length
      ? `Найдено: ${hits.length}`
      : 'Ничего не нашлось. Попробуй переформулировать.';

    resultsEl.innerHTML = hits.map(({ cat, ques }) => `
      <a href="category.html?id=${encodeURIComponent(cat.id)}#${encodeURIComponent(ques.id)}"
         class="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1FA94F] transition">
        <div class="text-xs text-gray-400 mb-1">${cat.icon || ''} ${escapeHtml(cat.title)}</div>
        <div class="font-medium text-gray-900">${highlight(ques.question, q)}</div>
        ${ques.answer ? `<div class="text-sm text-gray-500 mt-1 line-clamp-2">${highlight(ques.answer.slice(0, 180), q)}</div>` : ''}
      </a>
    `).join('');
  }

  runSearch(initialQ);

  inputEl.addEventListener('input', (e) => runSearch(e.target.value));
})();
