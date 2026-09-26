'use strict';
const translationRows = `
A1|life|zh-en|我每天早上七点起床。|I get up at seven every morning.
A1|campus|zh-en|她每天步行去学校。|She walks to school every day.
A1|family|zh-en|我喜欢和家人一起吃晚饭。|I like having dinner with my family.
A1|life|en-zh|There is a book on the desk.|桌子上有一本书。
A1|campus|en-zh|He is good at English.|他擅长英语。
A1|time|en-zh|We have lunch at noon.|我们中午吃午饭。
A2|life|zh-en|我通常在做作业前打扫房间。|I usually clean my room before doing my homework.
A2|travel|zh-en|我们期待着参观这座博物馆。|We are looking forward to visiting the museum.
A2|health|zh-en|你应该每天锻炼以保持健康。|You should work out every day to stay healthy.
A2|campus|en-zh|She takes notes carefully in class.|她在课堂上认真记笔记。
A2|technology|en-zh|Please turn off your phone before the exam.|考试前请关掉手机。
A2|study|en-zh|I have made great progress in English.|我的英语取得了很大进步。
B1|campus|zh-en|我们应该充分利用学校提供的资源。|We should take full advantage of the resources provided by the school.
B1|environment|zh-en|减少塑料使用有助于保护环境。|Cutting down on plastic helps protect the environment.
B1|opinion|zh-en|从长远来看，坚持阅读会带来很大的变化。|In the long run, keeping reading will make a big difference.
B1|work|en-zh|The team carried out the plan successfully.|团队成功执行了这项计划。
B1|social|en-zh|It is important to get along well with others.|与他人融洽相处很重要。
B1|writing|en-zh|As a result, more students began to read every day.|结果，更多学生开始每天阅读。
CET4|academic|zh-en|研究人员得出结论：规律的练习能提高学习效率。|The researchers drew the conclusion that regular practice can improve learning efficiency.
CET4|society|zh-en|新技术给人们的生活带来了许多变化。|New technology has brought about many changes in people's lives.
CET4|environment|zh-en|我们应该采取措施应对空气污染。|We should take measures to cope with air pollution.
CET4|technology|en-zh|Students should make full use of online learning resources.|学生应该充分利用在线学习资源。
CET4|economy|en-zh|The increase in sales resulted from better marketing.|销售额增长是由更好的营销带来的。
CET4|writing|en-zh|In addition to saving time, the new system is easier to use.|除了节省时间，新系统还更容易使用。
`;
const translationSeeds = translationRows.trim().split(/\r?\n/).filter(Boolean).map((row, index) => {
  const [level, theme, type, prompt, referenceAnswer] = row.split('|');
  return { id: `translation-offline-${index + 1}`, level, theme, type, prompt, referenceAnswer, accepts: [referenceAnswer], explanation: '对照参考译文检查关键词、时态和语序。' };
});