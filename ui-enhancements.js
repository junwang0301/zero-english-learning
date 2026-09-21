'use strict';
(function () {
  const root = document.documentElement;
  const storageOk = (() => {
    try { const key = '__english_storage_test__'; localStorage.setItem(key, '1'); localStorage.removeItem(key); return true; } catch (error) { return false; }
  })();
  function persistSettings() { writeJSON(STORAGE.settings, state.settings); }
  function preferredTheme() { return state.settings.theme || 'system'; }
  function resolvedTheme() { return preferredTheme() === 'system' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preferredTheme(); }
  function applyTheme() { root.dataset.theme = resolvedTheme(); const button = $('#themeToggle'); if (button) { button.textContent = resolvedTheme() === 'dark' ? '浅色' : '暗色'; button.setAttribute('aria-pressed', String(resolvedTheme() === 'dark')); } }
  function applyFontScale() { root.style.setProperty('--font-scale', String(state.settings.fontScale || 1)); const label = $('#fontScaleValue'); if (label) label.textContent = Math.round((state.settings.fontScale || 1) * 100) + '%'; }
  function changeFont(delta) { state.settings.fontScale = Math.max(0.9, Math.min(1.25, Number(((state.settings.fontScale || 1) + delta).toFixed(2)))); persistSettings(); applyFontScale(); }
  function storageMessage() { return '学习进度、生词、错题和写作记录只保存在当前浏览器。清除缓存、使用无痕模式或更换设备都会导致数据丢失。建议定期在“AI 与数据”中导出备份。'; }
  function injectTools() {
    if ($('#appTools')) return;
    const tools = document.createElement('div'); tools.id = 'appTools'; tools.className = 'app-tools'; tools.setAttribute('aria-label', '页面工具');
    tools.innerHTML = '<button type="button" data-ui-action="font-down" aria-label="缩小字号">A−</button><button type="button" data-ui-action="font-up" aria-label="放大字号">A+</button><button id="themeToggle" type="button" data-ui-action="theme" aria-label="切换暗色模式">暗色</button><button type="button" data-ui-action="top" aria-label="返回顶部">↑</button>';
    document.body.appendChild(tools);
  }
  function injectStorageNotice() {
    if ($('#storageNotice')) return;
    const notice = document.createElement('div'); notice.id = 'storageNotice'; notice.className = 'storage-notice'; notice.setAttribute('role', 'note');
    notice.innerHTML = `<strong>本地存储说明</strong><span>${storageMessage()}</span><button type="button" data-ui-action="open-settings">导出备份</button>`;
    document.querySelector('main.main-content')?.prepend(notice);
    if (!storageOk) { notice.classList.add('error'); notice.querySelector('span').textContent = '当前浏览器无法写入 localStorage，可能是无痕模式或存储权限受限。关闭无痕模式，或先复制当前数据。'; }
  }
  function injectSettingsExtras() {
    const grid = $('.settings-grid'); if (!grid || $('#uiSettingsCard')) return;
    const card = document.createElement('div'); card.id = 'uiSettingsCard'; card.className = 'settings-card';
    card.innerHTML = `<div class="card-heading"><span class="card-icon">UI</span><div><h2>界面与发音</h2><p>设置会保存在当前浏览器。</p></div></div><div class="setting-range"><label for="voiceSelect">发音口音</label><select id="voiceSelect"><option value="en-US">美音 en-US</option><option value="en-GB">英音 en-GB</option></select></div><div class="setting-range"><label for="speechRate">语音语速 <span id="speechRateValue">90%</span></label><input id="speechRate" type="range" min="0.5" max="1.5" step="0.05" value="0.9"></div><label class="toggle-row"><input id="autoSpeakReview" type="checkbox"> 复习进入下一词时自动朗读</label><div class="setting-range"><label>字体大小 <span id="fontScaleValue">100%</span></label><div class="inline-controls"><button type="button" data-ui-action="font-down">缩小</button><button type="button" data-ui-action="font-up">放大</button></div></div><p class="form-note">移动端通常需要你先点击一次页面，浏览器才允许播放语音；如果系统没有对应口音，会自动回退到其他英语声音。</p>`;
    grid.appendChild(card);
    const faq = document.createElement('div'); faq.className = 'settings-card faq-card'; faq.innerHTML = `<div class="card-heading"><span class="card-icon">?</span><div><h2>FAQ 与反馈</h2><p>常见问题和问题反馈入口。</p></div></div><details><summary>为什么没有 AI 生成？</summary><p>需要在“AI 与数据”中配置 OpenAI 兼容接口、模型名和 API Key。未配置时文章和练习会自动使用本地内容。</p></details><details><summary>数据为什么会丢失？</summary><p>${storageMessage()}</p></details><details><summary>手机没有声音怎么办？</summary><p>先点击一次发音按钮；检查系统媒体音量和浏览器网站声音权限；不同设备可用的英语声音不同。</p></details><a class="secondary-button github-feedback" href="https://github.com/junwang0301/zero-english-learning/issues/new?title=%E7%BD%91%E7%AB%99%E9%97%AE%E9%A2%98%E5%8F%8D%E9%A6%88&body=%E8%AF%B7%E6%8F%8F%E8%BF%B0%E9%97%AE%E9%A2%98%E3%80%81%E5%A4%8D%E7%8E%B0%E6%AD%A5%E9%AA%A4%E5%92%8C%E6%9C%9F%E6%9C%9B%E7%BB%93%E6%9E%9C%E3%80%82" target="_blank" rel="noopener noreferrer">提交 GitHub Issue</a></div>`;
    grid.appendChild(faq);
    const voice = $('#voiceSelect'), rate = $('#speechRate'), auto = $('#autoSpeakReview');
    if (voice) voice.value = state.settings.voice || 'en-US';
    if (rate) rate.value = String(state.settings.speechRate || 0.9);
    if (auto) auto.checked = Boolean(state.settings.autoSpeakReview);
    if ($('#speechRateValue')) $('#speechRateValue').textContent = Math.round((state.settings.speechRate || 0.9) * 100) + '%';
  }
  function injectOnboarding() {
    if (state.settings.onboardingSeen || $('#onboardingModal')) return;
    const modal = document.createElement('div'); modal.id = 'onboardingModal'; modal.className = 'modal-backdrop'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'onboardingTitle');
    modal.innerHTML = `<section class="onboarding-card"><button class="drawer-close" type="button" data-ui-action="close-onboarding" aria-label="关闭引导">×</button><span class="eyebrow">欢迎使用</span><h2 id="onboardingTitle">英语起步课</h2><p>从语法课堂学习主线课程和微专题，在阅读实验室把语法放进文章，在练习中心完成专项、错题重做和写作。</p><ul><li>课程与练习：主线课 1–10，微专题 101+。</li><li>数据：进度、生词、错题和写作记录只存在当前浏览器。</li><li>发音：需要用户主动点击，设备支持 Web Speech 时可用。</li></ul><p class="form-note">清理缓存、无痕模式或更换设备会丢失数据，建议定期导出备份。</p><div class="form-actions"><button class="primary-button" type="button" data-ui-action="close-onboarding">开始学习</button><label class="checkbox-row"><input id="onboardingNever" type="checkbox" checked> 不再提示</label></div></section>`;
    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector('button')?.focus(), 0);
  }
  function aiHelpHtml() { return '<div class="ai-mode-help"><strong>当前为本地模式</strong><span>AI 文章生成、AI 8 道混合题和 AI 批改不可用；文章使用本地模板，语法专项使用离线 5 道基础题。</span><button type="button" data-view="settings">配置 AI 接口</button></div>'; }
  function updateAIUI() {
    const configured = isAIConfigured();
    $$('.ai-mode-help').forEach(item => item.remove());
    if (!configured) {
      const reading = $('#view-reading'); if (reading) reading.insertBefore(createHtml(aiHelpHtml()), reading.querySelector('.reading-workspace'));
      const practice = $('#practiceContent'); if (practice) practice.insertAdjacentHTML('afterbegin', aiHelpHtml());
    }
    const refresh = document.querySelector('[data-action="refresh-article-metadata"]'); if (refresh) { refresh.disabled = !configured; refresh.title = configured ? '' : '请先配置 AI 接口'; }
    const lookup = $('#drawerLookupButton'); if (lookup) lookup.disabled = !configured;
  }
  function createHtml(html) { const wrap = document.createElement('div'); wrap.innerHTML = html; return wrap.firstElementChild; }
  function ensureSpeechPanel(container) {
    if (!container || container.querySelector('.speech-settings')) return;
    const panel = document.createElement('div'); panel.className = 'speech-settings';
    panel.innerHTML = `<label>口音<select class="speech-voice"><option value="en-US">美音</option><option value="en-GB">英音</option></select></label><label>语速 <span class="speech-rate-value">${Math.round((state.settings.speechRate || 0.9) * 100)}%</span><input class="speech-rate" type="range" min="0.5" max="1.5" step="0.05" value="${state.settings.speechRate || 0.9}"></label><button class="secondary-button small" type="button" data-ui-action="speech-test">试听</button>${container.closest('#reviewPanel') ? '<label class="toggle-row"><input class="review-auto-speak" type="checkbox" ' + (state.settings.autoSpeakReview ? 'checked' : '') + '> 自动连续播放</label>' : ''}`;
    panel.querySelector('.speech-voice').value = state.settings.voice || 'en-US';
    container.appendChild(panel);
  }
  const originalOpenWordDrawer = openWordDrawer;
  openWordDrawer = function (...args) { originalOpenWordDrawer.apply(this, args); ensureSpeechPanel($('#wordDrawer')); updateAIUI(); };
  const originalRenderReview = renderReview;
  renderReview = function () { originalRenderReview(); ensureSpeechPanel($('#reviewPanel')); };
  const originalUpdateAIStatus = updateAIStatus;
  updateAIStatus = function () { originalUpdateAIStatus(); updateAIUI(); };
  const originalRenderArticle = renderArticle;
  renderArticle = function (article) { originalRenderArticle(article); updateAIUI(); };
  function buildLessonAnalysis(lesson, session) {
    let html = '';
    lesson.mcq.forEach((q, i) => { html += '<div class="practice-analysis-item"><strong>选择 ' + (i + 1) + '</strong><p>你的答案：' + escapeHtml(session.answers.mcq[i] == null ? '未作答' : q.options[session.answers.mcq[i]]) + '</p><p>正确答案：' + escapeHtml(q.options[q.answer]) + '</p><p>' + escapeHtml(q.explanation || '') + '</p></div>'; });
    lesson.fill.forEach((q, i) => { html += '<div class="practice-analysis-item"><strong>填空 ' + (i + 1) + '</strong><p>你的答案：' + escapeHtml(session.answers.fill[i] || '未作答') + '</p><p>参考答案：' + escapeHtml(q.answer) + '</p><p>' + escapeHtml(q.explanation || '') + '</p></div>'; });
    lesson.translations.forEach((q, i) => { html += '<div class="practice-analysis-item"><strong>翻译 ' + (i + 1) + '</strong><p>你的答案：' + escapeHtml(session.answers.translations[i] || '未作答') + '</p><p>参考答案：' + escapeHtml(q.answer) + '</p></div>'; });
    return html;
  }
  const originalRenderLessonDetail = renderLessonDetail;
  renderLessonDetail = function (lesson) {
    originalRenderLessonDetail(lesson); updateAIUI();
    const session = state.lessonSession;
    if (session && session.submitted) {
      const detail = $('#lessonDetail');
      const analysis = document.createElement('details'); analysis.className = 'practice-analysis';
      analysis.innerHTML = '<summary>查看整套练习解析</summary>' + buildLessonAnalysis(lesson, session);
      detail.appendChild(analysis);
    }
  };
  const originalRenderPractice = renderPractice;
  renderPractice = function () {
    originalRenderPractice(); updateAIUI();
    const session = state.practice && state.practice.active;
    if (!session || !session.submitted) return;
    const content = $('#practiceContent'); if (!content || content.querySelector('.practice-analysis')) return;
    const details = document.createElement('details'); details.className = 'practice-analysis';
    details.innerHTML = '<summary>查看整套题目解析</summary>' + session.questions.map((q, i) => '<div class="practice-analysis-item"><strong>' + escapeHtml(practiceQuestionTypeLabel(q.type)) + ' ' + (i + 1) + '</strong><p>你的答案：' + escapeHtml(session.answers[q.id] == null ? '未作答' : session.answers[q.id]) + '</p><p>参考答案：' + escapeHtml(q.referenceAnswer || '') + '</p><p>' + escapeHtml(q.explanation || '') + '</p></div>').join('');
    content.appendChild(details);
  };
  function courseSearchText(card) { const course = findCourse(card.dataset.courseId); return course ? [course.title, course.subtitle, course.summary, course.group].join(' ') : ''; }
  function decorateGrammarList() {
    const grid = $('#lessonGrid'); if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.lesson-card')); if (!cards.length) return;
    cards.forEach(card => { card.dataset.searchText = courseSearchText(card).toLowerCase(); });
    const groups = new Map();
    cards.forEach(card => { const course = findCourse(card.dataset.courseId); const key = (course && course.microTopic) ? '微专题' : (course && course.group) || '主线课程'; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(card); });
    grid.classList.add('grouped-list');
    grid.innerHTML = Array.from(groups.entries()).map(([name, items]) => `<details class="grammar-group" open><summary>${escapeHtml(name)} <span>${items.length}</span></summary><div class="lesson-grid"></div></details>`).join('');
    const containers = grid.querySelectorAll('.grammar-group .lesson-grid'); let index = 0; groups.forEach(items => { items.forEach(card => containers[index].appendChild(card)); index += 1; });
  }
  const originalRenderGrammar = renderGrammar;
  renderGrammar = function () {
    originalRenderGrammar(); decorateGrammarList();
    if (!$('#grammarSearchBox')) {
      const box = document.createElement('div'); box.id = 'grammarSearchBox'; box.className = 'grammar-search-box';
      box.innerHTML = '<input id="grammarSearch" type="search" placeholder="搜索课程或微专题" aria-label="搜索课程"><select id="grammarKind" aria-label="课程类型"><option value="all">全部课程</option><option value="main">仅主线课程</option><option value="micro">仅微专题</option></select>';
      $('#lessonFilters')?.before(box);
    }
    filterGrammarList();
  };
  const originalRenderHome = renderHome;
  renderHome = function () {
    const roadmapBefore = $('#homeRoadmap'); if (roadmapBefore) delete roadmapBefore.dataset.grouped;
    originalRenderHome();
    const roadmap = $('#homeRoadmap'); if (!roadmap) return;
    const cards = Array.from(roadmap.querySelectorAll('.roadmap-card'));
    const micro = cards.filter(card => { const course = findCourse(card.dataset.courseId); return course && course.microTopic; });
    const main = cards.filter(card => !micro.includes(card)); if (!micro.length) return;
    roadmap.dataset.grouped = '1';
    roadmap.innerHTML = '<div class="roadmap-grid home-main-roadmap"></div><details class="home-micro-group"><summary>展开语法微专题 <span>' + micro.length + '</span></summary><div class="roadmap-grid home-micro-roadmap"></div></details>';
    const mainBox = roadmap.querySelector('.home-main-roadmap'), microBox = roadmap.querySelector('.home-micro-roadmap'); main.forEach(card => mainBox.appendChild(card)); micro.forEach(card => microBox.appendChild(card));
  };
  function closeOnboarding() {
    const never = $('#onboardingNever');
    if (never && never.checked) { state.settings.onboardingSeen = true; persistSettings(); }
    $('#onboardingModal')?.remove();
  }
  function filterGrammarList() {
    const query = ($('#grammarSearch')?.value || '').trim().toLowerCase();
    const kind = $('#grammarKind')?.value || 'all';
    $$('#lessonGrid .lesson-card').forEach(card => {
      const course = findCourse(card.dataset.courseId);
      const text = (card.dataset.searchText || '').toLowerCase();
      const kindOk = kind === 'all' || (kind === 'micro' ? Boolean(course && course.microTopic) : Boolean(course && !course.microTopic));
      card.classList.toggle('hidden', !(kindOk && (!query || text.includes(query))));
    });
    $$('#lessonGrid .grammar-group').forEach(group => { group.classList.toggle('hidden', !group.querySelector('.lesson-card:not(.hidden)')); });
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-ui-action]');
    if (!button) return;
    const action = button.dataset.uiAction;
    if (action === 'theme') { state.settings.theme = resolvedTheme() === 'dark' ? 'light' : 'dark'; persistSettings(); applyTheme(); }
    else if (action === 'font-down') changeFont(-0.05);
    else if (action === 'font-up') changeFont(0.05);
    else if (action === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (action === 'open-settings') showView('settings');
    else if (action === 'close-onboarding') closeOnboarding();
    else if (action === 'speech-test') { const text = state.selectedWord ? state.selectedWord.raw : (state.review.queue.length ? (state.vocabulary[state.review.queue[state.review.index]] || {}).displayWord : 'English'); speakText(text || 'English'); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'grammarSearch') filterGrammarList();
    if (event.target.classList && event.target.classList.contains('speech-rate')) {
      state.settings.speechRate = Number(event.target.value) || 0.9; persistSettings();
      const value = event.target.closest('.speech-settings')?.querySelector('.speech-rate-value'); if (value) value.textContent = Math.round(state.settings.speechRate * 100) + '%';
    }
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'grammarKind') filterGrammarList();
    if (event.target.id === 'voiceSelect' || event.target.classList?.contains('speech-voice')) { state.settings.voice = event.target.value; persistSettings(); }
    if (event.target.id === 'speechRate') { state.settings.speechRate = Number(event.target.value) || 0.9; persistSettings(); if ($('#speechRateValue')) $('#speechRateValue').textContent = Math.round(state.settings.speechRate * 100) + '%'; }
    if (event.target.id === 'autoSpeakReview' || event.target.classList?.contains('review-auto-speak')) state.settings.autoSpeakReview = event.target.checked, persistSettings();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#onboardingModal')) closeOnboarding(); });
  window.addEventListener('scroll', () => { $('#appTools')?.classList.toggle('show-top', window.scrollY > 500); }, { passive: true });
  window.addEventListener('offline', () => showToast('网络已断开，AI 功能暂不可用，离线课程仍可继续'));
  window.addEventListener('online', () => showToast('网络已恢复'));
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (preferredTheme() === 'system') applyTheme(); });
  injectTools(); injectStorageNotice(); injectSettingsExtras(); injectOnboarding(); applyTheme(); applyFontScale();
  renderHome(); renderGrammar(); updateAIUI();
})();
