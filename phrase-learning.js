'use strict';
STORAGE.phrases = 'english-learning:v1:phrases';
state.phrases = state.phrases && typeof state.phrases === 'object' ? state.phrases : readJSON(STORAGE.phrases, { entries: {}, catalogSeeded: false, filters: { level: 'all', theme: 'all', query: '' } });
state.phrases.entries = state.phrases.entries || {};
state.phrases.filters = Object.assign({ level: 'all', theme: 'all', query: '' }, state.phrases.filters || {});
let phraseStudy = null;
let phraseChallenge = null;
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
  review: '\u5f00\u59cb\u5b66\u4e60',
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
Object.assign(P, {
  stepMeaning: '\u731c\u91ca\u4e49',
  stepUsage: '\u770b\u7528\u6cd5',
  stepSentence: '\u63d0\u793a\u9020\u53e5',
  stepRating: '\u8bb0\u5fc6\u53cd\u9988',
  guessPrompt: '\u5148\u731c\u4e00\u4e0b\u5b83\u7684\u610f\u601d',
  usagePrompt: '\u770b\u770b\u642d\u914d\u548c\u4f8b\u53e5\uff0c\u518d\u8fdb\u5165\u9020\u53e5',
  sentencePrompt: '\u6839\u636e\u63d0\u793a\u5199\u4e00\u4e2a\u5b8c\u6574\u82f1\u6587\u53e5\u5b50\uff0c\u5305\u542b\u76ee\u6807\u8bcd\u7ec4\u3002',
  hint: '\u7ed9\u6211\u63d0\u793a',
  hintShown: '\u63d0\u793a\uff1a',
  ratingPrompt: '\u8fd9\u6b21\u611f\u89c9\u600e\u4e48\u6837\uff1f',
  forgot: '\u5fd8\u4e86',
  fuzzy: '\u6a21\u7cca',
  remember: '\u8bb0\u4f4f\u4e86',
  skip: '\u7a0d\u540e\u518d\u7ec3',
  noCollocations: '\u5148\u8bb0\u4f4f\u8fd9\u4e2a\u8bcd\u7ec4\u672c\u8eab\u3002',
  challenge: '\u6311\u6218\u7ffb\u8bd1\uff08\u53ef\u9009\uff09',
  challengeHint: '\u7ffb\u8bd1\u4e0d\u5f71\u54cd\u672c\u8bcd\u7ec4\u8fdb\u5ea6\u3002',
  challengePrompt: '\u628a\u4e0b\u9762\u4e2d\u6587\u8bd1\u6210\u82f1\u6587\uff0c\u5e76\u5305\u542b\u76ee\u6807\u8bcd\u7ec4\u3002',
  challengeSubmit: '\u63d0\u4ea4\u6311\u6218',
  challengeReference: '\u53c2\u8003\u8bd1\u6587',
  challengeDone: '\u6311\u6218\u5b8c\u6210\uff08\u4e0d\u8ba1\u5165\u719f\u7ec3\u5ea6\uff09',
  backToPhrase: '\u8fd4\u56de\u8bcd\u7ec4\u8868',
  nextPhrase: '\u4e0b\u4e00\u4e2a\u8bcd\u7ec4',
  finish: '\u672c\u8f6e\u5b66\u4e60\u5b8c\u6210',
  skipped: '\u5df2\u653e\u5230\u672c\u8f6e\u6700\u540e\u3002',
  newCount: '\u65b0\u8bcd\u7ec4',
  reviewCount: '\u590d\u4e60',
  autoPass: '\u5df2\u901a\u8fc7',
  autoFail: '\u8fd8\u9700\u518d\u7ec3'
});

function normalizePhrase(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function phraseStorageKey(seed) { const phrase = normalizePhrase(seed && (seed.phrase || seed.displayPhrase || seed.word)); return [phrase, seed && seed.level || '', seed && seed.theme || ''].join('::'); }
function cleanPhraseMeaning(value) {
  let text = String(value || '').replace(/\b(?:v|n|adj|adv)\.\s*/gi, '');
  const parts = text.split(/[;\uFF1B]/).map(part => part.trim()).filter(Boolean);
  const preferred = parts.find(part => /\u8d77\u5e8a|\u7761\u89c9|\u64c5\u957f|\u5e2e\u52a9|\u53c2\u52a0|\u4e00\u676f/.test(part)) || parts[0] || text;
  return preferred.replace(/[\u3002.]+$/, '').trim();
}
function phraseThemeName(theme) { return phraseThemeLabels[theme] || theme; }
function savePhraseData() { writeJSON(STORAGE.phrases, state.phrases); }
function phraseValues() { return Object.values(state.phrases.entries || {}); }
function phraseRecord(seed) { return { word: phraseStorageKey(seed), displayPhrase: seed.phrase, meaningZh: cleanPhraseMeaning(seed.meaningZh), example: seed.example, exampleZh: seed.exampleZh, collocations: Array.isArray(seed.collocations) ? seed.collocations.filter(Boolean).slice(0, 2) : [], level: seed.level, theme: seed.theme, source: seed.source || 'offline', mastery: 0, correct: 0, wrong: 0, nextReview: 0, practiceCount: 0, addedAt: Date.now() }; }
function ensurePhraseCatalog() {
  const previous = Object.assign({}, state.phrases.entries || {});
  const next = {};
  const legacyUsed = new Set();
  phraseSeeds.forEach(seed => {
    const key = phraseStorageKey(seed);
    const legacyKey = normalizePhrase(seed.phrase);
    let existing = previous[key];
    if (!existing && !legacyUsed.has(legacyKey) && previous[legacyKey]) {
      existing = previous[legacyKey];
      legacyUsed.add(legacyKey);
    }
    const record = phraseRecord(seed);
    if (existing) {
      record.mastery = existing.mastery || 0;
      record.correct = existing.correct || 0;
      record.wrong = existing.wrong || 0;
      record.nextReview = existing.nextReview || 0;
      record.practiceCount = Number(existing.practiceCount) || (Array.isArray(existing.sentenceHistory) ? existing.sentenceHistory.length : 0);
      record.sentenceHistory = Array.isArray(existing.sentenceHistory) ? existing.sentenceHistory : [];
    }
    next[key] = record;
  });
  Object.keys(previous).forEach(key => {
    const entry = previous[key];
    const builtIn = phraseSeeds.some(seed => normalizePhrase(seed.phrase) === normalizePhrase(entry && entry.displayPhrase));
    if (!builtIn && entry && entry.source !== 'offline') next[key] = entry;
  });
  state.phrases.entries = next;
  state.phrases.catalogSeeded = true;
  savePhraseData();
}
function phraseStats() { const list = phraseValues(); return { total: list.length, due: list.filter(item => !isNewPhrase(item) && Number(item.mastery || 0) < 5 && (item.nextReview || 0) <= Date.now()).length, mastered: list.filter(item => (item.mastery || 0) >= 5).length }; }
function visiblePhraseEntries() { const f = state.phrases.filters; const q = String(f.query || '').trim().toLowerCase(); return phraseValues().filter(item => (f.level === 'all' || item.level === f.level) && (f.theme === 'all' || item.theme === f.theme) && (!q || [item.displayPhrase, item.meaningZh, item.example, item.exampleZh, phraseThemeName(item.theme)].join(' ').toLowerCase().includes(q))).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0) || a.displayPhrase.localeCompare(b.displayPhrase)); }
function phraseCardHtml(item) {
  const key = escapeHtml(item.word);
  const collocations = Array.isArray(item.collocations) ? item.collocations.filter(Boolean).slice(0, 2) : [];
  const challenge = Number(item.mastery || 0) >= 3 ? `<button class="secondary-button small" type="button" data-phrase-action="challenge" data-phrase-key="${key}">${P.challenge}</button>` : '';
  return `<article class="phrase-card"><div class="phrase-card-head"><div><span class="eyebrow">${escapeHtml(item.level)} \u00b7 ${escapeHtml(phraseThemeName(item.theme))}</span><h3>${escapeHtml(item.displayPhrase)}</h3><p class="word-meaning">${escapeHtml(item.meaningZh)}</p></div><button class="card-menu-button" type="button" data-phrase-action="speak" data-phrase-key="${key}" aria-label="${P.speak}">\ud83d\udd0a</button></div>${collocations.length ? `<div class="phrase-collocations compact">${collocations.map(text => `<span>${escapeHtml(text)}</span>`).join('')}</div>` : ''}<p class="phrase-example">${escapeHtml(item.example)}</p><p class="phrase-example-zh">${escapeHtml(item.exampleZh)}</p><div class="mastery-row">${masteryDots(item.mastery || 0)}<span>${P.mastery} ${Number(item.mastery || 0)}/5</span></div><div class="phrase-actions">${challenge}<button class="secondary-button small" type="button" data-phrase-action="master" data-phrase-key="${key}">${P.master}</button><button class="text-button" type="button" data-phrase-action="remove" data-phrase-key="${key}">${P.remove}</button></div></article>`;
}
function renderPhraseView() {
  ensurePhraseCatalog();
  const root = $('#phrasePage');
  if (!root) return;
  if (phraseChallenge) { root.innerHTML = renderPhraseChallenge(); return; }
  if (phraseStudy) { root.innerHTML = renderPhraseStudy(); return; }
  const stats = phraseStats();
  const filters = state.phrases.filters;
  const themes = Array.from(new Set(phraseValues().map(item => item.theme))).sort();
  const list = visiblePhraseEntries();
  root.innerHTML = `<div class="practice-panel phrase-panel"><div class="practice-panel-intro"><span class="eyebrow">PHRASE LAB</span><h2>${P.title}</h2><p>${P.subtitle}</p></div><div class="phrase-summary"><span><strong>${stats.total}</strong> ${P.total}</span><span><strong>${stats.due}</strong> ${P.due}</span><span><strong>${stats.mastered}</strong> ${P.mastered}</span></div><div class="practice-config-row phrase-config"><label>${P.level}<select id="phraseLevel">${['all','A1','A2','B1','CET4'].map(level => `<option value="${level}" ${filters.level === level ? 'selected' : ''}>${level === 'all' ? P.allLevels : level}</option>`).join('')}</select></label><label>${P.theme}<select id="phraseTheme"><option value="all">${P.allThemes}</option>${themes.map(theme => `<option value="${theme}" ${filters.theme === theme ? 'selected' : ''}>${escapeHtml(phraseThemeName(theme))}</option>`).join('')}</select></label><button class="secondary-button" type="button" data-phrase-action="generate">${P.generate}</button><button class="primary-button" type="button" data-phrase-action="review">${P.review}</button></div><div class="vocab-toolbar"><label class="search-field"><span>\u2315</span><input id="phraseSearch" type="search" value="${escapeHtml(filters.query)}" placeholder="${P.search}"></label><span class="muted">${P.showing} ${list.length}</span></div>${list.length ? `<div class="phrase-list">${list.map(phraseCardHtml).join('')}</div>` : `<div class="empty-state"><h2>${P.noMatch}</h2><p>${P.noMatchHint}</p></div>`}</div>`;
}

function isNewPhrase(item) { return !(item.practiceCount || item.mastery || item.correct || item.wrong || (Array.isArray(item.sentenceHistory) && item.sentenceHistory.length)); }
function phraseStepLabel(step) { return ({ meaning: P.stepMeaning, usage: P.stepUsage, sentence: P.stepSentence, rating: P.stepRating })[step] || ''; }
function phraseStepNumber(step) { return ({ meaning: 1, usage: 2, sentence: 3, rating: 4 })[step] || 1; }
function phraseCueWords(item) { const list = Array.isArray(item.collocations) ? item.collocations.filter(Boolean).slice(0, 2) : []; return [item.displayPhrase].concat(list).slice(0, 3); }
function phraseCollocationHtml(item) {
  const list = Array.isArray(item.collocations) ? item.collocations.filter(Boolean).slice(0, 2) : [];
  if (!list.length) return `<p class="muted">${P.noCollocations}</p>`;
  return `<div class="phrase-collocations">${list.map(text => `<span>${escapeHtml(text)}</span>`).join('')}</div>`;
}
function phraseUsageExampleHtml(item) { return `<div class="phrase-usage-example"><strong>${escapeHtml(item.example)}</strong><span>${escapeHtml(item.exampleZh)}</span></div>`; }
function phraseFeedbackHtml() {
  if (!phraseStudy || !phraseStudy.feedback) return '';
  const feedback = phraseStudy.feedback;
  const message = feedback.correct ? (feedback.feedback || P.correct) : (feedback.feedback || P.wrong + (feedback.reference || ''));
  return `<div class="answer-feedback ${feedback.correct ? 'ok' : 'no'}">${escapeHtml(message)}</div>`;
}
function phraseStudyActions() {
  const step = phraseStudy.step;
  const autoPass = Boolean(phraseStudy.results && phraseStudy.results.meaning && phraseStudy.results.sentence);
  if (step === 'meaning' && phraseStudy.feedback) return `<button class="primary-button" type="button" data-phrase-action="to-usage">${P.next}</button>`;
  if (step === 'usage') return `<button class="primary-button" type="button" data-phrase-action="to-sentence">${P.next}</button>`;
  if (step === 'sentence' && phraseStudy.feedback) return `<button class="primary-button" type="button" data-phrase-action="to-rating">${P.next}</button>`;
  if (step === 'rating') return `<div class="phrase-rating-actions"><button class="secondary-button" type="button" data-phrase-action="rating" data-rating="forgot">${P.forgot}</button><button class="secondary-button" type="button" data-phrase-action="rating" data-rating="fuzzy">${P.fuzzy}</button><button class="primary-button" type="button" data-phrase-action="rating" data-rating="remember" ${autoPass ? '' : 'disabled'}>${P.remember}</button></div>`;
  return '';
}
function phraseStudyQuestion(item) {
  const step = phraseStudy.step;
  if (step === 'meaning') {
    const wrong = phraseValues().filter(other => other.word !== item.word).slice(0, 30);
    const options = shuffle([item].concat(shuffle(wrong).slice(0, 3)));
    return `<p class="eyebrow">${P.stepMeaning}</p><h2 class="coach-title">${escapeHtml(item.displayPhrase)}</h2><button class="text-button phrase-speak" type="button" data-phrase-action="speak" data-phrase-key="${escapeHtml(item.word)}">${P.speak}</button><p class="coach-prompt">${P.guessPrompt}</p><div class="study-options">${options.map(option => `<button class="study-option" type="button" data-phrase-action="meaning-answer" data-phrase-key="${escapeHtml(option.word)}">${escapeHtml(option.meaningZh)}</button>`).join('')}</div>`;
  }
  if (step === 'usage') {
    return `<p class="eyebrow">${P.stepUsage}</p><h2 class="coach-title">${escapeHtml(item.displayPhrase)}</h2><button class="text-button phrase-speak" type="button" data-phrase-action="speak" data-phrase-key="${escapeHtml(item.word)}">${P.speak}</button><p class="coach-prompt">${P.usagePrompt}</p>${phraseCollocationHtml(item)}${phraseUsageExampleHtml(item)}`;
  }
  if (step === 'sentence') {
    const hint = phraseStudy.hint ? `<div class="phrase-hint-box">${P.hintShown}${escapeHtml(item.example.split(/\s+/).slice(0, 4).join(' '))} ...</div>` : '';
    return `<p class="eyebrow">${P.stepSentence}</p><h2 class="coach-title coach-title-small">${escapeHtml(item.exampleZh)}</h2><p class="coach-prompt">${P.sentencePrompt}</p><div class="phrase-cue-row">${phraseCueWords(item).map(text => `<span>${escapeHtml(text)}</span>`).join('')}</div><textarea id="phraseSentenceInput" class="writing-input" placeholder="${P.sentenceHint}">${escapeHtml(phraseStudy.sentence || '')}</textarea><div class="phrase-sentence-actions"><button class="primary-button" type="button" data-phrase-action="sentence-submit">${P.submit}</button><button class="secondary-button" type="button" data-phrase-action="phrase-hint">${P.hint}</button></div>${hint}`;
  }
  const autoPass = Boolean(phraseStudy.results && phraseStudy.results.meaning && phraseStudy.results.sentence);
  return `<p class="eyebrow">${P.stepRating}</p><h2 class="coach-title coach-title-small">${P.ratingPrompt}</h2><div class="phrase-rating-summary"><strong>${escapeHtml(item.displayPhrase)} \u00b7 ${escapeHtml(item.meaningZh)}</strong><span class="${autoPass ? 'auto-pass' : 'auto-fail'}">${autoPass ? P.autoPass : P.autoFail}</span></div>`;
}function renderPhraseStudy() {
  if (!phraseStudy) return '';
  const item = phraseStudy.queue[phraseStudy.index];
  if (!item) {
    const challengeItems = phraseStudy.queue.filter(entry => Number(entry.mastery || 0) >= 3);
    const challengeHtml = challengeItems.length ? `<div class="phrase-challenge-list">${challengeItems.map(entry => `<button class="secondary-button small" type="button" data-phrase-action="challenge" data-phrase-key="${escapeHtml(entry.word)}">${P.challenge}</button>`).join('')}</div>` : '';
    return `<div class="practice-panel phrase-study-panel phrase-complete-panel"><div class="review-top"><span>${P.finish}</span></div><h2 class="coach-title">${P.finish}</h2><p class="coach-prompt">${P.newCount} ${phraseStudy.sessionStats.newCount} \u00b7 ${P.reviewCount} ${phraseStudy.sessionStats.reviewCount}</p><div class="phrase-session-result"><strong>${phraseStudy.completed}</strong><span>\u5df2\u5b8c\u6210</span></div>${challengeHtml}<div class="form-actions"><button class="primary-button" type="button" data-phrase-action="close">${P.backToPhrase}</button></div></div>`;
  }
  const step = phraseStudy.step;
  return `<div class="practice-panel phrase-study-panel"><div class="review-top"><span>${phraseStudy.index + 1} / ${phraseStudy.queue.length} \u00b7 ${phraseStepNumber(step)}/4 \u00b7 ${phraseStepLabel(step)}</span><div class="review-top-actions"><button class="text-button" type="button" data-phrase-action="skip">${P.skip}</button><button class="text-button" type="button" data-phrase-action="close">${P.close}</button></div></div>${phraseStudyQuestion(item)}${phraseFeedbackHtml()}<div class="form-actions">${phraseStudyActions()}</div></div>`;
}
function resetPhraseStep() {
  phraseStudy.step = 'meaning'; phraseStudy.results = { meaning: null, sentence: null }; phraseStudy.feedback = null; phraseStudy.sentence = ''; phraseStudy.hint = false;
}
function startPhraseReview() {
  const all = visiblePhraseEntries();
  const now = Date.now();
  const fresh = all.filter(item => Number(item.mastery || 0) < 5 && isNewPhrase(item));
  const due = all.filter(item => Number(item.mastery || 0) < 5 && !isNewPhrase(item) && (item.nextReview || 0) <= now).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0) || a.displayPhrase.localeCompare(b.displayPhrase));
  const selected = [];
  const selectedKeys = new Set();
  const add = list => { list.forEach(item => { if (selected.length >= 10 || selectedKeys.has(item.word)) return; selected.push(item); selectedKeys.add(item.word); }); };
  add(due.slice(0, 5));
  add(fresh.slice(0, 5));
  const remaining = all.filter(item => !selectedKeys.has(item.word) && Number(item.mastery || 0) < 5).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0) || a.displayPhrase.localeCompare(b.displayPhrase));
  add(remaining);
  if (!selected.length) { showToast(P.noMatchHint); return; }
  phraseChallenge = null;
  phraseStudy = { queue: selected, index: 0, step: 'meaning', results: { meaning: null, sentence: null }, feedback: null, sentence: '', hint: false, sessionStats: { newCount: selected.filter(isNewPhrase).length, reviewCount: selected.filter(item => !isNewPhrase(item)).length }, completed: 0 };
  renderPhraseView();
}
function submitPhraseMeaning(key) {
  const item = phraseStudy.queue[phraseStudy.index];
  if (!item) return;
  const correct = key === item.word;
  phraseStudy.results.meaning = correct;
  phraseStudy.feedback = { correct, reference: item.meaningZh, feedback: correct ? P.correct : P.wrong + item.meaningZh };
  renderPhraseView();
}
async function phraseSentenceSubmit() {
  const item = phraseStudy.queue[phraseStudy.index];
  if (!item) return;
  const input = $('#phraseSentenceInput');
  const answer = input ? input.value.trim() : '';
  if (!answer) { showToast(P.sentenceHint); return; }
  phraseStudy.sentence = answer;
  let feedback = { correct: normalizePhrase(answer).includes(normalizePhrase(item.displayPhrase)) && answer.split(/\s+/).length >= 4, feedback: '', reference: item.example };
  if (isAIConfigured()) {
    setLoading(true, '\u6b63\u5728\u68c0\u67e5\u8fd9\u4e2a\u53e5\u5b50\u2026');
    try {
      const parsed = extractJSON(await callAI([{ role: 'system', content: 'You are an English teacher. Check whether the student sentence uses the given phrase correctly. Return JSON only: {"correct":true,"feedback":"Chinese feedback","correctedSentence":"","reference":""}. Feedback MUST be Simplified Chinese.' }, { role: 'user', content: `Phrase: ${item.displayPhrase}. Meaning: ${item.meaningZh}. Student sentence: ${answer}. Reference sentence: ${item.example}.` }], 0.2));
      if (parsed && typeof parsed.correct === 'boolean') feedback = { correct: parsed.correct, feedback: parsed.feedback || '', reference: parsed.correctedSentence || parsed.reference || item.example };
    } catch (error) { /* keep local result */ }
    finally { setLoading(false); }
  }
  phraseStudy.results.sentence = feedback.correct;
  phraseStudy.feedback = feedback;
  renderPhraseView();
}
function ratePhrase(rating) {
  const item = phraseStudy.queue[phraseStudy.index];
  if (!item) return;
  const autoPass = Boolean(phraseStudy.results && phraseStudy.results.meaning && phraseStudy.results.sentence);
  if (rating === 'remember' && !autoPass) return;
  if (rating === 'remember') {
    item.mastery = Math.min(5, (item.mastery || 0) + 1);
    item.correct = (item.correct || 0) + 1;
    const interval = (typeof REVIEW_INTERVALS !== 'undefined' ? REVIEW_INTERVALS : [0, 1, 3, 7, 14, 30])[Math.min(item.mastery, 5)] || 1;
    item.nextReview = Date.now() + interval * DAY;
  } else if (rating === 'fuzzy') {
    item.nextReview = Date.now() + DAY;
    if (!autoPass) item.wrong = (item.wrong || 0) + 1;
  } else {
    item.mastery = Math.max(0, (item.mastery || 0) - 1);
    item.wrong = (item.wrong || 0) + 1;
    item.nextReview = Date.now();
  }
  item.practiceCount = (item.practiceCount || 0) + 1;
  item.sentenceHistory = [{ answer: phraseStudy.sentence || '', correct: autoPass, rating, feedback: phraseStudy.feedback ? (phraseStudy.feedback.feedback || '') : '', createdAt: Date.now() }].concat(item.sentenceHistory || []).slice(0, 5);
  state.phrases.entries[item.word] = item;
  phraseStudy.completed += 1;
  phraseStudy.index += 1;
  resetPhraseStep();
  savePhraseData(); renderPhraseView();
}
function skipPhrase() {
  if (!phraseStudy || phraseStudy.queue.length <= 1) { showToast(P.skipped); return; }
  const current = phraseStudy.queue.splice(phraseStudy.index, 1)[0];
  phraseStudy.queue.push(current);
  resetPhraseStep();
  renderPhraseView();
  showToast(P.skipped);
}function phraseChallengeItem() { return phraseChallenge ? phraseValues().find(entry => entry.word === phraseChallenge.key) : null; }
function renderPhraseChallenge() {
  const item = phraseChallengeItem();
  if (!item) { phraseChallenge = null; renderPhraseView(); return ''; }
  const feedback = phraseChallenge.feedback ? `<div class="answer-feedback ${phraseChallenge.feedback.correct ? 'ok' : 'no'}">${escapeHtml(phraseChallenge.feedback.correct ? (phraseChallenge.feedback.feedback || P.challengeDone) : (phraseChallenge.feedback.feedback || P.wrong))}</div><div class="phrase-reference"><span>${P.challengeReference}</span><strong>${escapeHtml(item.example)}</strong></div>` : '';
  return `<div class="practice-panel phrase-study-panel phrase-challenge-panel"><div class="review-top"><span>${P.challenge}</span><button class="text-button" type="button" data-phrase-action="challenge-close">${P.close}</button></div><p class="eyebrow">${P.challenge}</p><h2 class="coach-title">${escapeHtml(item.displayPhrase)}</h2><p class="coach-prompt">${P.challengePrompt}</p><div class="phrase-challenge-prompt">${escapeHtml(item.exampleZh)}</div><textarea id="phraseChallengeInput" class="writing-input" placeholder="${P.challengePrompt}">${escapeHtml(phraseChallenge.answer || '')}</textarea>${feedback}<div class="form-actions"><button class="primary-button" type="button" data-phrase-action="challenge-submit">${P.challengeSubmit}</button><button class="secondary-button" type="button" data-phrase-action="challenge-close">${P.backToPhrase}</button></div></div>`;
}
function startPhraseChallenge(key) {
  const item = phraseValues().find(entry => entry.word === key);
  if (!item) return;
  phraseStudy = null;
  phraseChallenge = { key, answer: '', feedback: null };
  renderPhraseView();
}
async function submitPhraseChallenge() {
  const item = phraseChallengeItem();
  if (!item) return;
  const input = $('#phraseChallengeInput');
  const answer = input ? input.value.trim() : '';
  if (!answer) { showToast(P.challengePrompt); return; }
  phraseChallenge.answer = answer;
  let feedback = { correct: normalizePhrase(answer).includes(normalizePhrase(item.displayPhrase)) && answer.split(/\s+/).length >= 4, feedback: '' };
  if (isAIConfigured()) {
    setLoading(true, '\u6b63\u5728\u68c0\u67e5\u7ffb\u8bd1\u2026');
    try {
      const parsed = extractJSON(await callAI([{ role: 'system', content: 'You are an English teacher. Evaluate this optional translation. Return JSON only: {"correct":true,"feedback":"Chinese feedback"}. Feedback MUST be Simplified Chinese. This result must not affect the main learning progress.' }, { role: 'user', content: `Phrase: ${item.displayPhrase}. Chinese: ${item.exampleZh}. Reference: ${item.example}. Student translation: ${answer}.` }], 0.2));
      if (parsed && typeof parsed.correct === 'boolean') feedback = { correct: parsed.correct, feedback: parsed.feedback || '' };
    } catch (error) { /* keep local result */ }
    finally { setLoading(false); }
  }
  phraseChallenge.feedback = feedback;
  renderPhraseView();
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
    parsed.phrases.slice(0, 10).forEach(item => {
      if (!item.phrase || !item.meaningZh) return;
      const seed = {
        phrase: item.phrase,
        meaningZh: item.meaningZh,
        example: item.example || `I can use "${item.phrase}" in ${phraseThemeName(theme)}.`,
        exampleZh: item.exampleZh || `\u8c08\u8bba${phraseThemeName(theme)}\u65f6\u53ef\u4ee5\u4f7f\u7528\u201c${item.meaningZh}\u201d\u3002`,
        level,
        theme,
        source: 'AI'
      };
      const key = phraseStorageKey(seed);
      if (!state.phrases.entries[key]) state.phrases.entries[key] = phraseRecord(seed);
    });
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
  else if (action === 'meaning-answer') submitPhraseMeaning(key);
  else if (action === 'to-usage') { phraseStudy.step = 'usage'; phraseStudy.feedback = null; renderPhraseView(); }
  else if (action === 'to-sentence') { phraseStudy.step = 'sentence'; phraseStudy.feedback = null; renderPhraseView(); }
  else if (action === 'sentence-submit') phraseSentenceSubmit();
  else if (action === 'phrase-hint') { phraseStudy.hint = true; renderPhraseView(); }
  else if (action === 'to-rating') { phraseStudy.step = 'rating'; phraseStudy.feedback = null; renderPhraseView(); }
  else if (action === 'rating') ratePhrase(button.dataset.rating || 'fuzzy');
  else if (action === 'skip') skipPhrase();
  else if (action === 'challenge' && item) startPhraseChallenge(key);
  else if (action === 'challenge-submit') submitPhraseChallenge();
  else if (action === 'challenge-close') { phraseChallenge = null; renderPhraseView(); }
  else if (action === 'close') { phraseStudy = null; renderPhraseView(); }
});
document.addEventListener('input', event => { if (event.target && event.target.id === 'phraseSearch') { state.phrases.filters.query = event.target.value; savePhraseData(); renderPhraseView(); } });
document.addEventListener('change', event => { if (event.target && event.target.id === 'phraseLevel') { state.phrases.filters.level = event.target.value; savePhraseData(); renderPhraseView(); } if (event.target && event.target.id === 'phraseTheme') { state.phrases.filters.theme = event.target.value; savePhraseData(); renderPhraseView(); } });
const phraseBaseShowView = showView;
showView = function (view) { phraseBaseShowView(view); if (view === 'phrases') renderPhraseView(); };
window.renderPhraseView = renderPhraseView;
