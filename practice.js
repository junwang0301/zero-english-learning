'use strict';
state.practice = state.practice && typeof state.practice === 'object' ? state.practice : readJSON(STORAGE.practice, { tab: 'grammar', cache: {}, active: null, filter: 'all' });
state.practice.cache = state.practice.cache || {};
state.practice.tab = state.practice.tab || 'grammar';
state.wrongBook = Array.isArray(state.wrongBook) ? state.wrongBook : readJSON(STORAGE.wrongBook, []);
state.writing = state.writing && typeof state.writing === 'object' ? state.writing : readJSON(STORAGE.writing, { draft: null, history: [] });
state.memory = state.memory && typeof state.memory === 'object' ? state.memory : readJSON(STORAGE.memory, { entries: [] });
state.memory.entries = Array.isArray(state.memory.entries) ? state.memory.entries : [];
const practiceThemes = { campus: '校园学习', life: '日常生活', technology: '科技网络', society: '社会热点', people: '人物故事', opinion: '观点表达' };
const writingLevelRules = { A1: '3–5 个简单句，约 30–50 词', A2: '5–8 句，约 50–80 词', B1: '一段完整短文，约 80–120 词', CET4: '一篇完整作文，约 120–180 词' };
function savePracticeData() { writeJSON(STORAGE.practice, state.practice); writeJSON(STORAGE.wrongBook, state.wrongBook); writeJSON(STORAGE.writing, state.writing); writeJSON(STORAGE.memory, state.memory); }
function setPracticeButtonsBusy(busy) {
  $$('[data-practice-action="start-grammar"], [data-practice-action="refresh-grammar"], [data-practice-action="start-writing"]').forEach(button => { button.disabled = busy; });
}
function practiceStreamStatus(text, chars) {
  const content = $('#practiceContent');
  if (!content) return;
  let status = $('#practiceStreamStatus');
  if (!status) {
    status = document.createElement('div');
    status.id = 'practiceStreamStatus';
    status.className = 'ai-stream-status';
    status.setAttribute('role', 'status');
    const anchor = content.querySelector('.practice-config-row');
    if (anchor) anchor.insertAdjacentElement('afterend', status); else content.appendChild(status);
  }
  status.textContent = String(text || '') + (chars ? ' \u5df2\u63a5\u6536 ' + chars + ' \u5b57' : '');
}

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
  return `<div class="practice-session-head"><div><span class="eyebrow">${session.source === 'AI' ? 'AI 专项练习' : '离线基础练习'}</span><h2>${escapeHtml(session.topicTitle)}</h2><p>${escapeHtml(session.level)} · 共 ${total} 题</p></div><button class="secondary-button" type="button" data-practice-action="close-session">返回</button></div><div class="practice-question-list">${session.questions.map((question, index) => practiceQuestionHtml(question, index, session)).join('')}</div>${session.submitted ? `<div class="practice-result show"><span class="eyebrow">本次结果</span><strong>${session.score}%</strong><p>${correct}/${total} 题正确。错题已自动加入错题本。</p></div>` : ''}<div class="form-actions"><button class="primary-button" type="button" data-practice-action="${session.submitted ? 'close-session' : 'submit-grammar'}">${session.submitted ? '完成本次练习' : (isAIConfigured() ? '提交并交给 AI 批改' : '提交离线判定')}</button>${session.submitted ? '<button class="secondary-button" type="button" data-practice-action="refresh-grammar">换一组新题</button>' : ''}</div>`;
}
function renderGrammarPractice() {
  const session = state.practice.active;
  if (session) return `<div class="practice-panel">${practiceSessionHtml(session)}</div>`;
  const topics = typeof grammarTopics !== 'undefined' ? grammarTopics : [];
  const selected = state.practice.topicId || (topics[0] && topics[0].id) || '';
  const level = state.practice.level || state.settings.level || 'A1';
  const topic = topics.find(item => item.id === selected) || topics[0];
  return `<div class="practice-panel grammar-practice-panel"><div class="practice-panel-intro"><span class="eyebrow">GRAMMAR DRILL</span><h2>语法专项练习</h2><p>选择微专题和难度。配置 AI 时生成 8 道混合题，未配置时使用每专题自带的 5 道离线基础题。</p></div><div class="practice-note"><strong>题型说明：</strong>配置 AI 时生成 8 道混合题；未配置时使用 5 道离线基础题，可以随时提交。</div><div class="practice-config-row"><label>语法专题<select id="practiceTopic">${topics.map(item => `<option value="${item.id}" ${item.id === selected ? 'selected' : ''}>${escapeHtml(item.group)} · ${escapeHtml(item.title)}</option>`).join('')}</select></label><label>练习难度<select id="practiceLevel">${LEVEL_ORDER.map(item => `<option value="${item}" ${item === level ? 'selected' : ''}>${LEVEL_LABELS[item]}</option>`).join('')}</select></label><button class="primary-button" type="button" data-practice-action="start-grammar" ${topics.length ? '' : 'disabled'}>${isAIConfigured() ? 'AI 生成 8 题' : '开始离线 5 题'}</button></div>${topic ? `<div class="practice-topic-preview"><strong>${escapeHtml(topic.title)}</strong><span>${escapeHtml(topic.summary)}</span></div>` : ''}<div class="practice-note">AI 题型固定为 2 道选择、2 道填空、2 道改错、2 道翻译；离线模式为 2 道选择、2 道改错、1 道翻译。</div></div>`;
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
async function generateAIQuestions(topic, level, nonce = 0) {
  const key = `${topic.id}:${level}`;
  const avoid = (state.practice.cache[key] || []).flatMap(set => (set || []).map(question => question.prompt)).slice(0, 24);
  const messages = [
    { role: 'system', content: 'You are an English grammar teacher. Return JSON only, without Markdown. Return exactly 8 questions with counts mcq 2, fill 2, correction 2, translation 2. All explanation fields MUST be in Simplified Chinese. Keep questions, options, and answers in English.' },
    { role: 'user', content: `Topic: ${topic.title}. Level: ${level}. Round marker: ${nonce || 'first'}. Summary: ${topic.summary}. Rules: ${topic.rules.map(item => item[1]).join('; ')}. Generate questions different from the previous round. Avoid repeating these questions: ${JSON.stringify(avoid)}. JSON structure: {"questions":[{"id":"q1","type":"mcq|fill|correction|translation","prompt":"question","options":["A","B","C"],"answer":0,"referenceAnswer":"reference answer","explanation":"Chinese explanation"}]}. Multiple-choice questions must include options and a numeric answer.` }
  ];
  let content = '';
  let lastChars = 0;
  let streamStarted = false;
  try {
    content = await callAIStream(messages, 0.8, (delta, accumulated) => {
      if (!streamStarted) { streamStarted = true; setLoading(false); }
      const count = accumulated.length;
      if (count - lastChars >= 16) { lastChars = count; practiceStreamStatus('AI \u6b63\u5728\u751f\u6210 8 \u9053\u9898\u2026', count); }
    });
  } catch (error) {
    setLoading(false);
    practiceStreamStatus('\u5f53\u524d\u670d\u52a1\u4e0d\u652f\u6301\u6d41\u5f0f\u8f93\u51fa\uff0c\u6b63\u5728\u5207\u6362\u666e\u901a\u6a21\u5f0f\u2026');
    content = await callAI(messages, 0.8);
  }
  const parsed = extractJSON(content);
  if (!validPracticeQuestions(parsed)) throw new Error('Invalid AI question format');
  return shuffle(parsed.questions.map(item => Object.assign({}, item, { id: item.id || uid(), referenceAnswer: item.referenceAnswer || (item.options && item.options[item.answer]) || '' })));
}
function setGrammarSession(topic, level, questions, source) {
  state.practice.active = { topicId: topic.id, topicTitle: topic.title, level, questions, answers: {}, results: null, score: null, source, submitted: false, createdAt: Date.now() };
  state.practice.topicId = topic.id;
  state.practice.level = level;
  savePracticeData();
}
async function startGrammarPractice(forceNew = false) {
  const topicId = $('#practiceTopic') ? $('#practiceTopic').value : state.practice.topicId;
  const level = $('#practiceLevel') ? $('#practiceLevel').value : (state.practice.level || state.settings.level || 'A1');
  const topic = practiceTopic(topicId);
  if (!topic) return;
  if (isAIConfigured()) {
    setPracticeButtonsBusy(true);
    setLoading(true, forceNew ? 'AI \u6b63\u5728\u8fde\u63a5\uff0c\u51c6\u5907\u66f4\u6362\u9898\u76ee\u2026' : 'AI \u6b63\u5728\u8fde\u63a5\uff0c\u51c6\u5907\u751f\u6210\u9898\u76ee\u2026');
    practiceStreamStatus(forceNew ? 'AI \u6b63\u5728\u751f\u6210\u4e00\u7ec4\u65b0\u9898\u2026' : 'AI \u6b63\u5728\u751f\u6210\u8bed\u6cd5\u4e13\u9879\u9898\u2026');
    const key = `${topic.id}:${level}`;
    const cached = state.practice.cache[key] || [];
    try {
      const questions = await generateAIQuestions(topic, level, forceNew ? Date.now() : 0);
      state.practice.cache[key] = [questions].concat(forceNew ? cached : []).slice(0, 3);
      setGrammarSession(topic, level, questions, 'AI');
    } catch (error) {
      if (cached.length) setGrammarSession(topic, level, cached[0], 'CACHE');
      else setGrammarSession(topic, level, shuffle(practiceQuestionsFromTopic(topic)), 'LOCAL');
      showToast(forceNew ? 'AI ????????????' : 'AI ????????????????');
    } finally { setLoading(false); setPracticeButtonsBusy(false); }
  } else {
    setGrammarSession(topic, level, shuffle(practiceQuestionsFromTopic(topic)), 'LOCAL');
  }
  renderPractice();
}
function collectGrammarAnswers() {
  const session = state.practice.active;
  if (!session) return;
  document.querySelectorAll('[data-practice-answer]').forEach(input => { if (input.type === 'radio') return; session.answers[input.dataset.practiceAnswer] = input.value; });
  document.querySelectorAll('[data-practice-question]').forEach(block => {
    const checked = block.querySelector('input[type="radio"]:checked');
    if (checked) session.answers[block.dataset.practiceQuestion] = checked.value;
  });
}
function localGrammarResults(session) {
  return session.questions.map(question => {
    const answer = session.answers[question.id];
    const correct = question.type === 'mcq' ? Number(answer) === Number(question.answer) : practiceNormalize(answer) === practiceNormalize(question.referenceAnswer);
    return { id: question.id, correct, feedback: localFeedbackText(correct, question.referenceAnswer, question.explanation) };
  });
}
async function gradeGrammarSession(session) {
  const payload = session.questions.map(question => {
    const rawAnswer = session.answers[question.id];
    const optionIndex = Number(rawAnswer);
    const selectedOption = question.type === 'mcq' && Array.isArray(question.options) && rawAnswer !== '' && Number.isInteger(optionIndex) ? question.options[optionIndex] : '';
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      options: Array.isArray(question.options) ? question.options : [],
      referenceAnswer: question.referenceAnswer,
      studentAnswer: question.type === 'mcq' ? (selectedOption || rawAnswer || '') : (rawAnswer || '')
    };
  });
  const messages = [
    { role: 'system', content: 'You are an English grammar teacher. Return JSON only, without Markdown. Grade each answer. For multiple-choice questions, use options and studentAnswer; studentAnswer is already resolved to the selected option text. All feedback strings MUST be in Simplified Chinese. Keep English only in question text, answers, and corrected English examples. Return exactly {"score":0-100,"results":[{"id":"q1","correct":true,"feedback":"..."}]}.' },
    { role: 'user', content: JSON.stringify(payload) }
  ];
  const parsed = extractJSON(await callAI(messages, 0.2));
  if (!parsed || !Array.isArray(parsed.results)) throw new Error('Invalid AI grading response');
  const localResults = localGrammarResults(session);
  return session.questions.map(question => {
    const item = parsed.results.find(result => result.id === question.id);
    const local = localResults.find(result => result.id === question.id) || { correct: false, feedback: '' };
    const rawCorrect = item && item.correct;
    const hasValidAIResult = Boolean(item && (typeof rawCorrect === 'boolean' || ['true', 'false'].includes(String(rawCorrect).toLowerCase())));
    const aiCorrect = hasValidAIResult && (rawCorrect === true || String(rawCorrect).toLowerCase() === 'true');
    const aiFeedback = item && typeof item.feedback === 'string' ? item.feedback.trim() : '';
    const safeFeedback = chineseFeedbackOrFallback(aiFeedback, local.feedback);
    const negativeFeedback = /\u5224\u9519|\u9519\u8bef|\u4e0d\u6b63\u786e|\u7b54\u9519|wrong|incorrect/i.test(aiFeedback);
    const positiveFeedback = /\u6b63\u786e|\u7b54\u5bf9|correct|right/i.test(aiFeedback) && !/\u4e0d|wrong|incorrect/i.test(aiFeedback);
    const contradictsLocal = question.type === 'mcq' && aiFeedback && ((local.correct && negativeFeedback) || (!local.correct && positiveFeedback));
    const feedback = question.type === 'mcq' ? (contradictsLocal ? local.feedback : safeFeedback) : safeFeedback;
    return { id: question.id, correct: question.type === 'mcq' ? local.correct : (hasValidAIResult ? aiCorrect : local.correct), feedback };
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
  const wrongMemory = session.source === 'WRONG' && results[0] && results[0].correct ? state.wrongBook.find(item => item.id === session.questions[0].id) : null;
  savePracticeData();
  renderPractice();
  if (wrongMemory) setTimeout(() => promptWrongMemory(wrongMemory), 0);
}
function memoryEntryExists(sourceId, type) {
  return (state.memory.entries || []).some(item => item.sourceId === sourceId && item.type === type);
}
function addMemoryEntry(data) {
  const entry = Object.assign({ id: uid(), createdAt: Date.now() }, data);
  state.memory.entries = [entry].concat(state.memory.entries || []);
  savePracticeData();
  return entry;
}
function closeMemoryPrompt() { const modal = $('#memoryPrompt'); if (modal) modal.remove(); }
function openMemoryPrompt(payload) {
  closeMemoryPrompt();
  const modal = document.createElement('div'); modal.id = 'memoryPrompt'; modal.className = 'modal-backdrop';
  modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `<section class="memory-prompt-card"><span class="eyebrow">记忆本</span><h2>是否加入记忆本？</h2><p>${escapeHtml(payload.preview || '')}</p><div class="form-actions"><button class="primary-button" type="button" data-memory-action="add" data-memory-id="${payload.sourceId}" data-memory-type="${payload.type}">加入记忆本</button><button class="secondary-button" type="button" data-memory-action="skip">暂不加入</button><button class="text-button" type="button" data-memory-action="suppress" data-memory-id="${payload.sourceId}" data-memory-type="${payload.type}">不再提示</button></div></section>`;
  document.body.appendChild(modal);
  modal._memoryPayload = payload;
}
function promptWrongMemory(item) {
  if (!item || item.promptSuppressed || memoryEntryExists(item.id, 'wrong-correction')) return;
  openMemoryPrompt({ sourceId: item.id, type: 'wrong-correction', preview: item.prompt + ' → ' + (item.referenceAnswer || ''), entry: { sourceId: item.id, type: 'wrong-correction', topicId: item.topicId, topicTitle: item.topicTitle, level: item.level, title: item.topicTitle, content: item.prompt, reference: item.referenceAnswer || '', explanation: item.explanation || '' } });
}
function promptWritingMemory(record) {
  if (!record || record.promptSuppressed || memoryEntryExists(record.id, 'writing')) return;
  openMemoryPrompt({ sourceId: record.id, type: 'writing', preview: record.promptTitle + '：' + String(record.answer || '').slice(0, 100), entry: { sourceId: record.id, type: 'writing', level: record.level, title: record.promptTitle, content: record.answer, reference: (record.feedback && record.feedback.modelEssay) || '', explanation: (record.feedback && record.feedback.feedback) || '' } });
}
function renderMemoryBook() {
  const query = (state.practice.memoryQuery || '').trim().toLowerCase();
  const type = state.practice.memoryType || 'all';
  const entries = (state.memory.entries || []).filter(item => (type === 'all' || item.type === type) && (!query || [item.title, item.content, item.reference, item.topicTitle].join(' ').toLowerCase().includes(query)));
  return `<div class="practice-panel"><div class="practice-panel-intro"><span class="eyebrow">MEMORY BOOK</span><h2>记忆本</h2><p>保存写作成果和订正成功的错题，方便以后回顾和复习。</p></div><div class="memory-tools"><input id="memorySearch" type="search" value="${escapeHtml(state.practice.memoryQuery || '')}" placeholder="搜索记忆内容" aria-label="搜索记忆本"><select id="memoryType" aria-label="记忆类型"><option value="all" ${type === 'all' ? 'selected' : ''}>全部类型</option><option value="writing" ${type === 'writing' ? 'selected' : ''}>写作练习</option><option value="wrong-correction" ${type === 'wrong-correction' ? 'selected' : ''}>错题订正</option></select></div>${entries.length ? `<div class="memory-list">${entries.map(item => `<article class="memory-item"><div class="wrong-book-top"><span>${item.type === 'writing' ? '写作练习' : '错题订正'} · ${escapeHtml(item.level || '')}</span><small>${new Date(item.createdAt).toLocaleDateString('zh-CN')}</small></div><h3>${escapeHtml(item.title || '')}</h3><p>${escapeHtml(item.content || '')}</p>${item.reference ? `<small>参考：${escapeHtml(item.reference)}</small>` : ''}<div class="memory-actions"><button class="secondary-button small" type="button" data-practice-action="redo-memory" data-memory-id="${item.id}">\u91cd\u505a</button><button class="text-button" type="button" data-practice-action="delete-memory" data-memory-id="${item.id}">\u5220\u9664</button></div></article>`).join('')}</div>` : '<div class="empty-state"><h2>还没有记忆内容</h2><p>在错题订正答对或完成写作后，可以选择加入记忆本。</p></div>'}</div>`;
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
function redoMemory(id) {
  const memory = (state.memory.entries || []).find(item => item.id === id);
  if (!memory) return;
  if (memory.type === 'writing') {
    const record = (state.writing.history || []).find(item => item.id === memory.sourceId);
    const level = (record && record.level) || memory.level || state.settings.level || 'A1';
    const theme = (record && record.theme) || 'life';
    const fallback = localWritingTask(level, theme);
    const task = record ? {
      id: record.id,
      level,
      theme,
      promptTitle: record.promptTitle || fallback.promptTitle,
      promptZh: record.promptZh || fallback.promptZh,
      requirements: (record.feedback && record.feedback.requirements) || fallback.requirements,
      outline: (record.feedback && Array.isArray(record.feedback.outline)) ? record.feedback.outline : fallback.outline,
      modelEssay: (record.feedback && record.feedback.modelEssay) || fallback.modelEssay,
      usefulPhrases: (record.feedback && Array.isArray(record.feedback.usefulPhrases) && record.feedback.usefulPhrases.length) ? record.feedback.usefulPhrases : fallback.usefulPhrases
    } : fallback;
    state.practice.tab = 'writing';
    state.writing.level = level;
    state.writing.theme = theme;
    state.writing.lastRecord = null;
    state.writing.draft = { task, answer: '', createdAt: Date.now() };
    savePracticeData();
    renderPractice();
    return;
  }
  const wrong = (state.wrongBook || []).find(item => item.id === memory.sourceId) || (state.wrongBook || []).find(item => item.id === memory.id);
  if (wrong) { state.practice.tab = 'grammar'; redoWrong(wrong.id); return; }
  showToast('???????????????');
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
  return `<div class="practice-panel writing-practice-panel"><div class="practice-panel-intro"><span class="eyebrow">WRITING LAB</span><h2>写作练习</h2><p>按当前等级生成题目；提交后显示评分、修改理由、润色全文、范文和高分短句。</p></div><div class="practice-config-row"><label>写作难度<select id="writingLevel">${LEVEL_ORDER.map(item => `<option value="${item}" ${item === level ? 'selected' : ''}>${LEVEL_LABELS[item]}</option>`).join('')}</select></label><label>写作主题<select id="writingTheme">${Object.keys(practiceThemes).map(item => `<option value="${item}" ${item === theme ? 'selected' : ''}>${practiceThemes[item]}</option>`).join('')}</select></label><button class="primary-button" type="button" data-practice-action="start-writing">${isAIConfigured() ? 'AI 生成题目' : '生成本地题目'}</button></div>${draft ? `<div class="writing-task-card"><h3>${escapeHtml(draft.task.promptTitle)}</h3><p>${escapeHtml(draft.task.promptZh)}</p><small>${escapeHtml(draft.task.requirements)}</small><ol>${draft.task.outline.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol><textarea id="writingDraft" class="writing-input" placeholder="开始写作…">${escapeHtml(draft.answer || '')}</textarea><div class="form-actions"><button class="primary-button" type="button" data-practice-action="submit-writing">${isAIConfigured() ? '提交并批改' : '提交并自评'}</button><button class="secondary-button" type="button" data-practice-action="clear-writing-draft">清空草稿</button></div></div>` : '<div class="empty-state"><h2>生成一道写作题</h2><p>选择难度和主题后开始写作。未配置 AI 时也会提供本地范文和短句。</p></div>'}${state.writing.lastRecord ? renderWritingFeedback(state.writing.lastRecord) : ''}${state.writing.history && state.writing.history.length ? `<div class="writing-history"><h3>最近写作</h3>${state.writing.history.slice(0, 5).map(item => `<article><strong>${escapeHtml(item.promptTitle)}</strong><small>${escapeHtml(item.level)} · ${item.score == null ? '自评' : item.score + ' 分'}</small><p>${escapeHtml((item.answer || '').slice(0, 120))}</p><button class="text-button" type="button" data-practice-action="delete-writing" data-writing-id="${item.id}">删除</button></article>`).join('')}</div>` : ''}</div>`;
}
async function startWritingPractice() {
  const level = $('#writingLevel') ? $('#writingLevel').value : state.settings.level;
  const theme = $('#writingTheme') ? $('#writingTheme').value : 'life';
  let task = localWritingTask(level, theme);
  if (isAIConfigured()) {
    setPracticeButtonsBusy(true);
    setLoading(true, 'AI \u6b63\u5728\u8fde\u63a5\uff0c\u51c6\u5907\u751f\u6210\u5199\u4f5c\u9898\u76ee\u2026');
    practiceStreamStatus('AI \u6b63\u5728\u751f\u6210\u5199\u4f5c\u9898\u76ee\u2026');
    try {
      const messages = [
        { role: 'system', content: 'You are an English writing teacher. Return JSON only, without Markdown. promptTitle, promptZh, requirements, and outline MUST be in Simplified Chinese. usefulPhrases MUST be English phrases. Structure: {"promptTitle":"","promptZh":"","requirements":"","outline":[""],"usefulPhrases":[""]}.' },
        { role: 'user', content: 'Level: ' + level + '. Theme: ' + (practiceThemes[theme] || 'daily life') + '. Requirements: ' + writingLevelRules[level] + '. Generate a clear writing task.' }
      ];
      let content = '';
      let lastChars = 0;
      let streamStarted = false;
      try {
        content = await callAIStream(messages, 0.6, (delta, accumulated) => {
          if (!streamStarted) { streamStarted = true; setLoading(false); }
          const count = accumulated.length;
          if (count - lastChars >= 16) { lastChars = count; practiceStreamStatus('AI \u6b63\u5728\u751f\u6210\u5199\u4f5c\u9898\u76ee\u2026', count); }
        });
      } catch (error) {
        setLoading(false);
        practiceStreamStatus('\u5f53\u524d\u670d\u52a1\u4e0d\u652f\u6301\u6d41\u5f0f\u8f93\u51fa\uff0c\u6b63\u5728\u5207\u6362\u666e\u901a\u6a21\u5f0f\u2026');
        content = await callAI(messages, 0.6);
      }
      const parsed = extractJSON(content);
      if (parsed && parsed.promptTitle) {
        parsed.outline = Array.isArray(parsed.outline) ? parsed.outline : task.outline;
        parsed.usefulPhrases = Array.isArray(parsed.usefulPhrases) ? parsed.usefulPhrases : task.usefulPhrases;
        task = Object.assign(task, parsed);
      }
    } catch (error) { showToast('AI \u51fa\u9898\u5931\u8d25\uff0c\u5df2\u4f7f\u7528\u672c\u5730\u9898\u76ee'); }
    finally { setLoading(false); setPracticeButtonsBusy(false); }
  }
  state.writing.level = level; state.writing.theme = theme; state.writing.lastRecord = null; state.writing.draft = { task, answer: '', createdAt: Date.now() };
  savePracticeData(); renderPractice();
}
async function submitWritingPractice() {
  const draft = state.writing.draft;
  if (!draft) return;
  draft.answer = $('#writingDraft') ? $('#writingDraft').value : draft.answer;
  if (!draft.answer.trim()) { showToast('\u8bf7\u5148\u5b8c\u6210\u5199\u4f5c\u5185\u5bb9'); return; }
  let feedback = { score: null, dimensions: {}, errors: [], polishedEssay: draft.answer, modelEssay: draft.task.modelEssay, usefulPhrases: draft.task.usefulPhrases || [], feedback: '\u5df2\u5b8c\u6210\u672c\u5730\u4fdd\u5b58\uff0c\u8bf7\u5bf9\u7167\u8303\u6587\u81ea\u8bc4\u8bed\u6cd5\u3001\u7ed3\u6784\u548c\u8bcd\u6c47\u3002' };
  if (isAIConfigured()) {
    setLoading(true, 'AI \u6b63\u5728\u6279\u6539\u5199\u4f5c\u2026');
    try {
      const parsed = extractJSON(await callAI([{ role: 'system', content: 'You are an English writing teacher. Return JSON only, without Markdown. All feedback and errors[].reason fields MUST be in Simplified Chinese. Keep English only for original/corrected English examples, polishedEssay, modelEssay, and usefulPhrases. Structure: {"score":0-100,"dimensions":{"content":0-25,"organization":0-25,"grammar":0-25,"vocabulary":0-25},"errors":[{"original":"","corrected":"","reason":""}],"polishedEssay":"","modelEssay":"","usefulPhrases":[""],"feedback":""}.' }, { role: 'user', content: '\u9898\u76ee\uff1a' + draft.task.promptZh + '\n\u8981\u6c42\uff1a' + draft.task.requirements + '\n\u5b66\u751f\u4f5c\u6587\uff1a' + draft.answer }], 0.3));
      if (parsed && typeof parsed.score === 'number') {
        parsed.feedback = chineseFeedbackOrFallback(parsed.feedback, feedback.feedback);
        parsed.errors = Array.isArray(parsed.errors) ? parsed.errors.map(error => Object.assign({}, error, { reason: chineseFeedbackOrFallback(error.reason, '\u8bf7\u68c0\u67e5\u6b64\u5904\u8bed\u6cd5\u6216\u8868\u8fbe\u3002') })) : [];
        feedback = parsed;
      }
    } catch (error) { showToast('AI \u6279\u6539\u5931\u8d25\uff0c\u5df2\u63d0\u4f9b\u672c\u5730\u8303\u6587\u548c\u81ea\u8bc4\u63d0\u793a'); }
    finally { setLoading(false); }
  }
  const record = { id: uid(), level: draft.task.level, theme: draft.task.theme, promptTitle: draft.task.promptTitle, promptZh: draft.task.promptZh, answer: draft.answer, feedback, createdAt: Date.now(), score: feedback.score };
  state.writing.history = [record].concat(state.writing.history || []).slice(0, 20);
  state.writing.draft = null;
  state.writing.lastRecord = record;
  savePracticeData(); renderPractice();
  setTimeout(() => promptWritingMemory(record), 0);
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
  const memoryCount = (state.memory.entries || []).length;
  summary.innerHTML = `<strong>${typeof grammarTopics !== 'undefined' ? grammarTopics.length : 0}</strong><span>语法微专题</span><strong>${wrongCount}</strong><span>待掌握错题</span><strong>${memoryCount}</strong><span>记忆本</span>`;
  $$('.practice-tab').forEach(button => button.classList.toggle('active', button.dataset.practiceTab === tab));
  content.innerHTML = tab === 'wrong' ? renderWrongBook() : (tab === 'writing' ? renderWritingPanel() : (tab === 'memory' ? renderMemoryBook() : renderGrammarPractice()));
  if (typeof window.wordifyContent === 'function') window.wordifyContent(content);
}
document.addEventListener('click', event => {
  const memoryButton = event.target.closest('[data-memory-action]');
  if (memoryButton) {
    const modal = $('#memoryPrompt'); const payload = modal && modal._memoryPayload; const action = memoryButton.dataset.memoryAction;
    if (action === 'add' && payload) { addMemoryEntry(payload.entry); showToast('已加入记忆本'); }
    if (action === 'suppress' && payload) { if (payload.type === 'writing') { const record = (state.writing.history || []).find(item => item.id === payload.sourceId); if (record) record.promptSuppressed = true; } else { const item = (state.wrongBook || []).find(entry => entry.id === payload.sourceId); if (item) item.promptSuppressed = true; } savePracticeData(); }
    closeMemoryPrompt(); renderPractice(); return;
  }
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
  else if (name === 'refresh-grammar') startGrammarPractice(true);
  else if (name === 'redo-wrong') redoWrong(action.dataset.wrongId);
  else if (name === 'master-wrong') markWrongMastered(action.dataset.wrongId);
  else if (name === 'delete-wrong') deleteWrong(action.dataset.wrongId);
  else if (name === 'start-writing') startWritingPractice();
  else if (name === 'submit-writing') submitWritingPractice();
  else if (name === 'clear-writing-draft') { if (state.writing.draft) { state.writing.draft.answer = ''; savePracticeData(); renderPractice(); } }
  else if (name === 'delete-writing') { state.writing.history = (state.writing.history || []).filter(item => item.id !== action.dataset.writingId); savePracticeData(); renderPractice(); }
  else if (name === 'redo-memory') redoMemory(action.dataset.memoryId);
  else if (name === 'delete-memory') { state.memory.entries = (state.memory.entries || []).filter(item => item.id !== action.dataset.memoryId); savePracticeData(); renderPractice(); }
});
document.addEventListener('input', event => { if (event.target && event.target.id === 'writingDraft') saveWritingDraft(); if (event.target && event.target.id === 'memorySearch') { state.practice.memoryQuery = event.target.value; renderPractice(); } });
document.addEventListener('change', event => {
  if (event.target && event.target.id === 'memoryType') { state.practice.memoryType = event.target.value; renderPractice(); return; }
  if (event.target && ['data-level', 'mobileLevelSelect', 'articleLevel'].some(key => event.target.matches && event.target.matches(`[${key}]`))) setTimeout(renderPractice, 0);
});
renderPractice();
