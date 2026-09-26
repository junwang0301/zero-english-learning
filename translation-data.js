'use strict';
const translationRows = `
A1|life|zh-en|\u6211\u6bcf\u5929\u65e9\u4e0a\u4e03\u70b9\u8d77\u5e8a\u3002|I get up at seven every morning.
A1|campus|zh-en|\u5979\u6bcf\u5929\u6b65\u884c\u4e0a\u5b66\u3002|She walks to school every day.
A1|family|zh-en|\u6211\u559c\u6b22\u548c\u5bb6\u4eba\u5171\u8fdb\u665a\u9910\u3002|I like having dinner with my family.
A1|life|en-zh|There is a book on the desk.|\u4e66\u684c\u4e0a\u6709\u4e00\u672c\u4e66\u3002
A1|campus|en-zh|He is good at English.|\u4ed6\u64c5\u957f\u82f1\u8bed\u3002
A1|time|en-zh|We have lunch at noon.|\u6211\u4eec\u4e2d\u5348\u5403\u5348\u996d\u3002
A2|life|zh-en|\u6211\u901a\u5e38\u5728\u505a\u4f5c\u4e1a\u524d\u6253\u626b\u623f\u95f4\u3002|I usually clean my room before doing my homework.
A2|travel|zh-en|\u6211\u4eec\u671f\u5f85\u53c2\u89c2\u535a\u7269\u9986\u3002|We are looking forward to visiting the museum.
A2|health|zh-en|\u4f60\u5e94\u8be5\u6bcf\u5929\u953b\u70bc\u8eab\u4f53\uff0c\u4ee5\u4fdd\u6301\u5065\u5eb7\u3002|You should work out every day to stay healthy.
A2|campus|en-zh|She takes notes carefully in class.|\u5979\u5728\u8bfe\u5802\u4e0a\u4ed4\u7ec6\u505a\u7b14\u8bb0\u3002
A2|technology|en-zh|Please turn off your phone before the exam.|\u8bf7\u5728\u8003\u8bd5\u524d\u5173\u95ed\u624b\u673a\u3002
A2|study|en-zh|I have made great progress in English.|\u6211\u5728\u82f1\u8bed\u65b9\u9762\u53d6\u5f97\u4e86\u5f88\u5927\u7684\u8fdb\u6b65\u3002
B1|campus|zh-en|\u6211\u4eec\u5e94\u8be5\u5145\u5206\u5229\u7528\u5b66\u6821\u63d0\u4f9b\u7684\u8d44\u6e90\u3002|We should take full advantage of the resources provided by the school.
B1|environment|zh-en|\u51cf\u5c11\u5851\u6599\u6709\u52a9\u4e8e\u4fdd\u62a4\u73af\u5883\u3002|Cutting down on plastic helps protect the environment.
B1|opinion|zh-en|\u4ece\u957f\u8fdc\u6765\u770b\uff0c\u7ee7\u7eed\u9605\u8bfb\u4f1a\u6709\u5f88\u5927\u7684\u4e0d\u540c\u3002|In the long run, keeping reading will make a big difference.
B1|work|en-zh|The team carried out the plan successfully.|\u56e2\u961f\u6210\u529f\u5b9e\u65bd\u4e86\u8ba1\u5212\u3002
B1|social|en-zh|It is important to get along well with others.|\u4e0e\u4ed6\u4eba\u76f8\u5904\u5f88\u91cd\u8981\u3002
B1|writing|en-zh|As a result, more students began to read every day.|\u7ed3\u679c\uff0c\u6bcf\u5929\u90fd\u6709\u66f4\u591a\u7684\u5b66\u751f\u5f00\u59cb\u9605\u8bfb\u3002
CET4|academic|zh-en|\u7814\u7a76\u4eba\u5458\u5f97\u51fa\u7684\u7ed3\u8bba\u662f\uff0c\u5b9a\u671f\u7ec3\u4e60\u53ef\u4ee5\u63d0\u9ad8\u5b66\u4e60\u6548\u7387\u3002|The researchers drew the conclusion that regular practice can improve learning efficiency.
CET4|society|zh-en|\u65b0\u6280\u672f\u7ed9\u4eba\u4eec\u7684\u751f\u6d3b\u5e26\u6765\u4e86\u8bb8\u591a\u53d8\u5316\u3002|New technology has brought about many changes in people's lives.
CET4|environment|zh-en|\u6211\u4eec\u5e94\u8be5\u91c7\u53d6\u63aa\u65bd\u5e94\u5bf9\u7a7a\u6c14\u6c61\u67d3\u3002|We should take measures to cope with air pollution.
CET4|technology|en-zh|Students should make full use of online learning resources.|\u5b66\u751f\u5e94\u5145\u5206\u5229\u7528\u5728\u7ebf\u5b66\u4e60\u8d44\u6e90\u3002
CET4|economy|en-zh|The increase in sales resulted from better marketing.|\u9500\u552e\u989d\u7684\u589e\u957f\u6e90\u4e8e\u66f4\u597d\u7684\u8425\u9500\u3002
CET4|writing|en-zh|In addition to saving time, the new system is easier to use.|\u9664\u4e86\u8282\u7701\u65f6\u95f4\u5916\uff0c\u65b0\u7cfb\u7edf\u66f4\u6613\u4e8e\u4f7f\u7528\u3002
`;
const translationSeeds = translationRows.trim().split(/\r?\n/).filter(Boolean).map((row, index) => {
  const [level, theme, type, prompt, referenceAnswer] = row.split('|');
  return { id: `translation-offline-${index + 1}`, level, theme, type, prompt, referenceAnswer, accepts: [referenceAnswer], explanation: '\u5bf9\u7167\u53c2\u8003\u8bd1\u6587\u68c0\u67e5\u5173\u952e\u8bcd\u3001\u65f6\u6001\u548c\u8bed\u5e8f\u3002' };
});
