'use strict';
STORAGE.translation = 'english-learning:v1:translation';
state.translation = state.translation && typeof state.translation === 'object' ? state.translation : readJSON(STORAGE.translation, { cache: {}, active: null, history: [], level: 'A1', theme: 'life' });
state.translation.cache = state.translation.cache || {};
state.translation.history = Array.isArray(state.translation.history) ? state.translation.history : [];
const T = {
  title: '\u7ffb\u8bd1\u7ec3\u4e60',
  subtitle: '\u6bcf\u6b21 8 \u9053 AI \u53cc\u5411\u7ffb\u8bd1\u9898\uff0c\u79bb\u7ebf\u56de\u9000 6 \u9053\uff1b\u4e2d\u7ffb\u82f1\u548c\u82f1\u7ffb\u4e2d\u5404\u5360\u4e00\u534a\u3002',
  level: '\u7ffb\u8bd1\u96be\u5ea6',
  theme: '\u7ffb\u8bd1\u4e3b\u9898',
  generate: 'AI \u751f\u6210 8 \u9053',
  offline: '\u5f00\u59cb\u79bb\u7ebf 6 \u9053',
  history: '\u6700\u8fd1\u7ffb\u8bd1',
  noHistory: '\u8fd8\u6ca1\u6709\u7ffb\u8bd1\u8bb0\u5f55\u3002',
  submit: '\u63d0\u4ea4\u5e76\u6279\u6539',
  self: '\u63d0\u4ea4\u5e76\u81ea\u8bc4',
  close: '\u8fd4\u56de',
  ref: '\u53c2\u8003\u8bd1\u6587\uff1a',
  correct: '\u56de\u7b54\u6b63\u786e\u3002',
  retry: '\u91cd\u505a\u672c\u9898',
  mastered: '\u5df2\u638c\u63e1',
  zhEn: '\u4e2d\u7ffb\u82f1',
  enZh: '\u82f1\u7ffb\u4e2d',
  answer: '\u5199\u4e0b\u4f60\u7684\u7ffb\u8bd1',
  delete: '\u5220\u9664'
};
function saveTranslationData() { writeJSON(STORAGE.translation, state.translation); }
function translationKey(level, theme) { return `${level}:${theme}`; }
function translationQuestionsFor(level, theme) { const exact = translationSeeds.filter(item => item.level === level && (theme === 'all' || item.theme === theme)); const pool = exact.length >= 6 ? exact : translationSeeds.filter(item => item.level === level); return pool.slice(0, 6); }
function translationQuestionHtml(question, index, session) {
  const value = session.answers[question.id] || '';
  const result = session.results ? session.results.find(item => item.id === question.id) : null;
  const feedback = result ? `<div class="answer-feedback ${result.correct ? 'ok' : 'no'}">${escapeHtml(result.feedback || (result.correct ? T.correct : T.ref + question.referenceAnswer))}</div>` : '';
  return `<div class="practice-question" data-translation-question="${question.id}"><span class="question-label">${question.direction === 'zh-en' ? T.zhEn : T.enZh} ${index + 1}</span><div class="question-text">${escapeHtml(question.prompt)}</div><textarea class="translation-input" data-translation-answer="${question.id}" ${session.submitted ? 'disabled' : ''} placeholder="${T.answer}">${escapeHtml(value)}</textarea>${feedback}</div>`;
}
function translationSessionHtml(session) {
  const correct = session.results ? session.results.filter(item => item.correct).length : 0;
  return `<div class="practice-session-head"><div><span class="eyebrow">TRANSLATION DRILL</span><h2>${T.title}</h2><p>${session.level} \u00b7 ${session.questions.length} \u9053</p></div><button class="secondary-button" type="button" data-translation-action="close">${T.close}</button></div><div class="practice-question-list">${session.questions.map((q, i) => translationQuestionHtml(q, i, session)).join('')}</div>${session.submitted ? `<div class="practice-result show"><span class="eyebrow">\u672c\u6b21\u7ed3\u679c</span><strong>${session.score}%</strong><p>${correct}/${session.questions.length} \u9053\u6b63\u786e\u3002\u9519\u9898\u5df2\u52a0\u5165\u9519\u9898\u672c\u3002</p></div>` : ''}<div class="form-actions"><button class="primary-button" type="button" data-translation-action="${session.submitted ? 'close' : (isAIConfigured() ? 'submit' : 'submit-self')}">${session.submitted ? T.close : (isAIConfigured() ? T.submit : T.self)}</button>${session.submitted ? '<button class="secondary-button" type="button" data-translation-action="new">\u6362\u4e00\u7ec4</button>' : ''}</div>`;
}
function renderTranslationPanel() {
  const session = state.translation.active;
  if (session) return `<div class="practice-panel translation-practice-panel">${translationSessionHtml(session)}</div>`;
  const level = state.translation.level || state.settings.level || 'A1';
  const theme = state.translation.theme || 'life';
  return `<div class="practice-panel translation-practice-panel"><div class="practice-panel-intro"><span class="eyebrow">TRANSLATION DRILL</span><h2>${T.title}</h2><p>${T.subtitle}</p></div><div class="practice-config-row"><label>${T.level}<select id="translationLevel">${LEVEL_ORDER.map(item => `<option value="${item}" ${item === level ? 'selected' : ''}>${LEVEL_LABELS[item]}</option>`).join('')}</select></label><label>${T.theme}<select id="translationTheme">${Object.keys(practiceThemes).map(item => `<option value="${item}" ${item === theme ? 'selected' : ''}>${practiceThemes[item]}</option>`).join('')}</select></label><button class="primary-button" type="button" data-translation-action="generate">${T.generate}</button><button class="secondary-button" type="button" data-translation-action="offline">${T.offline}</button></div><div id="translationStreamStatus" class="ai-stream-status hidden" role="status"></div>${state.translation.history.length ? `<div class="writing-history"><h3>${T.history}</h3>${state.translation.history.slice(0, 5).map(item => `<article><strong>${escapeHtml(item.level)} \u00b7 ${escapeHtml(practiceThemes[item.theme] || item.theme)}</strong><small>${item.score == null ? '\u81ea\u8bc4' : item.score + ' \u5206'}</small><p>${escapeHtml(item.answer || '')}</p><button class="text-button" type="button" data-translation-action="delete-history" data-translation-id="${item.id}">${T.delete}</button></article>`).join('')}</div>` : `<p class="muted">${T.noHistory}</p>`}</div>`;
}
function startOfflineTranslation() {
  const level = state.translation.level || state.settings.level || 'A1';
  const theme = state.translation.theme || 'life';
  const questions = shuffle(translationQuestionsFor(level, theme).map((item, index) => translationQuestionFromItem(item, index, level, theme)));
  if (!questions.length) { showToast(T.noHistory); return; }
  state.translation.active = { topicId: 'translation-practice', topicTitle: T.title, level, theme, questions, answers: {}, results: null, score: null, source: 'LOCAL', submitted: false, createdAt: Date.now() };
  saveTranslationData(); savePracticeData(); renderPractice();
}
async function startAITranslation() {
  if (!isAIConfigured()) { showToast(T.noHistory); return; }
  const level = state.translation.level || state.settings.level || 'A1';
  const theme = state.translation.theme || 'life';
  const key = translationKey(level, theme);
  const cached = state.translation.cache[key] || [];
  const avoid = cached.flatMap(set => set.questions || []).map(item => item.prompt).slice(0, 24);
  const status = $('#translationStreamStatus'); if (status) { status.classList.remove('hidden'); status.textContent = 'AI \u6b63\u5728\u751f\u6210\u7ffb\u8bd1\u9898\u2026'; }
  setLoading(true, 'AI \u6b63\u5728\u751f\u6210\u7ffb\u8bd1\u9898\u2026');
  try {
    const prompt = `You are an English teacher. Return JSON only with {"questions":[{"id":"q1","direction":"zh-en|en-zh","prompt":"","referenceAnswer":"","accepts":[""],"explanation":""}]}. Return exactly 8 questions, four zh-en and four en-zh. Level: ${level}. Theme: ${phraseThemeLabels[theme] || theme}. Avoid reusing these prompts: ${JSON.stringify(avoid)}. All explanations MUST be in Simplified Chinese.`;
    const parsed = extractJSON(await callAI([{ role: 'user', content: prompt }], 0.8));
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length < 6) throw new Error('invalid');
    const questions = shuffle(parsed.questions.slice(0, 8).map((item, index) => translationQuestionFromAI(item, index, level, theme)).filter(item => item.prompt && item.referenceAnswer));
    if (questions.length < 6) throw new Error('invalid');
    state.translation.cache[key] = [{ questions }].concat(cached).slice(0, 3);
    state.translation.active = { topicId: 'translation-practice', topicTitle: T.title, level, theme, questions, answers: {}, results: null, score: null, source: 'AI', submitted: false, createdAt: Date.now() };
    saveTranslationData();
  } catch (error) {
    startOfflineTranslation(); showToast('AI \u751f\u6210\u5931\u8d25\uff0c\u5df2\u5207\u6362\u79bb\u7ebf\u7ffb\u8bd1\u9898');
  } finally { setLoading(false); if (status) status.classList.add('hidden'); renderPractice(); }
}
function collectTranslationAnswers() {
  const session = state.translation.active;
  if (!session) return;
  document.querySelectorAll('[data-translation-answer]').forEach(input => { session.answers[input.dataset.translationAnswer] = input.value; });
}
function localTranslationResults(session) {
  return session.questions.map(question => {
    const answer = practiceNormalize(session.answers[question.id] || '');
    const refs = [question.referenceAnswer].concat(question.accepts || []).map(practiceNormalize).filter(Boolean);
    const correct = refs.some(ref => ref === answer || (answer.length > 12 && ref.includes(answer)) || (answer.length > 12 && answer.includes(ref)));
    return { id: question.id, correct, feedback: correct ? T.correct : T.ref + question.referenceAnswer + (question.explanation ? ' ' + question.explanation : '') };
  });
}
async function gradeTranslationSession(session) {
  const payload = session.questions.map(question => ({ id: question.id, direction: question.direction, prompt: question.prompt, referenceAnswer: question.referenceAnswer, accepts: question.accepts || [], studentAnswer: session.answers[question.id] || '' }));
  const parsed = extractJSON(await callAI([{ role: 'system', content: 'You are an English teacher. Grade the translations. Return JSON only: {"score":0-100,"results":[{"id":"q1","correct":true,"feedback":"Chinese explanation","correctedAnswer":"","alternatives":[""]}]}. Accept reasonable alternative translations. All feedback MUST be Simplified Chinese.' }, { role: 'user', content: JSON.stringify(payload) }], 0.2));
  if (!parsed || !Array.isArray(parsed.results)) throw new Error('invalid');
  const local = localTranslationResults(session);
  return session.questions.map(question => { const item = parsed.results.find(result => result.id === question.id); const fallback = local.find(result => result.id === question.id); return { id: question.id, correct: item && typeof item.correct === 'boolean' ? item.correct : fallback.correct, feedback: String((item && item.feedback) || fallback.feedback) }; });
}
function rememberTranslationWrong(session, question, result) {
  if (result.correct) return;
  const key = `translation:${question.id}`;
  let item = state.wrongBook.find(entry => entry.key === key);
  if (!item) { item = { id: uid(), key, topicId: 'translation-practice', topicTitle: T.title, level: session.level, type: 'translation', direction: question.direction, prompt: question.prompt, options: [], answer: undefined, referenceAnswer: question.referenceAnswer, explanation: question.explanation || '', userAnswer: session.answers[question.id] || '', feedback: result.feedback || '', wrongCount: 0, mastered: false, createdAt: Date.now(), lastWrongAt: Date.now() }; state.wrongBook.unshift(item); }
  item.userAnswer = session.answers[question.id] || ''; item.feedback = result.feedback || ''; item.wrongCount += 1; item.lastWrongAt = Date.now(); item.mastered = false;
}
async function submitTranslationPractice() {
  const session = state.translation.active;
  if (!session || session.submitted) return;
  collectTranslationAnswers();
  let results = localTranslationResults(session);
  if (isAIConfigured()) { setLoading(true, 'AI \u6b63\u5728\u6279\u6539\u7ffb\u8bd1\u2026'); try { results = await gradeTranslationSession(session); } catch (error) { showToast('AI \u6279\u6539\u5931\u8d25\uff0c\u5df2\u4f7f\u7528\u672c\u5730\u5224\u5b9a'); } finally { setLoading(false); } }
  session.results = results; session.score = Math.round(results.filter(item => item.correct).length / results.length * 100); session.submitted = true;
  session.questions.forEach((question, index) => rememberTranslationWrong(session, question, results[index]));
  const record = { id: uid(), level: session.level, theme: session.theme, score: session.score, answer: session.questions.map(q => session.answers[q.id] || '').join(' | '), createdAt: Date.now() };
  state.translation.history = [record].concat(state.translation.history || []).slice(0, 20);
  saveTranslationData(); savePracticeData(); renderPractice();
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-translation-action]');
  if (!button) return;
  const action = button.dataset.translationAction;
  if (action === 'generate') startAITranslation();
  else if (action === 'offline') startOfflineTranslation();
  else if (action === 'submit' || action === 'submit-self') submitTranslationPractice();
  else if (action === 'close') { state.translation.active = null; saveTranslationData(); savePracticeData(); renderPractice(); }
  else if (action === 'new') { state.translation.active = null; saveTranslationData(); savePracticeData(); renderPractice(); }
  else if (action === 'delete-history') { state.translation.history = (state.translation.history || []).filter(item => item.id !== button.dataset.translationId); saveTranslationData(); savePracticeData(); renderPractice(); }
});
document.addEventListener('change', event => { if (event.target && event.target.id === 'translationLevel') { state.translation.level = event.target.value; saveTranslationData(); savePracticeData(); renderPractice(); } if (event.target && event.target.id === 'translationTheme') { state.translation.theme = event.target.value; saveTranslationData(); savePracticeData(); renderPractice(); } });
const translationBaseRenderPractice = renderPractice;
renderPractice = function () {
  translationBaseRenderPractice();
  if ((state.practice.tab || 'grammar') !== 'translation') return;
  const content = $('#practiceContent');
  if (!content) return;
  content.innerHTML = renderTranslationPanel();
  $$('.practice-tab').forEach(button => button.classList.toggle('active', button.dataset.practiceTab === 'translation'));
  if (typeof window.wordifyContent === 'function') window.wordifyContent(content);
};
window.renderTranslationPanel = renderTranslationPanel;
window.startAITranslation = startAITranslation;
window.startOfflineTranslation = startOfflineTranslation;
function translationQuestionFromItem(item, index, level, theme) {
  return { id: `translation-local-${item.id}-${index}`, direction: item.type, prompt: item.prompt, referenceAnswer: item.referenceAnswer, accepts: item.accepts || [], explanation: item.explanation || '', type: 'translation', topicId: 'translation-practice', topicTitle: T.title, level, theme };
}
function translationQuestionFromAI(item, index, level, theme) {
  return { id: item.id || `translation-ai-${Date.now()}-${index}`, direction: item.direction === 'en-zh' ? 'en-zh' : 'zh-en', prompt: item.prompt, referenceAnswer: item.referenceAnswer || (item.accepts || [])[0] || '', accepts: Array.isArray(item.accepts) ? item.accepts : [], explanation: item.explanation || '', type: 'translation', topicId: 'translation-practice', topicTitle: T.title, level, theme };
}
