(async function init() {
  const container = document.getElementById('category-content');
  const titleEl = document.getElementById('category-title');
  const iconEl = document.getElementById('category-icon');
  const descEl = document.getElementById('category-desc');
  const progressEl = document.getElementById('category-progress');
  const expandBtn = document.getElementById('expand-all');

  const id = getQueryParam('id');
  if (!id) {
    container.innerHTML = `<p class="text-red-600">Не указана категория. <a href="index.html" class="underline">На главную</a></p>`;
    return;
  }

  let faq;
  try {
    faq = await loadFaq();
  } catch (e) {
    container.innerHTML = `<p class="text-red-600">Не удалось загрузить данные. Запусти через Live Server.</p>`;
    return;
  }

  const cat = getCategoryById(faq, id);
  if (!cat) {
    container.innerHTML = `<p class="text-red-600">Категория не найдена. <a href="index.html" class="underline">На главную</a></p>`;
    return;
  }

  document.title = `${cat.title} · UniWay`;
  iconEl.textContent = cat.icon || '📄';
  titleEl.textContent = cat.title;
  descEl.textContent = cat.description || '';

  const total = cat.questions.length;
  const ready = cat.questions.filter(q => q.answer != null || q.link || q.embed).length;
  progressEl.textContent = `${ready} из ${total} ответов готовы`;

  container.innerHTML = cat.questions.map((q, i) => `
    <details id="${escapeHtml(q.id)}" class="qa-item bg-white border border-gray-200 rounded-xl overflow-hidden">
      <summary class="flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50">
        <span class="font-medium text-gray-900">
          <span class="text-gray-400 mr-2">${i + 1}.</span>${escapeHtml(q.question)}
        </span>
        <span class="chev text-gray-400 flex-shrink-0">▾</span>
      </summary>
      <div class="px-5 pb-5 pt-1 border-t border-gray-100">
        ${renderAnswer(q)}
        <div class="mt-4">
          <button class="share-btn" data-qid="${escapeHtml(q.id)}" type="button">
            <span>🔗</span><span class="share-label">Скопировать ссылку</span>
          </button>
        </div>
      </div>
    </details>
  `).join('');

  expandBtn.hidden = false;
  function refreshExpandLabel() {
    const allOpen = Array.from(container.querySelectorAll('details')).every(d => d.open);
    expandBtn.textContent = allOpen ? 'Свернуть всё' : 'Развернуть всё';
  }
  refreshExpandLabel();
  expandBtn.addEventListener('click', () => {
    const allDetails = container.querySelectorAll('details');
    const anyClosed = Array.from(allDetails).some(d => !d.open);
    allDetails.forEach(d => d.open = anyClosed);
    refreshExpandLabel();
  });
  container.addEventListener('toggle', refreshExpandLabel, true);

  container.addEventListener('click', async (e) => {
    const btn = e.target.closest('.share-btn');
    if (!btn) return;
    e.preventDefault();
    const qid = btn.dataset.qid;
    const url = window.location.origin + window.location.pathname + window.location.search + '#' + qid;
    const label = btn.querySelector('.share-label');
    try {
      await navigator.clipboard.writeText(url);
      btn.classList.add('copied');
      label.textContent = 'Скопировано';
    } catch (err) {
      label.textContent = 'Не удалось';
    }
    setTimeout(() => {
      btn.classList.remove('copied');
      label.textContent = 'Скопировать ссылку';
    }, 1800);
  });

  function focusFromHash() {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    target.open = true;
    refreshExpandLabel();
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('qa-target');
      setTimeout(() => {
        target.classList.add('qa-target-fade');
        setTimeout(() => target.classList.remove('qa-target', 'qa-target-fade'), 1300);
      }, 600);
    }, 50);
  }
  focusFromHash();
  window.addEventListener('hashchange', focusFromHash);
})();
