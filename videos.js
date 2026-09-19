'use strict';
const videoCatalog = {
  clauses: { bvid: 'BV1764y1f7nq', page: 2, title: '所有英语从句合集', teacher: '英语兔', source: 'https://www.bilibili.com/video/BV1764y1f7nq' },
  rabbitGrammar: { bvid: 'BV1XY411J7aG', page: 2, title: '英语语法精讲合集', teacher: '英语兔', source: 'https://www.bilibili.com/video/BV1XY411J7aG' }
};
const lessonVideos = {
  sentence: { bvid: 'BV1ZT411c7WP', page: 1, title: '英语基本句子结构：主语与谓语', teacher: '一英儿', note: '基本句子结构和主语、谓语位置', source: 'https://www.bilibili.com/video/BV1ZT411c7WP' },
  pronoun: { bvid: 'BV1vP4y157Mp', page: 1, title: '英语语法：人称代词与物主代词', teacher: '英语兔', note: '人称代词、物主代词和指示代词', source: 'https://www.bilibili.com/video/BV1vP4y157Mp' },
  be: { bvid: 'BV1csmGYwE9A', page: 1, title: 'be 动词 am / is / are 基本用法', teacher: '温州浪叶轩', note: 'be 动词的基本用法', source: 'https://www.bilibili.com/video/BV1csmGYwE9A' },
  article: { bvid: 'BV11g41157FC', page: 1, title: '英语语法：不定冠词、定冠词与零冠词', teacher: '英语兔', note: 'a / an / the 的完整用法', source: 'https://www.bilibili.com/video/BV11g41157FC' },
  plural: { bvid: 'BV1tQ4y1r7NC', page: 1, title: '英语语法：名词与单复数', teacher: '英语兔', note: '可数名词、不可数名词及单复数变化', source: 'https://www.bilibili.com/video/BV1tQ4y1r7NC' },
  demonstrative: { bvid: 'BV14v411v7Bp', page: 1, title: 'this / that / these / those 的用法', teacher: '沙杰瑞', note: '四种指示代词的区别', source: 'https://www.bilibili.com/video/BV14v411v7Bp' },
  therebe: { bvid: 'BV1Li4y127XC', page: 1, title: 'There be 句型详解', teacher: '英语语法课堂', note: 'There is / There are 句型', source: 'https://www.bilibili.com/video/BV1Li4y127XC' },
  havehas: { bvid: 'BV1ha411p7RY', page: 1, title: 'have / has 巧记口诀', teacher: '英语雪梨老师', note: 'have 与 has 的用法和区别', source: 'https://www.bilibili.com/video/BV1ha411p7RY' },
  present: { bvid: 'BV1gG4y167y7', page: 1, title: '一般现在时：肯定句与基本句型', teacher: '英语Winter老师', note: '一般现在时的肯定句结构', source: 'https://www.bilibili.com/video/BV1gG4y167y7' },
  presentneg: { bvid: 'BV1gG4y167y7', page: 1, title: '一般现在时：否定句与疑问句', teacher: '英语Winter老师', note: '肯定句、否定句和一般疑问句', source: 'https://www.bilibili.com/video/BV1gG4y167y7' },
  frequency: { bvid: 'BV1VA411Y7WH', page: 1, title: '英语中的频率副词', teacher: '善恩英语', note: 'always / often / sometimes / never 等频率副词', source: 'https://www.bilibili.com/video/BV1VA411Y7WH' },
  continuous: { bvid: 'BV14J411W7FQ', page: 1, title: '现在进行时专题', teacher: '我是波波老师呐', note: 'be + doing 结构和使用场景', source: 'https://www.bilibili.com/video/BV14J411W7FQ' },
  can: { bvid: 'BV1834y1r79u', page: 1, title: '英语助动词与情态动词：can', teacher: '英语兔', note: 'can 表示能力、许可和可能性', source: 'https://www.bilibili.com/video/BV1834y1r79u' },
  modal: { bvid: 'BV1Lp4y157h2', page: 1, title: '情态动词 must / should 用法', teacher: '英语Winter老师', note: 'must、should 等情态动词的结构与区别', source: 'https://www.bilibili.com/video/BV1Lp4y157h2' },
  preposition: { bvid: 'BV1NJ411Q7Jf', page: 1, title: '英语介词用法总结', teacher: '我是波波老师呐', note: '时间、地点等常见介词搭配', source: 'https://www.bilibili.com/video/BV1NJ411Q7Jf' },
  pastbe: { bvid: 'BV1Li421f7Kt', page: 1, title: '一般过去时：was / were', teacher: '爪爪老斯的英语方法', note: '一般过去时的结构和 be 动词变化', source: 'https://www.bilibili.com/video/BV1Li421f7Kt' },
  pastregular: { bvid: 'BV1pK4y1g7Ug', page: 1, title: '一般过去时：规则动词变化', teacher: 'Addy老师', note: '规则动词加 -ed 的变化规则', source: 'https://www.bilibili.com/video/BV1pK4y1g7Ug' },
  pastirregular: { bvid: 'BV1ko4y1b7cm', page: 1, title: '常用不规则动词过去式', teacher: '思文人英语', note: '常见不规则动词过去式和过去分词', source: 'https://www.bilibili.com/video/BV1ko4y1b7cm' },
  future: { bvid: 'BV1cz4y1v7E3', page: 1, title: 'will 与 be going to 的区别', teacher: '灰叔英语课', note: '一般将来时的两种常见表达', source: 'https://www.bilibili.com/video/BV1cz4y1v7E3' },
  comparative: { bvid: 'BV1244y1h77h', page: 1, title: '英语形容词比较级', teacher: '英语兔', note: '形容词比较级和最高级', source: 'https://www.bilibili.com/video/BV1244y1h77h' },
  'cet-tenses': { bvid: 'BV1Sv411y7d8', page: 1, title: '英语16种时态详解', teacher: '英语兔', note: '一般、进行、完成时态综合对比', source: 'https://www.bilibili.com/video/BV1Sv411y7d8' },
  'cet-passive': { bvid: 'BV1dr4y1K7uv', page: 1, title: '英语语法：被动语态', teacher: '英语兔', note: '被动语态的结构和使用场景', source: 'https://www.bilibili.com/video/BV1dr4y1K7uv' },
  'cet-nonfinite': { bvid: 'BV1eo4y1x7ko', page: 1, title: '谓语与非谓语动词', teacher: '英语老师晓艳', note: '晓艳老师讲解谓语与非谓语的区别', source: 'https://www.bilibili.com/video/BV1eo4y1x7ko' },
  'cet-relative': Object.assign({}, videoCatalog.clauses, { page: 3, title: '定语从句专题', note: 'who / which / that / whose / where' }),
  'cet-nounclause': Object.assign({}, videoCatalog.clauses, { page: 2, title: '名词性从句专题', note: '主语从句、宾语从句、表语从句和同位语从句' }),
  'cet-adverbial': Object.assign({}, videoCatalog.clauses, { page: 9, title: '状语从句专题', note: '时间、原因、条件、让步等状语从句' }),
  'cet-condition': { bvid: 'BV1bt4y1S779', page: 1, title: '英语虚拟语气', teacher: '英语兔', note: '条件句和虚拟语气', source: 'https://www.bilibili.com/video/BV1bt4y1S779' },
  'cet-modalperfect': { bvid: 'BV1Bu4y1D7de', page: 1, title: '情态动词 + have + 过去分词', teacher: '英语Winter老师', note: 'must / may / could have done 等推测结构', source: 'https://www.bilibili.com/video/BV1Bu4y1D7de' },
  'cet-inversion': Object.assign({}, videoCatalog.rabbitGrammar, { page: 25, title: '倒装与强调', note: '倒装句结构；强调结构见同一合集第26节' }),
  'cet-longsentence': { bvid: 'BV1NK411D7pr', page: 1, title: '英语长难句分析方法', teacher: '英语李辉老师', note: '主句、从句、非谓语和逻辑连接拆分', source: 'https://www.bilibili.com/video/BV1NK411D7pr' }
};