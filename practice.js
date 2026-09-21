'use strict';
state.practice = state.practice && typeof state.practice === 'object' ? state.practice : readJSON(STORAGE.practice, { tab: 'grammar', cache: {}, active: null, filter: 'all' });
state.practice.cache = state.practice.cache || {};
state.practice.tab = state.practice.tab || 'grammar';
state.wrongBook = Array.isArray(state.wrongBook) ? state.wrongBook : readJSON(STORAGE.wrongBook, []);
state.writing = state.writing && typeof state.writing === 'object' ? state.writing : readJSON(STORAGE.writing, { draft: null, history: [] });
const practiceThemes = { campus: '校园学习', life: '日常生活', technology: '科技网络', society: '社会热点', people: '人物故事', opinion: '观点表达' };
const writingLevelRules = { A1: '3–5 个简单句，约 30–50 词', A2: '5–8 句，约 50–80 词', B1: '一段完整短文，约 80–120 词', CET4: '一篇完整作文，约 120–180 词' };
function savePracticeData() { writeJSON(STORAGE.practice, state.practice); writeJSON(STORAGE.wrongBook, state.wrongBook); writeJSON(STORAGE.writing, state.writing); }
function practiceTopic(id) { return (typeof grammarTopics !== 'undefined' ? grammarTopics : []).find(item => item.id === id) || findCourse(id); }
function practiceNormalize(value) { return normalizeAnswer(value); }
function practiceQuestionsFromTopic(topic) {
  const questions = [];
  topic.mcq.forEach((item, index) => questions.push({ id: `${topic.id}-m${index}`, type: 'mcq', prompt: item.q, options: item.options, answer: item.answer, referenceAnswer: item.options[item.answer], explanation: item.explanation }));
  topic.fill.forEach((item, index) => questions.push({ id: `${topic.id}-f${index}`, type: 'fill', prompt: item.q, referenceAnswer: item.answer, explanation: item.explanation }));
  topic.translations.forEach((item, index) => questions.push({ id: `${topic.id}-t${index}`, type: 'translation', prompt: item.zh, referenceAnswer: item.answer, explanation: item.explanation }));
  return questions;
}
function practiceQuestionTypeLabel(type) { return { mcq: '选择题', fill: '填空题', correction: '句子改错', translation: '翻译题' }[type] || '练习题'; }
function practiceQuestionHtml(question, index, session) {
  const value = session && session.answers ? session.answers[question.id] : '';
  const result = session && session.results ? session.results.find(item => item.id === question.id) : null;
  let input = '';
  if (question.type === 'mcq') {
    input = `<div class="option-list">${(question.options || []).map((option, optionIndex) => `<label class="option-button ${value !== '' && Number(value) === optionIndex ? 'selected' : ''}"><input type="radio" name="practice-mcq-${index}" value="${optionIndex}" data-practice-answer="${question.id}" ${value !== '' && Number(value) === optionIndex ? 'checked' : ''} ${session && session.submitted ? 'disabled' : ''}>${escapeHtml(option)}</label>`).join('')}</div>`;
  } else if (question.type === 'translation' || question.type === 'correction') {
    input = `<textarea class="translation-input" data-practice-answer="${question.id}" ${session && session.submitted ? 'disabled' : ''} placeholder="写下你的答案">${escapeHtml(value || '')}</textarea>`;
  } else {
    input = `<input class="fill-input" data-practice-answer="${question.id}" value="${escapeHtml(value || '')}" ${session && session.submitted ? 'disabled' : ''} placeholder="填写答案">`;
  }
  const feedback = result ? `<div class="answer-feedback ${result.correct ? 'ok' : 'no'}">${escapeHtml(result.feedback || (result.correct ? '回答正确。' : `参考答案：${question.referenceAnswer || ''}`))}</div>` : '';
  return `<div class="practice-question" data-practice-question="${question.id}"><span class="question-label">${practiceQuestionTypeLabel(question.type)} ${index + 1}</span><div class="question-text">${escapeHtml(question.prompt)}</div>${input}${feedback}</div>`;
}
function practiceSessionHtml(session) {
  const total = session.questions.length;
  const correct = session.results ? session.results.filter(item => item.correct).length : 0;
  return `<div class="practice-session-head"><div><span class="eyebrow">${session.source === 'AI' ? 'AI 专项练习' : '离线基础练习'}</span><h2>${escapeHtml(session.topicTitle)}</h2><p>${escapeHtml(session.level)} · 共 ${total} 题</p></div><button class="secondary-button" type="button" data-practice-action="close-session">返回</button></div><div class="practice-question-list">${session.questions.map((question, index) => practiceQuestionHtml(question, index, session)).join('')}</div>${session.submitted ? `<div class="practice-result show"><span class="eyebrow">本次结果</span><strong>${session.score}%</strong><p>${correct}/${total} 题正确。错题已自动加入错题本。</p></div>` : ''}<div class="form-actions"><button class="primary-button" type="button" data-practice-action="${session.submitted ? 'close-session' : 'submit-grammar'}">${session.submitted ? '完成本次练习' : (isAIConfigured() ? '提交并交给 AI 批改' : '提交离线判定')}</button>${session.submitted ? '<button class="secondary-button" type="button" data-practice-action="new-grammar">再来一组</button>' : ''}</div>`;
}
function renderGrammarPractice() {
  const session = state.practice.active;
  if (session) return `<div class="practice-panel">${practiceSessionHtml(session)}</div>`;
  const topics = typeof grammarTopics !== 'undefined' ? grammarTopics : [];
  const selected = state.practice.topicId || (topics[0] && topics[0].id) || '';
  const level = state.practice.level || state.settings.level || 'A1';
  const topic = topics.find(item => item.id === selected) || topics[0];
  return `<div class="practice-panel grammar-practice-panel"><div class="practice-panel-intro"><span class="eyebrow">GRAMMAR DRILL</span><h2>语法专项练习</h2><p>选择微专题和难度。配置 AI 时生成 8 道混合题，未配置时使用每专题自带的 5 道离线基础题。</p></div><div class="practice-config-row"><label>语法专题<select id="practiceTopic">${topics.map(item => `<option value="${item.id}" ${item.id === selected ? 'selected' : ''}>${escapeHtml(item.group)} · ${escapeHtml(item.title)}</option>`).join('')}</select></label><label>练习难度<select id="practiceLevel">${LEVEL_ORDER.map(item => `<option value="${item}" ${item === level ? 'selected' : ''}>${LEVEL_LABELS[item]}</option>`).join('')}</select></label><button class="primary-button" type="button" data-practice-action="start-grammar" ${topics.length ? '' : 'disabled'}>开始练习</button></div>${topic ? `<div class="practice-topic-preview"><strong>${escapeHtml(topic.title)}</strong><span>${escapeHtml(topic.summary)}</span></div>` : ''}<div class="practice-note">AI 题型固定为 2 道选择、2 道填空、2 道改错、2 道翻译；离线模式为 2 道选择、2 道改错、1 道翻译。</div></div>`;
}
function validPracticeQuestions(value) {
  if (!value || !Array.isArray(value.questions) || value.questions.length !== 8) return false;
  const counts = { mcq: 0, fill: 0, correction: 0, translation: 0 };
  return value.questions.every(question => {
    if (!question || !['mcq', 'fill', 'correction', 'translation'].includes(question.type)) return false;
    counts[question.type] += 1;
    if (question.type === 'mcq' && (!Array.isArray(question.options) || question.options.length < 2 || typeof question.answer !== 'number')) return false;
    return Boolean(question.id && question.prompt && (question.referenceAnswer || question.answer !== undefined));
  }) && counts.mcq === 2 && counts.fill === 2 && counts.correction === 2 && counts.translation === 2;
}
async function generateAIQuestions(topic, level) {
  const messages = [
    { role: 'system', content: '你是英语语法老师。只输出 JSON，不要 Markdown。必须返回 8 道题，题型数量严格为 mcq 2、fill 2、correction 2、translation 2。' },
    { role: 'user', content: `专题：${topic.title}。等级：${level}。知识点：${topic.summary}。规则：${topic.rules.map(item => item[1]).join('；')}。JSON 结构必须为 {"questions":[{"id":"q1","type":"mcq|fill|correction|translation","prompt":"题目","options":["A","B","C"],"answer":0,"referenceAnswer":"参考答案","explanation":"解析"}]}。选择题必须有 options 和数字 answer。` }
  ];
  const parsed = extractJSON(await callAI(messages, 0.45));
  if (!validPracticeQuestions(parsed)) throw new Error('AI 题目格式不符合要求');
  return parsed.questions.map(item => Object.assign({}, item, { id: item.id || uid(), referenceAnswer: item.referenceAnswer || (item.options && item.options[item.answer]) || '' }));
}
function setGrammarSession(topic, level, questions, source) {
  state.practice.active = { topicId: topic.id, topicTitle: topic.title, level, questions, answers: {}, results: null, score: null, source, submitted: false, createdAt: Date.now() };
  state.practice.topicId = topic.id;
  state.practice.level = level;
  savePracticeData();
}
async function startGrammarPractice() {
  const topicId = $('#practiceTopic') ? $('#practiceTopic').value : state.practice.topicId;
  const level = $('#practiceLevel') ? $('#practiceLevel').value : state.settings.level;
  const topic = practiceTopic(topicId);
  if (!topic) return;
  if (isAIConfigured()) {
    setLoading(true, 'AI 正在生成语法专项题…');
    try {
      const key = `${topic.id}:${level}`;
      const cached = state.practice.cache[key] || [];
      const questions = cached.length ? cached[0] : await generateAIQuestions(topic, level);
      if (!cached.length) state.practice.cache[key] = [questions].concat(cached).slice(0, 3);
      setGrammarSession(topic, level, questions, cached.length ? 'CACHE' : 'AI');
    } catch (error) {
      setGrammarSession(topic, level, practiceQuestionsFromTopic(topic), 'LOCAL');
      showToast('AI 生成失败，已切换到离线基础题');
    } finally { setLoading(false); }
  } else {
    setGrammarSession(topic, level, practiceQuestionsFromTopic(topic), 'LOCAL');
  }
  renderPractice();
}
function collectGrammarAnswers() {
  const session = state.practice.active;
  if (!session) return;
  document.querySelectorAll('[data-practice-answer]').forEach(input => { session.answers[input.dataset.practiceAnswer] = input.value; });
  document.querySelectorAll('[data-practice-question]').forEach(block => {
    const checked = block.querySelector('input[type="radio"]:checked');
    if (checked) session.answers[block.dataset.practiceQuestion] = checked.value;
  });
}
function localGrammarResults(session) {
  return session.questions.map(question => {
    const answer = session.answers[question.id];
    const correct = question.type === 'mcq' ? Number(answer) === Number(question.answer) : practiceNormalize(answer) === practiceNormalize(question.referenceAnswer);
    return { id: question.id, correct, feedback: correct ? '回答正确。' : `参考答案：${question.referenceAnswer || ''} ${question.explanation || ''}`.trim() };
  });
}
async function gradeGrammarSession(session) {
  const payload = session.questions.map(question => ({ id: question.id, type: question.type, prompt: question.prompt, referenceAnswer: question.referenceAnswer, studentAnswer: session.answers[question.id] || '' }));
  const messages = [
    { role: 'system', content: '你是英语语法老师。只输出 JSON，不要 Markdown。逐题批改，合理答案应判对。结构为 {"score":0-100,"results":[{"id":"q1","correct":true,"feedback":"原因和修改建议"}]}。' },
    { role: 'user', content: JSON.stringify(payload) }
  ];
  const parsed = extractJSON(await callAI(messages, 0.2));
  if (!parsed || !Array.isArray(parsed.results)) throw new Error('AI 批改格式错误');
  return session.questions.map(question => {
    const item = parsed.results.find(result => result.id === question.id) || {};
    return { id: question.id, correct: item.correct === true || String(item.correct).toLowerCase() === 'true', feedback: String(item.feedback || (item.correct ? '回答正确。' : `参考答案：${question.referenceAnswer || ''}`)) };
  });
}
function rememberWrongQuestion(session, question, result) {
  if (result.correct) return;
  const key = `${session.topicId}:${question.id}`;
  let item = state.wrongBook.find(entry => entry.key === key);
  if (!item) {
    item = { id: uid(), key, topicId: session.topicId, topicTitle: session.topicTitle, level: session.level, type: question.type, prompt: question.prompt, options: question.options || [], answer: question.answer, referenceAnswer: question.referenceAnswer || '', explanation: question.explanation || '', userAnswer: session.answers[question.id] || '', feedback: result.feedback || '', wrongCount: 0, mastered: false, createdAt: Date.now(), lastWrongAt: Date.now() };
    state.wrongBook.unshift(item);
  }
  item.userAnswer = session.answers[question.id] || '';
  item.feedback = result.feedback || '';
  item.wrongCount += 1;
  item.lastWrongAt = Date.now();
  item.mastered = false;
}
async function submitGrammarPractice() {
  const session = state.practice.active;
  if (!session) return;
  collectGrammarAnswers();
  let results = localGrammarResults(session);
  if (isAIConfigured()) {
    setLoading(true, 'AI 正在批改语法专项…');
    try { results = await gradeGrammarSession(session); } catch (error) { showToast('AI 批改失败，已使用离线判定'); }
    finally { setLoading(false); }
  }
  session.results = results;
  session.score = Math.round(results.filter(item => item.correct).length / results.length * 100);
  session.submitted = true;
  session.questions.forEach((question, index) => rememberWrongQuestion(session, question, results[index]));
  savePracticeData();
  renderPractice();
}
function renderWrongBook() {
  const entries = state.wrongBook.filter(item => !item.mastered);
  return `<div class="practice-panel"><div class="practice-panel-intro"><span class="eyebrow">MISTAKE BOOK</span><h2>错题本</h2><p>做错的语法题会自动收录；重做答对后仍保留，直到你标记为“已掌握”。</p></div>${entries.length ? `<div class="wrong-book-list">${entries.map(item => `<article class="wrong-book-item"><div class="wrong-book-top"><span>${escapeHtml(item.topicTitle)} · ${escapeHtml(item.level)}</span><strong>错误 ${item.wrongCount} 次</strong></div><p>${escapeHtml(item.prompt)}</p><small>你的答案：${escapeHtml(item.userAnswer || '未填写')} · 参考答案：${escapeHtml(item.referenceAnswer || '')}</small><div class="wrong-book-actions"><button class="secondary-button small" type="button" data-practice-action="redo-wrong" data-wrong-id="${item.id}">重做</button><button class="primary-button small" type="button" data-practice-action="master-wrong" data-wrong-id="${item.id}">标记已掌握</button><button class="text-button" type="button" data-practice-action="delete-wrong" data-wrong-id="${item.id}">删除</button></div></article>`).join('')}</div>` : '<div class="empty-state"><h2>还没有待掌握错题</h2><p>完成语法专项后，做错的题会自动出现在这里。</p></div>'}</div>`;
}
function markWrongMastered(id) { const item=state.wrongBook.find(entry=>entry.id===id); if(item){ item.mastered=true; savePracticeData(); renderPractice(); showToast('已标记为掌握'); } }
function deleteWrong(id) { state.wrongBook=state.wrongBook.filter(entry=>entry.id!==id); savePracticeData(); renderPractice(); }
function redoWrong(id) {
  const item=state.wrongBook.find(entry=>entry.id===id); if(!item) return;
  const question={id:item.id,type:item.type,prompt:item.prompt,options:item.options,answer:item.answer == null ? 0 : item.answer,referenceAnswer:item.referenceAnswer,explanation:item.explanation};
  state.practice.active={topicId:item.topicId,topicTitle:item.topicTitle,level:item.level,questions:[question],answers:{},results:null,score:null,source:'WRONG',submitted:false,createdAt:Date.now()};
  state.practice.tab='grammar'; savePracticeData(); renderPractice();
}
function localWritingTask(level, theme) {
  const themeName = practiceThemes[theme] || '日常生活';
  const models = {
    A1: `I am a student. I like ${themeName} in my free time. It makes me happy. I often share it with my friends.`,
    A2: `My favorite topic is ${themeName}. It is important in my daily life. I usually learn about it on weekends. I share my ideas with my family and friends. This habit helps me understand the world better.`,
    B1: `In recent years, ${themeName} has become an important part of our daily life. It brings people convenience, but it also creates new challenges. In my opinion, we should use it in a responsible way and keep learning from real experiences.`,
    CET4: `In recent years, ${themeName} has attracted increasing attention in our society. While it offers people greater convenience and opportunities, it may also bring about problems if it is used without proper judgment. From my perspective, we should take a balanced attitude, make full use of its advantages, and avoid becoming overly dependent on it.`
  };
  return { id: uid(), level, theme, promptTitle: `${themeName}主题写作`, promptZh: `请围绕“${themeName}”写一段英语短文，表达你的观点或个人经历。`, requirements: writingLevelRules[level], outline: ['开头：引出主题', '主体：说明观点或经历', '结尾：总结或建议'], modelEssay: models[level], usefulPhrases: ['From my perspective, ...', 'It is important to ...', 'In recent years, ...', 'This helps me ...', 'In conclusion, ...'] };
}
function renderWritingPanel() {
  const draft = state.writing.draft;
  const level = state.writing.level || state.settings.level || 'A1';
  const theme = state.writing.theme || 'life';
  return `<div class="practice-panel writing-practice-panel"><div class="practice-panel-intro"><span class="eyebrow">WRITING LAB</span><h2>写作练习</h2><p>按当前等级生成题目；提交后显示评分、修改理由、润色全文、范文和高分短句。</p></div><div class="practice-config-row"><label>写作难度<select id="writingLevel">${LEVEL_ORDER.map(item => `<option value="${item}" ${item === level ? 'selected' : ''}>${LEVEL_LABELS[item]}</option>`).join('')}</select></label><label>写作主题<select id="writingTheme">${Object.keys(practiceThemes).map(item => `<option value="${item}" ${item === theme ? 'selected' : ''}>${practiceThemes[item]}</option>`).join('')}</select></label><button class="primary-button" type="button" data-practice-action="start-writing">生成题目</button></div>${draft ? `<div class="writing-task-card"><h3>${escapeHtml(draft.task.promptTitle)}</h3><p>${escapeHtml(draft.task.promptZh)}</p><small>${escapeHtml(draft.task.requirements)}</small><ol>${draft.task.outline.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol><textarea id="writingDraft" class="writing-input" placeholder="开始写作…">${escapeHtml(draft.answer || '')}</textarea><div class="form-actions"><button class="primary-button" type="button" data-practice-action="submit-writing">提交并批改</button><button class="secondary-button" type="button" data-practice-action="clear-writing-draft">清空草稿</button></div></div>` : '<div class="empty-state"><h2>生成一道写作题</h2><p>选择难度和主题后开始写作。未配置 AI 时也会提供本地范文和短句。</p></div>'}${state.writing.lastRecord ? renderWritingFeedback(state.writing.lastRecord) : ''}${state.writing.history && state.writing.history.length ? `<div class="writing-history"><h3>最近写作</h3>${state.writing.history.slice(0, 5).map(item => `<article><strong>${escapeHtml(item.promptTitle)}</strong><small>${escapeHtml(item.level)} · ${item.score == null ? '自评' : item.score + ' 分'}</small><p>${escapeHtml((item.answer || '').slice(0, 120))}</p><button class="text-button" type="button" data-practice-action="delete-writing" data-writing-id="${item.id}">删除</button></article>`).join('')}</div>` : ''}</div>`;
}
async function startWritingPractice() {
  const level = $('#writingLevel') ? $('#writingLevel').value : state.settings.level;
  const theme = $('#writingTheme') ? $('#writingTheme').value : 'life';
  let task = localWritingTask(level, theme);
  if (isAIConfigured()) {
    setLoading(true, 'AI 正在生成写作题目…');
    try {
      const parsed = extractJSON(await callAI([{ role: 'system', content: '你是英语写作老师。只输出 JSON，不要 Markdown。结构为 {"promptTitle":"","promptZh":"","requirements":"","outline":[""],"usefulPhrases":[""]}。' }, { role: 'user', content: `等级：${level}。主题：${practiceThemes[theme]}。要求：${writingLevelRules[level]}。请生成一个清晰、适合中学生的写作题目。` }], 0.6));
      if (parsed && parsed.promptTitle) { parsed.outline = Array.isArray(parsed.outline) ? parsed.outline : task.outline; parsed.usefulPhrases = Array.isArray(parsed.usefulPhrases) ? parsed.usefulPhrases : task.usefulPhrases; task = Object.assign(task, parsed); }
    } catch (error) { showToast('AI 出题失败，已使用本地题目'); }
    finally { setLoading(false); }
  }
  state.writing.level = level; state.writing.theme = theme; state.writing.lastRecord = null; state.writing.draft = { task, answer: '', createdAt: Date.now() };
  savePracticeData(); renderPractice();
}
async function submitWritingPractice() {
  const draft = state.writing.draft;
  if (!draft) return;
  draft.answer = $('#writingDraft') ? $('#writingDraft').value : draft.answer;
  if (!draft.answer.trim()) { showToast('请先完成写作内容'); return; }
  let feedback = { score: null, dimensions: {}, errors: [], polishedEssay: draft.answer, modelEssay: draft.task.modelEssay, usefulPhrases: draft.task.usefulPhrases || [], feedback: '已完成本地保存，请对照范文自评语法、结构和词汇。' };
  if (isAIConfigured()) {
    setLoading(true, 'AI 正在批改写作…');
    try {
      const parsed = extractJSON(await callAI([{ role: 'system', content: '你是英语写作老师。只输出 JSON，不要 Markdown。结构为 {"score":0-100,"dimensions":{"content":0-25,"organization":0-25,"grammar":0-25,"vocabulary":0-25},"errors":[{"original":"","corrected":"","reason":""}],"polishedEssay":"","modelEssay":"","usefulPhrases":[""],"feedback":""}。' }, { role: 'user', content: `题目：${draft.task.promptZh}\n要求：${draft.task.requirements}\n学生作文：${draft.answer}` }], 0.3));
      if (parsed && typeof parsed.score === 'number') feedback = parsed;
    } catch (error) { showToast('AI 批改失败，已提供本地范文和自评提示'); }
    finally { setLoading(false); }
  }
  const record = { id: uid(), level: draft.task.level, theme: draft.task.theme, promptTitle: draft.task.promptTitle, promptZh: draft.task.promptZh, answer: draft.answer, feedback, createdAt: Date.now(), score: feedback.score };
  state.writing.history = [record].concat(state.writing.history || []).slice(0, 20);
  state.writing.draft = null;
  state.writing.lastRecord = record;
  savePracticeData(); renderPractice();
}
function renderWritingFeedback(record) {
  if (!record) return '';
  const f = record.feedback || {};
  const errors = (f.errors || []).map(item => `<li><s>${escapeHtml(item.original || '')}</s> → <b>${escapeHtml(item.corrected || '')}</b>：${escapeHtml(item.reason || '')}</li>`).join('');
  return `<div class="writing-feedback"><div class="practice-result show"><span class="eyebrow">写作结果</span><strong>${f.score == null ? '自评' : f.score + ' 分'}</strong><p>${escapeHtml(f.feedback || '请对照范文检查语法、结构和词汇。')}</p></div>${errors ? `<h3>错误与修改</h3><ul>${errors}</ul>` : ''}<h3>润色后的文章</h3><p class="essay-text">${escapeHtml(f.polishedEssay || record.answer)}</p><h3>参考范文</h3><p class="essay-text">${escapeHtml(f.modelEssay || '')}</p><h3>推荐短句</h3><div class="phrase-list">${(f.usefulPhrases || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div></div>`;
}
function saveWritingDraft() { if (state.writing.draft && $('#writingDraft')) { state.writing.draft.answer = $('#writingDraft').value; writeJSON(STORAGE.writing, state.writing); } }
function renderPractice() {
  const summary = $('#practiceSummary');
  const content = $('#practiceContent');
  if (!summary || !content) return;
  const tab = state.practice.tab || 'grammar';
  const wrongCount = (state.wrongBook || []).filter(item => !item.mastered).length;
  summary.innerHTML = `<strong>${typeof grammarTopics !== 'undefined' ? grammarTopics.length : 0}</strong><span>语法微专题</span><strong>${wrongCount}</strong><span>待掌握错题</span>`;
  $$('.practice-tab').forEach(button => button.classList.toggle('active', button.dataset.practiceTab === tab));
  content.innerHTML = tab === 'wrong' ? renderWrongBook() : (tab === 'writing' ? renderWritingPanel() : renderGrammarPractice());
}
document.addEventListener('click', event => {
  const nav = event.target.closest('[data-view="practice"]');
  if (nav) setTimeout(renderPractice, 0);
  const tab = event.target.closest('[data-practice-tab]');
  if (tab) { state.practice.tab = tab.dataset.practiceTab; savePracticeData(); renderPractice(); return; }
  const action = event.target.closest('[data-practice-action]');
  if (!action) return;
  const name = action.dataset.practiceAction;
  if (name === 'start-grammar') startGrammarPractice();
  else if (name === 'submit-grammar') submitGrammarPractice();
  else if (name === 'close-session' || name === 'new-grammar') { state.practice.active = null; savePracticeData(); renderPractice(); }
  else if (name === 'redo-wrong') redoWrong(action.dataset.wrongId);
  else if (name === 'master-wrong') markWrongMastered(action.dataset.wrongId);
  else if (name === 'delete-wrong') deleteWrong(action.dataset.wrongId);
  else if (name === 'start-writing') startWritingPractice();
  else if (name === 'submit-writing') submitWritingPractice();
  else if (name === 'clear-writing-draft') { if (state.writing.draft) { state.writing.draft.answer = ''; savePracticeData(); renderPractice(); } }
  else if (name === 'delete-writing') { state.writing.history = (state.writing.history || []).filter(item => item.id !== action.dataset.writingId); savePracticeData(); renderPractice(); }
});
document.addEventListener('input', event => { if (event.target && event.target.id === 'writingDraft') saveWritingDraft(); });
document.addEventListener('change', event => {
  if (event.target && ['data-level', 'mobileLevelSelect', 'articleLevel'].some(key => event.target.matches && event.target.matches(`[${key}]`))) setTimeout(renderPractice, 0);
});
renderPractice();
