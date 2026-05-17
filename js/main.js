(async function init() {
  const grid = document.getElementById('categories');
  const searchInput = document.getElementById('search-input');

  let faq;
  try {
    faq = await loadFaq();
  } catch (e) {
    grid.innerHTML = `<div class="col-span-full text-center text-red-600 py-8">
      Не удалось загрузить вопросы. Запусти сайт через Live Server (правый клик по index.html → Open with Live Server).
    </div>`;
    return;
  }

  grid.innerHTML = faq.categories.map(cat => {
    const total = cat.questions.length;
    const ready = cat.questions.filter(q => q.answer != null || q.link || q.embed).length;
    return `
      <a href="category.html?id=${encodeURIComponent(cat.id)}"
         class="category-card block bg-white border border-gray-200 rounded-2xl p-5 group">
        <div class="flex items-start justify-between mb-3">
          <div class="text-3xl">${cat.icon || '📄'}</div>
          <div class="text-xs text-gray-400">${ready}/${total}</div>
        </div>
        <div class="font-semibold text-gray-900 mb-1 group-hover:text-[#178a3f]">${escapeHtml(cat.title)}</div>
        <div class="text-sm text-gray-500">${escapeHtml(cat.description || '')}</div>
      </a>
    `;
  }).join('');

  function goSearch() {
    const q = searchInput.value.trim();
    if (q.length === 0) return;
    window.location.href = 'search.html?q=' + encodeURIComponent(q);
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') goSearch();
  });

  const btn = document.getElementById('search-btn');
  if (btn) btn.addEventListener('click', goSearch);
})();
