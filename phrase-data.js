'use strict';
const phraseThemeLabels = { life: '日常生活', campus: '校园学习', family: '家庭关系', travel: '旅行出行', hobby: '兴趣爱好', health: '健康生活', time: '时间表达', shopping: '购物消费', food: '饮食用餐', communication: '沟通交流', work: '工作学习', social: '社交关系', technology: '科技网络', environment: '环境社会', opinion: '观点表达', study: '学习方法', writing: '写作表达', academic: '学术表达', society: '社会话题', economy: '经济生活', workplace: '职场表达', exam: '考试表达' };
const phraseRows = `
A1|life|get up|起床
A1|life|go to bed|上床睡觉
A1|life|have breakfast|吃早饭
A1|life|take a shower|洗澡
A1|life|go home|回家
A1|campus|go to school|去上学
A1|campus|do homework|做作业
A1|campus|listen to the teacher|听老师讲课
A1|campus|ask a question|问问题
A1|campus|take a test|参加考试
A1|family|look after|照顾
A1|family|help with|帮助做
A1|family|spend time with|和……共度时光
A1|family|talk about|谈论
A1|family|live with|和……一起住
A1|travel|go by bus|乘公共汽车去
A1|travel|wait for|等待
A1|travel|get on|上车
A1|travel|get off|下车
A1|travel|look for|寻找
A1|hobby|be good at|擅长
A1|hobby|play with|和……玩
A1|hobby|take part in|参加
A1|hobby|have fun|玩得开心
A1|hobby|go out|外出
A1|health|feel tired|感到累
A1|health|stay healthy|保持健康
A1|health|get better|好转
A1|health|see a doctor|看医生
A1|health|take medicine|吃药
A1|time|at night|在晚上
A1|time|in the morning|在早上
A1|time|on time|准时
A1|time|every day|每天
A1|time|right now|现在
A1|shopping|how much|多少钱
A1|shopping|look at|看
A1|shopping|try on|试穿
A1|shopping|pay for|为……付款
A1|shopping|a lot of|许多
A1|food|a cup of|一杯
A1|food|a glass of|一玻璃杯
A1|food|have dinner|吃晚饭
A1|food|eat out|出去吃饭
A1|food|be full|吃饱了
A1|communication|call back|回电话
A1|communication|listen to|听
A1|communication|talk to|和……交谈
A1|communication|say hello to|向……问好
A1|communication|thank you for|感谢
A2|life|wake up|醒来
A2|life|clean up|打扫干净
A2|life|get ready|准备好
A2|life|take care of|照顾
A2|life|stay up late|熬夜
A2|campus|hand in|上交
A2|campus|take notes|记笔记
A2|campus|get along with|与……相处
A2|campus|prepare for|为……做准备
A2|campus|pay attention to|注意
A2|work|apply for|申请
A2|work|work on|从事；研究
A2|work|be responsible for|对……负责
A2|work|deal with|处理
A2|work|depend on|依赖
A2|travel|arrive at|到达
A2|travel|leave for|动身前往
A2|travel|check in|办理入住/登记
A2|travel|set off|出发
A2|travel|get back|返回
A2|social|get in touch with|与……取得联系
A2|social|look forward to|期待
A2|social|make friends with|与……交朋友
A2|social|keep in touch|保持联系
A2|social|meet up with|和……会面
A2|health|give up|放弃
A2|health|work out|锻炼
A2|health|be worried about|担心
A2|health|feel like|想要
A2|health|take a rest|休息一下
A2|technology|turn on|打开
A2|technology|turn off|关闭
A2|technology|log in|登录
A2|technology|sign up|注册
A2|technology|look up|查阅
A2|communication|find out|查明
A2|communication|point out|指出
A2|communication|ask for|请求
A2|communication|reply to|回复
A2|communication|agree with|同意
A2|study|focus on|专注于
A2|study|make progress|取得进步
A2|study|learn from|向……学习
A2|study|come true|实现
A2|study|be interested in|对……感兴趣
A2|daily|run out of|用完
A2|daily|pick up|捡起；接人
A2|daily|put away|收好
A2|daily|throw away|扔掉
A2|daily|give back|归还
B1|life|carry out|执行
B1|life|put up with|忍受
B1|life|come up with|想出
B1|life|get rid of|摆脱
B1|life|make sense|有意义
B1|campus|take advantage of|利用
B1|campus|catch up with|赶上
B1|campus|keep up with|跟上
B1|campus|be aware of|意识到
B1|campus|take responsibility for|对……负责
B1|work|carry on|继续
B1|work|bring about|带来
B1|work|set up|建立
B1|work|take over|接管
B1|work|figure out|弄清楚
B1|travel|check out|结账离开；查看
B1|travel|look around|四处看看
B1|travel|run into|偶遇
B1|travel|come across|偶然遇到
B1|travel|get around|四处走动
B1|social|bring together|使团结
B1|social|get along well with|与……相处融洽
B1|social|stand for|代表
B1|social|take part in|参加
B1|social|belong to|属于
B1|environment|cut down on|减少
B1|environment|lead to|导致
B1|environment|result in|造成
B1|environment|contribute to|促成；贡献
B1|environment|deal with|处理
B1|opinion|point out|指出
B1|opinion|agree with|同意
B1|opinion|disagree with|不同意
B1|opinion|believe in|相信
B1|opinion|refer to|指的是；提到
B1|study|look into|调查
B1|study|put forward|提出
B1|study|take into account|考虑到
B1|study|come to a conclusion|得出结论
B1|study|make a difference|产生影响
B1|time|as soon as|一……就
B1|time|sooner or later|迟早
B1|time|from time to time|偶尔
B1|time|in the long run|从长远看
B1|time|at first|起初
B1|writing|for example|例如
B1|writing|in addition|此外
B1|writing|on the other hand|另一方面
B1|writing|as a result|结果
B1|writing|in conclusion|总之
CET4|academic|conduct a study|开展研究
CET4|academic|draw a conclusion|得出结论
CET4|academic|take measures|采取措施
CET4|academic|play a role|发挥作用
CET4|academic|make a contribution|作出贡献
CET4|society|give rise to|引起
CET4|society|be attributed to|归因于
CET4|society|have access to|有机会使用
CET4|society|be exposed to|接触到
CET4|society|take advantage of|利用
CET4|economy|result from|由……造成
CET4|economy|account for|占；解释
CET4|economy|invest in|投资于
CET4|economy|benefit from|从……受益
CET4|economy|be based on|基于
CET4|technology|keep pace with|跟上
CET4|technology|be dependent on|依赖
CET4|technology|make use of|利用
CET4|technology|bring about|带来
CET4|technology|set up|建立
CET4|environment|cope with|应对
CET4|environment|take action|采取行动
CET4|environment|be aware of|意识到
CET4|environment|contribute to|促成
CET4|environment|cut down on|减少
CET4|campus|adapt to|适应
CET4|campus|be engaged in|从事于
CET4|campus|apply for|申请
CET4|campus|be qualified for|胜任
CET4|campus|specialize in|专攻
CET4|opinion|in terms of|就……而言
CET4|opinion|with regard to|关于
CET4|opinion|on the contrary|相反
CET4|opinion|in contrast|相比之下
CET4|opinion|to some extent|在某种程度上
CET4|writing|in addition to|除……之外
CET4|writing|due to|由于
CET4|writing|as a consequence|因此
CET4|writing|for the sake of|为了
CET4|writing|in response to|回应
CET4|workplace|take responsibility for|对……负责
CET4|workplace|be committed to|致力于
CET4|workplace|work out|解决
CET4|workplace|carry out|执行
CET4|workplace|put forward|提出
CET4|exam|distinguish between|区分
CET4|exam|refer to|提到；参考
CET4|exam|account for|解释
CET4|exam|give an example of|举例说明
CET4|exam|draw a distinction|区分
`;
function phraseExample(phrase, theme) {
  const themeName = phraseThemeLabels[theme] || theme;
  return `I can use "${phrase}" when I talk about ${themeName}.`;
}
function phraseExampleZh(phrase, meaning, theme) {
  const themeName = phraseThemeLabels[theme] || theme;
  return `谈论${themeName}时可以使用词组“${phrase}”，意思是“${meaning}”。`;
}
const phraseSeeds = phraseRows.trim().split(/\r?\n/).filter(Boolean).map((row, index) => {
  const [level, theme, phrase, meaningZh] = row.split('|');
  return { id: `phrase-${index + 1}`, level, theme, phrase, meaningZh, example: phraseExample(phrase, theme), exampleZh: phraseExampleZh(phrase, meaningZh, theme) };
});