'use strict';
const phraseThemeLabels = { life: '\u65e5\u5e38\u751f\u6d3b', campus: '\u6821\u56ed\u5b66\u4e60', family: '\u4eb2\u5c5e\u5173\u7cfb', travel: '\u65c5\u884c', hobby: '\u5174\u8da3\u7231\u597d', health: '\u5065\u5eb7\u536b\u751f', time: '\u65f6\u95f4\u8868\u8fbe', shopping: '\u8d2d\u7269', food: '\u98df\u7269\u548c\u81b3\u98df', communication: '\u6c9f\u901a', work: '\u5de5\u4f5c\u548c\u5b66\u4e60', daily: '\u65e5\u5e38\u751f\u6d3b', social: '\u793e\u4ea4\u751f\u6d3b', technology: '\u79d1\u6280', environment: '\u73af\u5883\u4e0e\u793e\u4f1a', opinion: '\u89c2\u70b9', study: '\u5b66\u4e60\u65b9\u6cd5', writing: '\u5199\u4f5c\u8868\u8fbe', academic: '\u5b66\u672f\u82f1\u8bed', society: '\u793e\u4f1a\u95ee\u9898', economy: '\u7ecf\u6d4e', workplace: '\u804c\u573a', exam: '\u8003\u8bd5' };
const phraseUsageOverrides = {
  "a cup of": {
    "collocations": [
      "a cup of tea",
      "a cup of coffee"
    ],
    "example": "I drink a cup of tea every morning.",
    "exampleZh": "\u6211\u6bcf\u5929\u65e9\u4e0a\u559d\u4e00\u676f\u8336\u3002"
  },
  "a glass of": {
    "collocations": [
      "a glass of water",
      "a glass of milk"
    ],
    "example": "Please give me a glass of water.",
    "exampleZh": "\u8bf7\u7ed9\u6211\u4e00\u676f\u6c34\u3002"
  },
  "a lot of": {
    "collocations": [
      "a lot of time",
      "a lot of people"
    ],
    "example": "A lot of students study English online.",
    "exampleZh": "\u8bb8\u591a\u5b66\u751f\u5728\u7f51\u4e0a\u5b66\u4e60\u82f1\u8bed\u3002"
  },
  "account for": {
    "collocations": [
      "account for the change",
      "account for 30 percent"
    ],
    "example": "These factors account for the change.",
    "exampleZh": "\u8fd9\u4e9b\u56e0\u7d20\u89e3\u91ca\u4e86\u8fd9\u4e00\u53d8\u5316\u3002"
  },
  "agree with": {
    "collocations": [
      "agree with you",
      "agree with the plan"
    ],
    "example": "I agree with your idea.",
    "exampleZh": "\u6211\u540c\u610f\u4f60\u7684\u60f3\u6cd5\u3002"
  },
  "apply for": {
    "collocations": [
      "apply for a job",
      "apply for a visa"
    ],
    "example": "She wants to apply for a job.",
    "exampleZh": "\u5979\u60f3\u7533\u8bf7\u4e00\u4efd\u5de5\u4f5c\u3002"
  },
  "arrive at": {
    "collocations": [
      "arrive at school",
      "arrive at the station"
    ],
    "example": "We will arrive at the station on time.",
    "exampleZh": "\u6211\u4eec\u5c06\u51c6\u65f6\u5230\u8fbe\u8f66\u7ad9\u3002"
  },
  "as a consequence": {
    "collocations": [
      "as a consequence of",
      "as a consequence, ..."
    ],
    "example": "He missed the bus; as a consequence, he was late.",
    "exampleZh": "\u4ed6\u9519\u8fc7\u4e86\u516c\u4ea4\u8f66\uff0c\u56e0\u6b64\u8fdf\u5230\u4e86\u3002"
  },
  "as a result": {
    "collocations": [
      "as a result of",
      "as a result, ..."
    ],
    "example": "It rained heavily; as a result, the game was canceled.",
    "exampleZh": "\u96e8\u4e0b\u5f97\u5f88\u5927\uff0c\u7ed3\u679c\u6bd4\u8d5b\u53d6\u6d88\u4e86\u3002"
  },
  "as soon as": {
    "collocations": [
      "as soon as possible",
      "as soon as you arrive"
    ],
    "example": "Call me as soon as you arrive.",
    "exampleZh": "\u4f60\u4e00\u5230\u5c31\u7ed9\u6211\u6253\u7535\u8bdd\u3002"
  },
  "get up": {
    "collocations": [
      "get up early",
      "get up at seven"
    ],
    "example": "I get up at seven every morning.",
    "exampleZh": "\u6211\u6bcf\u5929\u65e9\u4e0a\u4e03\u70b9\u8d77\u5e8a\u3002"
  },
  "go to bed": {
    "collocations": [
      "go to bed early",
      "go to bed at ten"
    ],
    "example": "I go to bed early on school nights.",
    "exampleZh": "\u4e0a\u5b66\u7684\u665a\u4e0a\u6211\u65e9\u65e9\u4e0a\u5e8a\u7761\u89c9\u3002"
  },
  "have breakfast": {
    "collocations": [
      "have breakfast at home",
      "have breakfast with family"
    ],
    "example": "We have breakfast at home every day.",
    "exampleZh": "\u6211\u4eec\u6bcf\u5929\u5728\u5bb6\u5403\u65e9\u996d\u3002"
  },
  "take a shower": {
    "collocations": [
      "take a shower in the morning",
      "take a shower before bed"
    ],
    "example": "I take a shower before bed.",
    "exampleZh": "\u6211\u7761\u524d\u6d17\u4e2a\u6fa1\u3002"
  },
  "go home": {
    "collocations": [
      "go home after work",
      "go home now"
    ],
    "example": "I usually go home after work.",
    "exampleZh": "\u6211\u901a\u5e38\u4e0b\u73ed\u540e\u56de\u5bb6\u3002"
  },
  "go to school": {
    "collocations": [
      "go to school by bus",
      "go to school every day"
    ],
    "example": "She will go to school by bus.",
    "exampleZh": "\u5979\u5c06\u4e58\u516c\u5171\u6c7d\u8f66\u4e0a\u5b66\u3002"
  },
  "do homework": {
    "collocations": [
      "do homework after dinner",
      "do homework carefully"
    ],
    "example": "I do homework after dinner.",
    "exampleZh": "\u6211\u665a\u996d\u540e\u505a\u4f5c\u4e1a\u3002"
  },
  "look after": {
    "collocations": [
      "look after children",
      "look after your health"
    ],
    "example": "She will look after her little brother.",
    "exampleZh": "\u5979\u4f1a\u7167\u987e\u5979\u7684\u5f1f\u5f1f\u3002"
  },
  "help with": {
    "collocations": [
      "help with homework",
      "help with the housework"
    ],
    "example": "Can you help with my homework?",
    "exampleZh": "\u4f60\u80fd\u5e2e\u6211\u505a\u4f5c\u4e1a\u5417\uff1f"
  },
  "be good at": {
    "collocations": [
      "be good at English",
      "be good at math"
    ],
    "example": "She can be good at English with practice.",
    "exampleZh": "\u901a\u8fc7\u7ec3\u4e60\uff0c\u5979\u53ef\u4ee5\u64c5\u957f\u82f1\u8bed\u3002"
  }
};

const phraseRows = `
A1|life|get up|\u7ad9\u8d77\u6765; \uff08\u4f7f\uff09\u8d77\u5e8a; \u5b89\u6392; \u4e3e\u8d77
A1|life|go to bed|\u53bb\u7761\u89c9; \u5b89\u6b47
A1|life|have breakfast|\u5403\u65e9\u996d
A1|life|take a shower|\u6c90\u6d74
A1|life|go home|\u56de\u5bb6
A1|campus|go to school|\u4e0a\u5b66
A1|campus|do homework|\u505a\u4f5c\u4e1a
A1|campus|listen to the teacher|\u542c\u8bfe
A1|campus|ask a question|\u95ee\u95ee\u9898; \u63d0\u95ee; \u53d1\u95ee
A1|campus|take a test|\u53c2\u52a0\u6d4b\u9a8c
A1|family|look after|\u7167\u987e; \u7167\u6599; \u6599\u7406; \u6253\u7406
A1|family|help with|\u5e2e\u52a9\uff08\u67d0\u4eba\uff09\u505a\u2026; \u7528\u2026\u6765\u5e2e\u52a9
A1|family|spend time with|\u82b1\u65f6\u95f4\u4e0e\u2026\u5728\u4e00\u8d77
A1|family|talk about|\u8ba8\u8bba\uff0c\u8c08\u8bba; \u8003\u8651\uff08\u505a\u2026\uff09; \u5520; \u8bdd
A1|family|live with|\u4e0e\u2026\u4e00\u8d77\u751f\u6d3b; \u4e0e\uff08\u5f02\u6027\uff09\u540c\u5c45; \u5b66\u4f1a\u53bb\u9002\u5e94; \u63a5\u53d7\u5e76\u5fcd\u53d7
A1|travel|go by bus|\u4e58\u516c\u5171\u6c7d\u8f66
A1|travel|wait for|\u7b49\u5f85;  \u6ce8\u610f; \u63a8\u8fdf\uff08\u7528\u9910\uff09\u76f4\u5230\uff08\u67d0\u4eba\uff09\u5230\u8fbe; \u89c2\u671b\u5f62\u52bf\u540e\u518d\u4f5c\u51b3\u5b9a
A1|travel|get on|\u4e0a\u8f66; \u8fdb\u884c; \u53d8\u8001; \u5bf9\u4ed8
A1|travel|get off|\u79bb\u5f00; \u4e0b\uff08\u8f66\u3001\u9a6c\u7b49\uff09; \u53d1\u51fa; \uff08\u4f7f\uff09\u5165\u7761
A1|travel|look for|\u5bfb\u627e\uff08\u67d0\u4eba\u6216\u67d0\u7269\uff09; \u627e\uff08\u9ebb\u70e6\uff09; \u627e\uff08\u82e6\u5934\uff09\u5403; \u5e0c\u671b\u5f97\u5230
A1|hobby|be good at|\u64c5\u957f
A1|hobby|play with|\u540c\u2026\u4e00\u8d77\u73a9; \u73a9\u5f04\u2026; \uff08\u4e0d\u592a\u8ba4\u771f\u5730\uff09\u8003\u8651; \u9017
A1|hobby|take part in|\u53c2\u52a0\u2026\uff0c\u53c2\u4e0e\u2026\u6d3b\u52a8; \u63d2\u811a; \u5395; \u9884
A1|hobby|have fun|\u73a9\u5f97\u9ad8\u5174\uff0c\u8fc7\u5f97\u5feb\u6d3b; \u800d\u7b11; \u73a9\u800d
A1|hobby|go out|\u5916\u51fa; \u51fa\u56fd; \u7184\u706d; \u51fa\u7248
A1|health|feel tired|\u611f\u5230\u75b2\u52b3
A1|health|stay healthy|\u4fdd\u6301\u5065\u5eb7
A1|health|get better|\u8f6c\u597d; \u89c1\u597d
A1|health|see a doctor|\u770b\u533b\u751f
A1|health|take medicine|\u5403\u836f\uff0c\u670d\u836f
A1|time|at night|\u591c\u95f4; \u5728\u591c\u91cc; \u591c\u6765
A1|time|in the morning|\u660e\u5929\u4e0a\u5348[\u65e9\u6668]
A1|time|on time|\u6309\u65f6\uff0c\u51c6\u65f6; \u4ee5\u5206\u671f\u4ed8\u6b3e\u65b9\u5f0f; \u6b63\u70b9; \u987a\u65f6
A1|time|every day|\u6bcf\u5929; \u5929\u5929; \u65e5; \u9010\u65e5
A1|time|right now|\u6b64\u65f6; \u7acb\u5373; \u6b64\u523b\uff0c\u76ee\u524d
A1|shopping|how much|\u591a\u5c11\uff0c\u4ec0\u4e48\u4ef7\u94b1\uff0c\u5230\u4ec0\u4e48\u7a0b\u5ea6
A1|shopping|look at|\u770b; \u5ba1\u89c6; \u8bc4\u5224; \u63a5\u53d7
A1|shopping|try on|\u8bd5\u7a7f; \u800d\u82b1\u62db\uff0c \u54c4\u9a97
A1|shopping|pay for|\u8d54\u507f; \u4e3a\u2026\u4ed8\u94b1; \u56e0\u2026\u53d7\u7f5a[\u75db\u82e6]; \u66ff\u67d0\u4eba\u4ed8\u6b3e
A1|shopping|a lot of|\u8bb8\u591a
A1|food|a cup of|\u4e00\u676f
A1|food|a glass of|\u4e00\u676f
A1|food|have dinner|\u5403\u665a\u996d
A1|food|eat out|\u5728\u5916\u5403\u996d; \u4fb5\u8680; \u9ed8\u9ed8\u5fcd\u53d7\u75db\u82e6;  \u6781\u4e3a\u60b2\u4f24
A1|food|be full|\u9971\uff1b\u5403\u9971
A1|communication|call back|\u56de\u7535\u8bdd; \u56de\u558a; \u53eb\uff08\u67d0\u4eba\uff09\u56de\u6765[\u53bb]; \u8bb0\u8d77\uff08\u67d0\u4e8b\uff09
A1|communication|listen to|\u542c\u53d6; \u542c\u4ece; \u542c\u2026\uff08\u8bb2\u8bdd\uff09; \u4f9d
A1|communication|talk to|\u540c\uff08\u67d0\u4eba\uff09\u8c08\u8bdd; \u8d23\u9a82
A1|communication|say hello to|\u5411\u2026\u8868\u793a\u95ee\u5019
A1|communication|thank you for|\u8c22\u8c22\u60a8\u7684\u597d\u610f
A2|life|wake up|\u9192\u6765; \u6d3b\u8dc3\u8d77\u6765; \u5f15\u8d77\u6ce8\u610f; \uff08\u4f7f\uff09\u8ba4\u8bc6\u5230
A2|life|clean up|\u6253\u626b; \u8d5a\u94b1; \u6574\u987f; \u75db\u6253
A2|life|get ready|\u51c6\u5907\u597d
A2|life|take care of|\u7167\u987e; \u6740\u6389; \u5bf9\u4ed8; \u62b5\u6d88
A2|life|stay up late|\u71ac\u591c; \u6df1\u591c\u4e0d\u7761\uff0c\u8fdf\u7761
A2|campus|hand in|\u4ea4\u4e0a;  \u9012\u4ea4;  \u5448\u9001; \u628a\u2026\u6276\u4e0a\u8f66
A2|campus|take notes|\u505a\u7b14\u8bb0
A2|campus|get along with|\u8fdb\u5c55; \u4e0e\u2026\u548c\u7766\u76f8\u5904
A2|campus|prepare for|\uff08\u4f7f\uff09\u4e3a\u2026\u4f5c\u51c6\u5907; \uff08\u4f7f\uff09\u5bf9\u2026\u6709\u601d\u60f3\u51c6\u5907
A2|campus|pay attention to|\u6ce8\u610f
A2|work|apply for|\u7533\u8bf7; \u58f0\u8bf7
A2|work|work on|\u4ece\u4e8b\u4e8e\u2026; \u7ee7\u7eed\u5de5\u4f5c; \u52aa\u529b\u5f71\u54cd[\u8bf4\u670d]; \u81f4\u529b\u4e8e
A2|work|be responsible for|\u4e3a\u2026\u8d1f\u8d23\uff0c\u5f62\u6210\u2026\u7684\u539f\u56e0; \u4e3b\u7ba1
A2|work|deal with|\u5e94\u4ed8;  \u5bf9\u5f85; \u60e0\u987e;  \u4e0e\u2026\u4ea4\u6613
A2|work|depend on|\u4f9d\u8d56; \u76f8\u4fe1; \u4fe1\u8d56; \u968f\u2026\u800c\u5b9a
A2|travel|arrive at|\u5230\u8fbe; \u6765\u5230; \u8fbe\u6210; \u83b7\u5f97
A2|travel|leave for|\u51fa\u53d1\u53bb\uff08\u67d0\u5730\uff09; \u79bb\u5f00\uff08\u67d0\u4eba\uff09\u4ee5\u540c\uff08\u4ed6\u4eba\uff09\u751f\u6d3b\u5728\u4e00\u8d77\uff0c \u79bb\u5f00\uff08\u67d0\u804c\u4f4d\uff09\u4ee5\u5bfb\u6c42; \u4e0a; \u5230
A2|travel|check in|\u6b7b\u53bb; \u8bb0\u5f55\uff0c\u767b\u8bb0\u7b7e\u5230; \u5f52\u8fd8\u7ecf\u767b\u8bb0\u501f\u51fa\u7684\u4e1c\u897f; \u628a\u2026\u7559\u7ed9\u5176\u4ed6\u4eba\u7167\u770b
A2|travel|set off|\u51fa\u53d1; \uff08\u4f7f\uff09\u5f00\u59cb; \u5f15\u8d77; \u70b9\u71c3
A2|travel|get back|\u56de\u6765; \u627e\u56de; \u62a5\u590d; \u56de\u5230\u2026\u4e0a\u6765
A2|social|get in touch with|\u63a5\u89e6; \u548c\u2026\u53d6\u5f97\u8054\u7cfb; \u63a5\u5934
A2|social|look forward to|\u4f01; \u671f\u671b\uff0c\u76fc\u671b; \u77a9\u671b; \u5c5e\u671b
A2|social|make friends with|\u4e0e\u2026\u4ea4\u670b\u53cb
A2|social|keep in touch|\u4fdd\u6301\u8054\u7cfb
A2|social|meet up with|\u4e0e\u2026\u4f1a\u9762
A2|health|give up|\u653e\u5f03; \u6295\u964d; \u628a\u2026\u8ba9\u7ed9; \u6212\u9664
A2|health|work out|\u89e3\u51b3; \u4f5c\u51fa; \u953b\u70bc; \u4e86\u89e3\u67d0\u4eba\u7684\u672c\u8d28
A2|health|be worried about|\u4e3a\u2026\u5fe7\u8651\uff0c\u70e6\u607c\u7684
A2|health|feel like|\u6478\u8d77\u6765\u50cf\u662f\u2026\uff0c\u6709\u2026\u7684\u611f\u89c9; \u60f3\u8981\u2026
A2|health|take a rest|\u4f11\u606f\u4e00\u4e0b
A2|technology|turn on|\u6253\u5f00\uff08\u6c34\u3001\u7535\u89c6\u3001\u6536\u97f3\u673a\u3001\u706f\u3001\u7164\u6c14\u7b49\uff09; \uff08\u4f7f\uff09\u611f\u5174\u8da3; \uff08\u4f7f\uff09\u5174\u594b; \u53d1\u52a8
A2|technology|turn off|\uff08\u628a\u2026\uff09\u5173\u6389; \u5b8c\u6210; \u89e3\u96c7; \u8f6c\u5411
A2|technology|log in|\u5f00\u59cb\u5de5\u4f5c
A2|technology|sign up|\u62a5\u540d; \u8ddf\u2026\u7b7e\u8ba2\u5408\u540c
A2|technology|look up|\u67e5\u627e; \u5411\u4e0a\u770b; \u6539\u5584; \u62dc\u8bbf\uff08\u67d0\u4eba\uff09
A2|communication|find out|\u53d1\u73b0; \u4f7f\u53d1\u4f5c; \u4f7f\u53d7\u60e9\u7f5a; \u901a\u8fc7\u63a2\u8be2[\u8bbf\u95ee]\u83b7\u6089\uff08\u67d0\u4eba\uff09\u4e0d\u5728
A2|communication|point out|\u6307\u660e; \u6307\u51fa\uff0c\u628a\u6ce8\u610f\u529b\u5f15\u5411\u2026; \u63d0\u793a; \u70b9\u660e
A2|communication|ask for|\u8bf7\u6c42\u2026;  \u8981\u6c42\u2026; \u627e\u2026; \u81ea\u627e\u9ebb\u70e6
A2|communication|reply to|\u56de\u590d\uff0c \u56de\u7b54
A2|communication|agree with|\u4e0e\u67d0\u4eba[\u89c2\u70b9]\u4e00\u81f4\uff0c \u540c\u610f[\u8d5e\u540c]\u67d0\u4eba\u7684\u610f\u89c1; \u4e0e\u2026\u76f8\u7b26\uff0c \u4e0e\u2026\u4e00\u81f4; \uff08\u6c14\u5019\u3001\u98df\u7269\u7b49\uff09\u9002\u5408\u4e8e; \u76f8
A2|study|focus on|\u81f4\u529b\u4e8e; \u4f7f\u805a\u7126\u4e8e; \u5bf9\uff08\u67d0\u4e8b\u6216\u505a\u67d0\u4e8b\uff09\u4e88\u4ee5\u6ce8\u610f; \u628a\u2026\u4f5c\u4e3a\u5174\u8da3\u4e2d\u5fc3
A2|study|make progress|\u524d\u8fdb\uff0c\u8fdb\u6b65; \u5411\u4e0a
A2|study|learn from|\u5411\u2026\u5b66\u4e60\uff0c\u4ece\u2026\u83b7\u5f97[\u5438\u53d6]; \u6548\u6cd5
A2|study|come true|\u5e94\u9a8c; \u5b9e\u73b0\uff0c\u6210\u771f
A2|study|be interested in|\u5bf9\u2026\u611f\u5174\u8da3; \u5173\u5fc3
A2|daily|run out of|\u7528\u5b8c
A2|daily|pick up|\u6361\u8d77\uff1b\u63a5\u4eba\uff1b\u5b66\u4f1a
A2|daily|put away|\u653e\u597d; \u6536\u8d77\u6765; \u50a8\u5b58; \u6253\u6d88
A2|daily|throw away|\u6254\u6389; \u6d6a\u8d39\uff0c\u9519\u8fc7; \u5c4f\u5f03; \u59d4
A2|daily|give back|\u540e\u9000; \u5f52\u8fd8\uff0c\u6062\u590d; \u4ea4\u8fd8; \u9000\u540e
B1|life|carry out|\u8fdb\u884c; \u6267\u884c; \u5b8c\u6210; \u62ac\u51fa\u53bb
B1|life|put up with|\u5c06\u5c31; \u5fcd\u53d7\uff0c\u5bb9\u5fcd; \u5bb9\u53d7; \u5fcd\u5f97\u4f4f
B1|life|come up with|\u60f3\u51fa; \u63d0\u51fa; \u8ffd\u8d76\u4e0a; \u8bbe\u6cd5\u62ff\u51fa
B1|life|get rid of|\u9664\u6389\uff0c\u53bb\u6389; \u6da4\u8361; \u9769\u9664; \u6448\u9664
B1|life|make sense|\u6709\u610f\u4e49; \u7406\u89e3; \u8bb2\u5f97\u901a; \u662f\u660e\u667a\u7684
B1|campus|take advantage of|\u5229\u7528
B1|campus|catch up with|\u8d76\u4e0a; \u8ffd\u4e0a; \u548c\u2026\u7b97\u65e7\u8d26; \u4f7f\u2026\u6700\u7ec8\u5c1d\u5230\u82e6\u679c
B1|campus|keep up with|\u7d27\u8ddf; \u8ddf\u4e0a\uff0c \u4e0d\u843d\u4eba\u4e4b\u540e; \u9f50\u80a9\u5e76\u8fdb
B1|campus|be aware of|\u610f\u8bc6\u5230
B1|campus|take responsibility for|\u5bf9\u2026\u8d1f\u8d23
B1|work|carry on|\u7ecf\u8425; \u7ee7\u7eed\u8fdb\u884c; \u4e89\u5435; \u5435\u95f9
B1|work|bring about|\u5b9e\u73b0; \u4f7f\uff08\u8239\uff09\u6389\u8f6c\u8239\u5934; \u9020\u6210\uff0c\u5f15\u8d77[\u5bfc\u81f4]\uff08\u67d0\u4e8b\uff09; \u521b\u9020
B1|work|set up|\u5efa\u7acb; \u51c6\u5907;  \u5b89\u6392; \u5f15\u8d77
B1|work|take over|\u63a5\u7ba1; \u5e26; \u5e2e\u2026\u5b66\u4e60; \u5728\u2026\u4e0a\u82b1\u8d39
B1|work|figure out|\u60f3\u51fa; \u89e3\u51b3; \u8ba1\u7b97\u51fa; \u5f04\u660e\u767d
B1|travel|check out|\u68c0\u67e5; \u5408\u683c; [\u53e3]\u770b\u770b; \u76f8\u7b49
B1|travel|look around|\u56db\u4e0b\u89c2\u671b; \uff08\u4f5c\u51fa\u9009\u62e9\u524d\uff09\u8fdb\u884c\u8c03\u67e5; \u9a8b\u76ee\u56db\u987e; \u56db\u987e
B1|travel|run into|\u5feb\u901f\u8fdb\u5165\u2026; \uff08\u4f7f\uff09\u78b0\u649e; \u9a71\u8f66\u9020\u8bbf\u2026; \u52a0\u8d77\u6765
B1|travel|come across|\u5076\u9047; \u5076\u7136\u53d1\u73b0; \u4f7f\u4ea7\u751f\u2026\u5370\u8c61
B1|travel|get around|\u7ed5\u5f00; \u4f20\u64ad; \u968f\u610f\u8d70\u8d70; \u8bf4\u670d
B1|social|bring together|\u4f7f\u76f8\u5408[\u8fde\u63a5]; \u4f7f\u76f8\u8bc6;  \u4f7f\u5750\u5728\u4e00\u8d77;  \u4f7f\u4f1a\u9762
B1|social|get along well with|\u4e0e\u2026\u76f8\u5904\u878d\u6d3d
B1|social|stand for|\u4ee3\u8868; \u4e3a\u2026\u800c\u594b\u6597; \u62e5\u62a4; \u5bb9\u5fcd
B1|social|take part in|\u53c2\u52a0\u2026\uff0c\u53c2\u4e0e\u2026\u6d3b\u52a8; \u63d2\u811a; \u5395; \u9884
B1|social|belong to|\u5c5e\u4e8e; \u662f\uff08\u67d0\u56e2\u4f53\u3001\u56fd\u5bb6\u7b49\uff09\u7684\u6210\u5458; \u5c5e\u4e8e\uff08\u67d0\u65f6\u671f\uff09; \u5f52\u4e8e
B1|environment|cut down on|\u51cf\u5c11; \u8282\u7701
B1|environment|lead to|\u5bfc\u81f4; \u628a\u2026\u5e26\u5230; \u9886\u5230; \uff08\u9053\u8def\uff09\u901a\u5411
B1|environment|result in|\u5f15\u8d77\uff0c\u5bfc\u81f4\uff0c\u4ee5\u2026\u4e3a\u7ed3\u5c40; \u843d\u5f97; \u81f4\u4f7f
B1|environment|contribute to|\u6709\u52a9\u4e8e\uff1b\u4fc3\u6210
B1|environment|deal with|\u5e94\u4ed8;  \u5bf9\u5f85; \u60e0\u987e;  \u4e0e\u2026\u4ea4\u6613
B1|opinion|point out|\u6307\u660e; \u6307\u51fa\uff0c\u628a\u6ce8\u610f\u529b\u5f15\u5411\u2026; \u63d0\u793a; \u70b9\u660e
B1|opinion|agree with|\u4e0e\u67d0\u4eba[\u89c2\u70b9]\u4e00\u81f4\uff0c \u540c\u610f[\u8d5e\u540c]\u67d0\u4eba\u7684\u610f\u89c1; \u4e0e\u2026\u76f8\u7b26\uff0c \u4e0e\u2026\u4e00\u81f4; \uff08\u6c14\u5019\u3001\u98df\u7269\u7b49\uff09\u9002\u5408\u4e8e; \u76f8
B1|opinion|disagree with|\u4e0d\u540c\u610f
B1|opinion|believe in|\u4fe1\u4ef0; \u4fe1\u8d56
B1|opinion|refer to|\u53c2\u8003; \u6307\u7684\u662f; \u6d89\u53ca; \u9002\u7528\u4e8e
B1|study|look into|\u8c03\u67e5; \u89c2\u5bdf; \u5728\u2026\u91cc\u67e5\u8d44\u6599; \u6df1\u5165\u5730\u68c0\u67e5
B1|study|put forward|\u63d0\u51fa; \u5c06\u2026\u63d0\u524d; \u5411\u524d\u79fb; \u5c06\u949f\u62e8\u5feb
B1|study|take into account|\u8003\u8651\u5230
B1|study|come to a conclusion|\u5f97\u51fa\u7ed3\u8bba
B1|study|make a difference|\u6709\u5f71\u54cd; \u8d77\uff08\u91cd\u8981\uff09\u4f5c\u7528
B1|time|as soon as|\u4e00\u2026\u5c31\u2026; \u4e00\u7ecf
B1|time|sooner or later|\u8fdf\u65e9; \u65e9\u665a\u6709\u4e00\u5929
B1|time|from time to time|\u4e0d\u65f6\uff0c\u5076\u5c14\uff0c\u95f4\u6216; \u65f6\u800c
B1|time|in the long run|\u4ece\u957f\u8fdc\u6765\u770b\uff0c \u7ec8\u7a76; \u4e00\u6765\u4e8c\u53bb; \u5f52\u6839\u5230\u5e95
B1|time|at first|\u8d77\u521d\uff0c\u5f53\u521d
B1|writing|for example|\u4f8b\u5982\uff0c \u8b6c\u5982; \u62ff ... \u6765\u8bf4
B1|writing|in addition|\u53e6\u5916\uff1b\u6b64\u5916
B1|writing|on the other hand|\u5728\u53e6\u4e00\u65b9\u9762
B1|writing|as a result|\u7ed3\u679c\uff0c \u56e0\u6b64
B1|writing|in conclusion|\u6700\u540e\uff0c\u7efc\u4e0a\u6240\u8ff0
CET4|academic|conduct a study|\u5f00\u5c55\u7814\u7a76
CET4|academic|draw a conclusion|\u5f97\u51fa\u7ed3\u8bba\uff0c\u544a\u4e00\u6bb5\u843d
CET4|academic|take measures|\u91c7\u53d6\u63aa\u65bd
CET4|academic|play a role|\u8d77\u4f5c\u7528
CET4|academic|make a contribution|\u5efa\u6811
CET4|society|give rise to|\u9020\u6210; \u5f15\u8d77\uff0c \u5bfc\u81f4
CET4|society|be attributed to|\u5f52\u4e8e
CET4|society|have access to|\u4f7f\u7528; \u63a5\u8fd1; \u53ef\u4ee5\u5229\u7528
CET4|society|be exposed to|\u906d\u53d7\uff0c\u66b4\u9732\u4e8e\u2026; \u89c1
CET4|society|take advantage of|\u5229\u7528
CET4|economy|result from|\u4ea7\u751f\u4e8e\u2026\uff0c \u7531\u2026\u5f15\u8d77
CET4|economy|account for|\u8bf4\u660e\uff08\u539f\u56e0\u3001\u7406\u7531\u7b49\uff09; \u5bfc\u81f4\uff0c\u5f15\u8d77; \uff08\u5728\u6570\u91cf\u3001\u6bd4\u4f8b\u4e0a\uff09\u5360; \u5bf9\u2026\u8d1f\u8d23
CET4|economy|invest in|\u5728\u2026\u4e0a\u6295\u8d44\uff0c\u5728\u2026\u6295\u5165\uff08\u65f6\u95f4\u3001\u7cbe\u529b\u7b49\uff09
CET4|economy|benefit from|\u53d7\u76ca; \u901a\u8fc7\u2026\u83b7\u76ca; \u5f97\u529b; \u53d7\u7528
CET4|economy|be based on|\u4ee5\u4e3a\u57fa\u7840
CET4|technology|keep pace with|\u8ddf\u4e0a
CET4|technology|be dependent on|\u4f9d\u8d56
CET4|technology|make use of|\u5229\u7528
CET4|technology|bring about|\u5b9e\u73b0; \u4f7f\uff08\u8239\uff09\u6389\u8f6c\u8239\u5934; \u9020\u6210\uff0c\u5f15\u8d77[\u5bfc\u81f4]\uff08\u67d0\u4e8b\uff09; \u521b\u9020
CET4|technology|set up|\u5efa\u7acb; \u51c6\u5907;  \u5b89\u6392; \u5f15\u8d77
CET4|environment|cope with|\u5bf9\u4ed8\u2026; \u652f\u5e94
CET4|environment|take action|\u91c7\u53d6\u884c\u52a8\uff0c\u884c\u52a8\u8d77\u6765
CET4|environment|be aware of|\u610f\u8bc6\u5230
CET4|environment|contribute to|\u6709\u52a9\u4e8e\uff1b\u4fc3\u6210
CET4|environment|cut down on|\u51cf\u5c11; \u8282\u7701
CET4|campus|adapt to|\u53d8\u5f97\u4e60\u60ef\u4e8e\u2026\uff0c \u4f7f\u9002\u5e94\u4e8e\uff0c \u80fd\u5e94\u4ed8\u2026; \u968f
CET4|campus|be engaged in|\u641e; \u4ece\u4e8b\u4e8e; \u52a1; \u5e72
CET4|campus|apply for|\u7533\u8bf7; \u58f0\u8bf7
CET4|campus|be qualified for|\u6709\u2026\u7684\u8d44\u683c\uff0c\u9002\u4e8e\u62c5\u4efb\u2026
CET4|campus|specialize in|\u4e13\u4fee; \u4e13\u653b\uff0c\u7cbe\u901a\uff0c\u4ee5\u2026\u4e3a\u4e13\u4e1a
CET4|opinion|in terms of|\u6839\u636e; \u7528\u2026\u7684\u8bdd; \u5c31\u2026\u800c\u8a00; \u4ee5\u2026\u4e3a\u5355\u4f4d
CET4|opinion|with regard to|\u5173\u4e8e
CET4|opinion|on the contrary|\uff08\u4e0e\u6b64\uff09\u76f8\u53cd\uff0c \u6b63\u76f8\u53cd; \u53cd\u5012; \u53cd\u800c
CET4|opinion|in contrast|\u76f8\u6bd4\u4e4b\u4e0b
CET4|opinion|to some extent|\u6709\u6240; \u67d0\u79cd\u7a0b\u5ea6\u4e0a\uff0c\uff08\u591a\u5c11\uff09\u6709\u4e00\u70b9
CET4|writing|in addition to|\u9664\u2026\u4e4b\u5916
CET4|writing|due to|\u7531\u4e8e; \u56e0\u4e3a; \u6b20\u4e0b\u503a[\u8d26]\uff0c\u5e94\u7ed9\u4e88; \u5e94\u5f52\u4e8e
CET4|writing|as a consequence|\u56e0\u800c\uff0c\u7ed3\u679c
CET4|writing|for the sake of|\u4e3a\u4e86
CET4|writing|in response to|\u5bf9\u2026\u505a\u51fa\u53cd\u5e94
CET4|workplace|take responsibility for|\u5bf9\u2026\u8d1f\u8d23
CET4|workplace|be committed to|\u732e\u8eab\u4e8e\uff0c\u81f4\u529b\u4e8e; \uff08\u540e\u63a5\u540d\u8bcd\u6216\u52a8\u540d\u8bcd\uff0cto\u662f\u4ecb\u8bcd\uff09
CET4|workplace|work out|\u89e3\u51b3; \u4f5c\u51fa; \u953b\u70bc; \u4e86\u89e3\u67d0\u4eba\u7684\u672c\u8d28
CET4|workplace|carry out|\u8fdb\u884c; \u6267\u884c; \u5b8c\u6210; \u62ac\u51fa\u53bb
CET4|workplace|put forward|\u63d0\u51fa; \u5c06\u2026\u63d0\u524d; \u5411\u524d\u79fb; \u5c06\u949f\u62e8\u5feb
CET4|exam|distinguish between|\u8fa8\u522b\uff0c\u8bc6\u522b\uff08\u4e24\u8005\uff09\u4e4b\u95f4\u7684\u4e0d\u540c; \u8fa8\u660e
CET4|exam|refer to|\u53c2\u8003; \u6307\u7684\u662f; \u6d89\u53ca; \u9002\u7528\u4e8e
CET4|exam|account for|\u8bf4\u660e\uff08\u539f\u56e0\u3001\u7406\u7531\u7b49\uff09; \u5bfc\u81f4\uff0c\u5f15\u8d77; \uff08\u5728\u6570\u91cf\u3001\u6bd4\u4f8b\u4e0a\uff09\u5360; \u5bf9\u2026\u8d1f\u8d23
CET4|exam|give an example of|\u4e3e\u4f8b\u8bf4\u660e
CET4|exam|draw a distinction|\u533a\u5206\uff1b\u533a\u522b
`;
function phraseCollocationHints(phrase, theme) {
  const lower = String(phrase || '').toLowerCase();
  const themeName = phraseThemeLabels[theme] || theme;
  const verbLike = /^(be|get|go|take|have|do|make|look|pay|work|come|put|give|keep|carry|set|turn|find|point|ask|reply|apply|deal|depend|arrive|leave|check|run|bring|stand|belong|cut|lead|result|contribute|disagree|believe|refer|conduct|draw|play|invest|benefit|cope|adapt|specialize|distinguish|focus|learn|agree|feel|try|call|listen|talk|say|thank|wake|clean|prepare|meet|log|sign|watch|walk|read|write|study|move|change|start|finish|open|close|send|hold|pick|throw|catch|rely|help|wait|live|spend)/.test(lower);
  const structure = verbLike ? '\u52a8\u8bcd + \u65f6\u95f4\u3001\u5730\u70b9\u6216\u5bbe\u8bed' : '\u56fa\u5b9a\u8868\u8fbe + \u8bed\u5883\u6216\u540d\u8bcd';
  return [`\u5e38\u89c1\u4e3b\u9898\uff1a${themeName}`, `\u7ed3\u6784\uff1a${structure}`];
}

function phraseExample(phrase, theme) {
  const themeName = phraseThemeLabels[theme] || theme;
  return `I can use "${phrase}" when I talk about ${themeName}.`;
}
function phraseExampleZh(phrase, meaning, theme) {
  const themeName = phraseThemeLabels[theme] || theme;
  return `\u8c08\u8bba${themeName}\u65f6\u53ef\u4ee5\u4f7f\u7528\u8bcd\u7ec4\u201c${phrase}\u201d\uff0c\u610f\u601d\u662f\u201c${meaning}\u201d\u3002`;
}
const phraseSeeds = phraseRows.trim().split(/\r?\n/).filter(Boolean).map((row, index) => {
  const [level, theme, phrase, meaningZh] = row.split('|');
  const usage = phraseUsageOverrides[phrase.toLowerCase()] || {};
  return { id: `phrase-${index + 1}`, level, theme, phrase, meaningZh, collocations: usage.collocations || phraseCollocationHints(phrase, theme), example: usage.example || phraseExample(phrase, theme), exampleZh: usage.exampleZh || phraseExampleZh(phrase, meaningZh, theme) };
});
