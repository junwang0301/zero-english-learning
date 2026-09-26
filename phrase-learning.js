'use strict';
STORAGE.phrases = 'english-learning:v1:phrases';
state.phrases = state.phrases && typeof state.phrases === 'object' ? state.phrases : readJSON(STORAGE.phrases, { entries: {}, catalogSeeded: false, filters: { level: 'all', theme: 'all', query: '' } });
state.phrases.entries = state.phrases.entries || {};
state.phrases.filters = Object.assign({ level: 'all', theme: 'all', query: '' }, state.phrases.filters || {});
let phraseStudy = null;
let phraseSentencePractice = null;
const P = {
  title: '\u8bcd\u7ec4\u5b66\u4e60',
  subtitle: '\u6309\u7b49\u7ea7\u548c\u4e3b\u9898\u5b66\u4e60\u5e38\u7528\u8bcd\u7ec4\uff1bAI \u6bcf\u6b21\u8865\u5145 10 \u4e2a\uff0c\u5185\u7f6e\u9898\u5e93\u53ef\u79bb\u7ebf\u4f7f\u7528\u3002',
  total: '\u4e2a\u8bcd\u7ec4',
  due: '\u4e2a\u5f85\u590d\u4e60',
  mastered: '\u4e2a\u5df2\u638c\u63e1',
  allLevels: '\u5168\u90e8\u7b49\u7ea7',
  level: '\u5b66\u4e60\u7b49\u7ea7',
  theme: '\u5b66\u4e60\u4e3b\u9898',
  allThemes: '\u5168\u90e8\u4e3b\u9898',
  generate: 'AI \u751f\u6210 10 \u4e2a',
  review: '\u5f00\u59cb\u590d\u4e60',
  search: '\u641c\u7d22\u8bcd\u7ec4\u3001\u91ca\u4e49\u6216\u4f8b\u53e5',
  showing: '\u663e\u793a',
  noMatch: '\u6ca1\u6709\u5339\u914d\u7684\u8bcd\u7ec4',
  noMatchHint: '\u6362\u4e00\u4e2a\u7b5b\u9009\u6761\u4ef6\uff0c\u6216\u4f7f\u7528 AI \u751f\u6210\u65b0\u7684\u8bcd\u7ec4\u3002',
  mastery: '\u719f\u7ec3\u5ea6',
  master: '\u6807\u8bb0\u638c\u63e1',
  remove: '\u5220\u9664',
  close: '\u9000\u51fa\u590d\u4e60',
  chooseMeaning: '\u9009\u62e9\u6b63\u786e\u7684\u4e2d\u6587\u91ca\u4e49',
  fillPhrase: '\u5728\u53e5\u5b50\u4e2d\u586b\u5199\u8bcd\u7ec4',
  translate: '\u628a\u4e2d\u6587\u53e5\u5b50\u7ffb\u8bd1\u6210\u82f1\u6587\uff0c\u5e76\u5305\u542b\u8be5\u8bcd\u7ec4',
  submit: '\u63d0\u4ea4',
  next: '\u4e0b\u4e00\u6b65',
  correct: '\u56de\u7b54\u6b63\u786e\u3002',
  wrong: '\u8fd8\u9700\u7ec3\u4e60\u3002\u53c2\u8003\uff1a',
  finished: '\u672c\u8f6e\u8bcd\u7ec4\u590d\u4e60\u5df2\u5b8c\u6210\u3002',
  back: '\u8fd4\u56de\u8bcd\u7ec4\u8868',
  aiWorking: 'AI \u6b63\u5728\u751f\u6210\u8bcd\u7ec4\u2026',
  aiSuccess: '\u5df2\u751f\u6210\u65b0\u8bcd\u7ec4\u3002',
  aiFailed: 'AI \u751f\u6210\u5931\u8d25\uff0c\u5df2\u4fdd\u7559\u73b0\u6709\u8bcd\u7ec4\u3002',
  speak: '\u53d1\u97f3',
  sentencePractice: '\u9020\u53e5\u7ec3\u4e60',
  sentenceHint: '\u7528\u8be5\u8bcd\u7ec4\u5199\u4e00\u4e2a\u5b8c\u6574\u7684\u82f1\u6587\u53e5\u5b50\u3002',
  sentenceSubmit: '\u63d0\u4ea4\u9020\u53e5',
  sentenceCorrect: '\u9020\u53e5\u6b63\u786e\uff0c\u8bcd\u7ec4\u4f7f\u7528\u81ea\u7136\u3002',
  sentenceWrong: '\u8fd8\u9700\u4fee\u6539\u3002\u53c2\u8003\u4f8b\u53e5\uff1a',
  sentenceClose: '\u8fd4\u56de\u8bcd\u7ec4\u8868',
  sentenceAgain: '\u518d\u7ec3\u4e00\u53e5'
};
function normalizePhrase(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function cleanPhraseMeaning(value) {
  let text = String(value || '').replace(/\\b(?:v|n|adj|adv)\\.\\s*/gi, '');
  const parts = text.split(/[;；]/).map(part => part.trim()).filter(Boolean);
  const preferred = parts.find(part => /\\u8d77\\u5e8a|\\u7761\\u89c9|\\u64c5\\u957f|\\u5e2e\\u52a9|\\u53c2\\u52a0|\\u4e00\\u676f/.test(part)) || parts[0] || text;
  return preferred.replace(/[\\u3002.]+$/, '').trim();
}
function phraseThemeName(theme) { return phraseThemeLabels[theme] || theme; }
function savePhraseData() { writeJSON(STORAGE.phrases, state.phrases); }
function phraseValues() { return Object.values(state.phrases.entries || {}); }
function phraseRecord(seed) { return { word: normalizePhrase(seed.phrase), displayPhrase: seed.phrase, meaningZh: cleanPhraseMeaning(seed.meaningZh), example: seed.example, exampleZh: seed.exampleZh, level: seed.level, theme: seed.theme, source: seed.source || 'offline', mastery: 0, correct: 0, wrong: 0, nextReview: 0, addedAt: Date.now() }; }
function ensurePhraseCatalog() {
  phraseSeeds.forEach(seed => {
    const key = normalizePhrase(seed.phrase);
    const existing = state.phrases.entries[key];
    if (existing) {
      const repaired = Object.assign(phraseRecord(seed), {
        mastery: existing.mastery || 0,
        correct: existing.correct || 0,
        wrong: existing.wrong || 0,
        nextReview: existing.nextReview || 0,
        sentenceHistory: Array.isArray(existing.sentenceHistory) ? existing.sentenceHistory : []
      });
      state.phrases.entries[key] = repaired;
    } else if (!state.phrases.catalogSeeded) {
      state.phrases.entries[key] = phraseRecord(seed);
    }
  });
  state.phrases.catalogSeeded = true;
  savePhraseData();
}
function phraseStats() { const list = phraseValues(); return { total: list.length, due: list.filter(item => (item.nextReview || 0) <= Date.now()).length, mastered: list.filter(item => (item.mastery || 0) >= 5).length }; }
function visiblePhraseEntries() { const f = state.phrases.filters; const q = String(f.query || '').trim().toLowerCase(); return phraseValues().filter(item => (f.level === 'all' || item.level === f.level) && (f.theme === 'all' || item.theme === f.theme) && (!q || [item.displayPhrase, item.meaningZh, item.example, item.exampleZh, phraseThemeName(item.theme)].join(' ').toLowerCase().includes(q))).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0) || a.displayPhrase.localeCompare(b.displayPhrase)); }
function phraseCardHtml(item) { const key = escapeHtml(item.word); return `<article class="phrase-card"><div class="phrase-card-head"><div><span class="eyebrow">${escapeHtml(item.level)} \u00b7 ${escapeHtml(phraseThemeName(item.theme))}</span><h3>${escapeHtml(item.displayPhrase)}</h3><p class="word-meaning">${escapeHtml(item.meaningZh)}</p></div><button class="card-menu-button" type="button" data-phrase-action="speak" data-phrase-key="${key}" aria-label="${P.speak}">\ud83d\udd0a</button></div><p class="phrase-example">${escapeHtml(item.example)}</p><p class="phrase-example-zh">${escapeHtml(item.exampleZh)}</p><div class="mastery-row">${masteryDots(item.mastery || 0)}<span>${P.mastery} ${Number(item.mastery || 0)}/5</span></div><div class="phrase-actions">${item.mastery ? `<button class="secondary-button small" type="button" data-phrase-action="sentence" data-phrase-key="${key}">${P.sentencePractice}</button>` : ''}<button class="secondary-button small" type="button" data-phrase-action="master" data-phrase-key="${key}">${P.master}</button><button class="text-button" type="button" data-phrase-action="remove" data-phrase-key="${key}">${P.remove}</button></div></article>`; }
function renderPhraseView() {
  ensurePhraseCatalog();
  const root = $('#phrasePage');
  if (!root) return;
  if (phraseStudy) { root.innerHTML = renderPhraseStudy(); return; }
  if (phraseSentencePractice) { root.innerHTML = renderPhraseSentence(); return; }
  const stats = phraseStats();
  const filters = state.phrases.filters;
  const themes = Array.from(new Set(phraseValues().map(item => item.theme))).sort();
  const list = visiblePhraseEntries();
  root.innerHTML = `<div class="practice-panel phrase-panel"><div class="practice-panel-intro"><span class="eyebrow">PHRASE LAB</span><h2>${P.title}</h2><p>${P.subtitle}</p></div><div class="phrase-summary"><span><strong>${stats.total}</strong> ${P.total}</span><span><strong>${stats.due}</strong> ${P.due}</span><span><strong>${stats.mastered}</strong> ${P.mastered}</span></div><div class="practice-config-row phrase-config"><label>${P.level}<select id="phraseLevel">${['all','A1','A2','B1','CET4'].map(level => `<option value="${level}" ${filters.level === level ? 'selected' : ''}>${level === 'all' ? P.allLevels : level}</option>`).join('')}</select></label><label>${P.theme}<select id="phraseTheme"><option value="all">${P.allThemes}</option>${themes.map(theme => `<option value="${theme}" ${filters.theme === theme ? 'selected' : ''}>${escapeHtml(phraseThemeName(theme))}</option>`).join('')}</select></label><button class="secondary-button" type="button" data-phrase-action="generate">${P.generate}</button><button class="primary-button" type="button" data-phrase-action="review">${P.review}</button></div><div class="vocab-toolbar"><label class="search-field"><span>\u2315</span><input id="phraseSearch" type="search" value="${escapeHtml(filters.query)}" placeholder="${P.search}"></label><span class="muted">${P.showing} ${list.length}</span></div>${list.length ? `<div class="phrase-list">${list.map(phraseCardHtml).join('')}</div>` : `<div class="empty-state"><h2>${P.noMatch}</h2><p>${P.noMatchHint}</p></div>`}</div>`;
}
function phraseStudyQuestion(item) {
  const stage = phraseStudy.stage;
  if (stage === 0) {
    const wrong = phraseValues().filter(other => other.word !== item.word).slice(0, 30);
    const options = shuffle([item].concat(shuffle(wrong).slice(0, 3)));
    return `<h2 class="review-word">${escapeHtml(item.displayPhrase)}</h2><p>${P.chooseMeaning}</p><div class="study-options">${options.map(option => `<button class="study-option" type="button" data-phrase-action="answer" data-phrase-key="${escapeHtml(option.word)}">${escapeHtml(option.meaningZh)}</button>`).join('')}</div>`;
  }
  if (stage === 1) {
    const blank = escapeHtml(item.example.replace(item.displayPhrase, '____'));
    return `<h2 class="review-word">${blank}</h2><p>${P.fillPhrase}</p><div class="study-input-row"><input id="phraseFillInput" type="text" autocomplete="off" placeholder="${P.fillPhrase}"><button class="primary-button" type="button" data-phrase-action="submit">${P.submit}</button></div>`;
  }
  return `<h2 class="review-word">${escapeHtml(item.exampleZh)}</h2><p>${P.translate}</p><div class="study-input-row"><input id="phraseTranslationInput" type="text" autocomplete="off" placeholder="${P.translate}"><button class="primary-button" type="button" data-phrase-action="submit">${P.submit}</button></div>`;
}
function renderPhraseStudy() {
  const item = phraseStudy.queue[phraseStudy.index];
  if (!item) return `<div class="practice-panel"><div class="practice-panel-intro"><h2>${P.finished}</h2><button class="primary-button" type="button" data-phrase-action="close">${P.back}</button></div></div>`;
  const feedback = phraseStudy.feedback ? `<div class="answer-feedback ${phraseStudy.feedback.correct ? 'ok' : 'no'}">${phraseStudy.feedback.correct ? P.correct : P.wrong + escapeHtml(phraseStudy.feedback.answer)}</div>` : '';
  const action = phraseStudy.feedback ? `<button class="primary-button" type="button" data-phrase-action="next">${P.next}</button>` : '';
  return `<div class="practice-panel phrase-study-panel"><div class="review-top"><span>${phraseStudy.index + 1} / ${phraseStudy.queue.length} \u00b7 ${['\u8ba4\u91ca\u4e49','\u586b\u8bcd\u7ec4','\u7ffb\u8bd1'][phraseStudy.stage]}</span><button class="text-button" type="button" data-phrase-action="close">${P.close}</button></div>${phraseStudyQuestion(item)}${feedback}<div class="form-actions">${action}</div></div>`;
}
function startPhraseReview() {
  const source = visiblePhraseEntries().filter(item => !item.mastery || item.mastery < 5);
  const queue = (source.length ? source : phraseValues()).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0)).slice(0, 10);
  if (!queue.length) { showToast(P.noMatchHint); return; }
  phraseStudy = { queue, index: 0, stage: 0, results: [], feedback: null };
  renderPhraseView();
}
function phraseSubmit(value) {
  const item = phraseStudy.queue[phraseStudy.index];
  let correct = false;
  let answer = item.example;
  if (phraseStudy.stage === 0) { correct = value === item.word; answer = item.meaningZh; }
  else if (phraseStudy.stage === 1) { correct = normalizePhrase(value) === item.word; answer = item.displayPhrase; }
  else { const normalized = normalizePhrase(value); correct = normalized === normalizePhrase(item.example) || normalized.includes(item.word); }
  phraseStudy.feedback = { correct, answer };
  phraseStudy.results[phraseStudy.stage] = correct;
  renderPhraseView();
}
function phraseNext() {
  const item = phraseStudy.queue[phraseStudy.index];
  if (phraseStudy.stage < 2) { phraseStudy.stage += 1; phraseStudy.feedback = null; renderPhraseView(); return; }
  const allCorrect = phraseStudy.results.every(Boolean);
  item.correct = (item.correct || 0) + (allCorrect ? 1 : 0);
  item.wrong = (item.wrong || 0) + (allCorrect ? 0 : 1);
  item.mastery = allCorrect ? Math.min(5, (item.mastery || 0) + 1) : Math.max(0, (item.mastery || 0) - 1);
  item.nextReview = Date.now() + REVIEW_INTERVALS[Math.min(item.mastery || 0, REVIEW_INTERVALS.length - 1)] * DAY;
  phraseStudy.index += 1; phraseStudy.stage = 0; phraseStudy.results = []; phraseStudy.feedback = null;
  savePhraseData(); renderPhraseView();
}
async function generatePhrasesWithAI() {
  if (!isAIConfigured()) { showToast(P.aiFailed); return; }
  const level = state.phrases.filters.level === 'all' ? (state.settings.level || 'A1') : state.phrases.filters.level;
  const theme = state.phrases.filters.theme === 'all' ? 'life' : state.phrases.filters.theme;
  const existing = phraseValues().map(item => item.displayPhrase).slice(0, 80);
  setLoading(true, P.aiWorking);
  try {
    const parsed = extractJSON(await callAI([{ role: 'system', content: 'You are an English vocabulary teacher. Return JSON only: {"phrases":[{"phrase":"","meaningZh":"","example":"","exampleZh":""}]}. Return exactly 10 phrases. All meanings and Chinese examples MUST be Simplified Chinese.' }, { role: 'user', content: `Level: ${level}. Theme: ${phraseThemeName(theme)}. Avoid these existing phrases: ${JSON.stringify(existing)}.` }], 0.75));
    if (!parsed || !Array.isArray(parsed.phrases) || parsed.phrases.length < 5) throw new Error('invalid');
    parsed.phrases.slice(0, 10).forEach(item => { if (!item.phrase || !item.meaningZh) return; const key = normalizePhrase(item.phrase); if (!state.phrases.entries[key]) state.phrases.entries[key] = phraseRecord({ phrase: item.phrase, meaningZh: item.meaningZh, example: item.example || `I can use "${item.phrase}" in ${phraseThemeName(theme)}.`, exampleZh: item.exampleZh || `谈论${phraseThemeName(theme)}时可以使用“${item.meaningZh}”。`, level, theme, source: 'AI' }); });
    state.phrases.catalogSeeded = true; savePhraseData(); showToast(P.aiSuccess);
  } catch (error) { showToast(P.aiFailed); }
  finally { setLoading(false); renderPhraseView(); }
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-phrase-action]');
  if (!button) return;
  const action = button.dataset.phraseAction;
  const key = button.dataset.phraseKey;
  const item = phraseValues().find(entry => entry.word === key);
  if (action === 'generate') generatePhrasesWithAI();
  else if (action === 'review') startPhraseReview();
  else if (action === 'speak' && item) speakText(item.displayPhrase);
  else if (action === 'master' && item) { item.mastery = 5; item.nextReview = Date.now() + 30 * DAY; savePhraseData(); renderPhraseView(); }
  else if (action === 'remove' && item) { delete state.phrases.entries[key]; savePhraseData(); renderPhraseView(); }
  else if (action === 'answer') phraseSubmit(key);
  else if (action === 'submit') phraseSubmit(($('#phraseFillInput') || $('#phraseTranslationInput') || {}).value || '');
  else if (action === 'next') phraseNext();
  else if (action === 'close') { phraseStudy = null; renderPhraseView(); }
});
document.addEventListener('input', event => { if (event.target && event.target.id === 'phraseSearch') { state.phrases.filters.query = event.target.value; savePhraseData(); renderPhraseView(); } });
document.addEventListener('change', event => { if (event.target && event.target.id === 'phraseLevel') { state.phrases.filters.level = event.target.value; savePhraseData(); renderPhraseView(); } if (event.target && event.target.id === 'phraseTheme') { state.phrases.filters.theme = event.target.value; savePhraseData(); renderPhraseView(); } });
const phraseBaseShowView = showView;
showView = function (view) { phraseBaseShowView(view); if (view === 'phrases') renderPhraseView(); };
window.renderPhraseView = renderPhraseView;
function startPhraseSentence(key) {
  const item = phraseValues().find(entry => entry.word === key);
  if (!item) return;
  phraseStudy = null;
  phraseSentencePractice = { key, feedback: null };
  renderPhraseView();
}
function renderPhraseSentence() {
  const item = phraseValues().find(entry => entry.word === phraseSentencePractice.key);
  if (!item) { phraseSentencePractice = null; renderPhraseView(); return ''; }
  const feedback = phraseSentencePractice.feedback ? `<div class="answer-feedback ${phraseSentencePractice.feedback.correct ? 'ok' : 'no'}">${phraseSentencePractice.feedback.correct ? P.sentenceCorrect : P.sentenceWrong + escapeHtml(phraseSentencePractice.feedback.reference)}</div>` : '';
  return `<div class="practice-panel phrase-sentence-panel"><div class="practice-panel-intro"><span class="eyebrow">SENTENCE PRACTICE</span><h2>${P.sentencePractice}</h2><p>${escapeHtml(item.displayPhrase)} \u00b7 ${escapeHtml(item.meaningZh)}</p><p class="muted">${P.sentenceHint}</p></div><div class="practice-topic-preview"><strong>${escapeHtml(item.example)}</strong><span>${escapeHtml(item.exampleZh)}</span></div><textarea id="phraseSentenceInput" class="writing-input" placeholder="${P.sentenceHint}">${escapeHtml(phraseSentencePractice.answer || '')}</textarea>${feedback}<div class="form-actions"><button class="primary-button" type="button" data-phrase-action="sentence-submit">${P.sentenceSubmit}</button><button class="secondary-button" type="button" data-phrase-action="sentence-again">${P.sentenceAgain}</button><button class="text-button" type="button" data-phrase-action="sentence-close">${P.sentenceClose}</button></div></div>`;
}
async function submitPhraseSentence() {
  const item = phraseValues().find(entry => entry.word === phraseSentencePractice.key);
  if (!item) return;
  const input = $('#phraseSentenceInput');
  const answer = input ? input.value.trim() : '';
  if (!answer) { showToast(P.sentenceHint); return; }
  phraseSentencePractice.answer = answer;
  let feedback = { correct: false, reference: item.example };
  const localCorrect = answer.toLowerCase().includes(item.displayPhrase.toLowerCase()) && answer.split(/\s+/).length >= 4;
  if (isAIConfigured()) {
    setLoading(true, 'AI \u6b63\u5728\u68c0\u67e5\u9020\u53e5\u2026');
    try {
      const parsed = extractJSON(await callAI([{ role: 'system', content: 'You are an English teacher. Check whether the student sentence uses the given phrase correctly. Return JSON only: {"correct":true,"feedback":"Chinese feedback","correctedSentence":"","reference":"","explanation":""}. Feedback MUST be Simplified Chinese.' }, { role: 'user', content: `Phrase: ${item.displayPhrase}. Meaning: ${item.meaningZh}. Student sentence: ${answer}. Reference sentence: ${item.example}.` }], 0.2));
      if (parsed && typeof parsed.correct === 'boolean') feedback = { correct: parsed.correct, feedback: parsed.feedback || '', reference: parsed.correctedSentence || parsed.reference || item.example };
    } catch (error) { feedback = { correct: localCorrect, reference: item.example }; }
    finally { setLoading(false); }
  } else feedback = { correct: localCorrect, reference: item.example };
  item.sentenceHistory = [{ answer, correct: feedback.correct, feedback: feedback.feedback || '', createdAt: Date.now() }].concat(item.sentenceHistory || []).slice(0, 5);
  phraseSentencePractice.feedback = feedback;
  savePhraseData(); renderPhraseView();
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-phrase-action]');
  if (!button) return;
  const action = button.dataset.phraseAction;
  if (action === 'sentence') startPhraseSentence(button.dataset.phraseKey);
  else if (action === 'sentence-submit') submitPhraseSentence();
  else if (action === 'sentence-again') { phraseSentencePractice.feedback = null; phraseSentencePractice.answer = ''; renderPhraseView(); }
  else if (action === 'sentence-close') { phraseSentencePractice = null; renderPhraseView(); }
});
