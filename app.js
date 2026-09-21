'use strict';

const STORAGE = {
  settings: 'english-learning:v1:settings',
  progress: 'english-learning:v1:progress',
  vocabulary: 'english-learning:v1:vocabulary',
  articles: 'english-learning:v1:articles',
  wordData: 'english-learning:v1:word-data',
  practice: 'english-learning:v1:practice',
  wrongBook: 'english-learning:v1:wrong-book',
  writing: 'english-learning:v1:writing',
  memory: 'english-learning:v1:memory'
};
const DAY = 24 * 60 * 60 * 1000;
const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalizeWord = value => String(value || '').toLowerCase().replace(/^[^a-z]+|[^a-z']+$/g, '').replace(/'s$/, '');
const clone = value => JSON.parse(JSON.stringify(value));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch (error) {
    console.warn('读取本地数据失败', key, error);
    return clone(fallback);
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    showToast('浏览器存储空间不足，数据未能保存');
    console.warn('保存本地数据失败', key, error);
  }
}
function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const dictionary = {
  i: '我', you: '你；你们', he: '他', she: '她', it: '它', we: '我们', they: '他们；她们；它们',
  me: '我（宾格）', him: '他（宾格）', her: '她；她的', us: '我们（宾格）', them: '他们（宾格）',
  my: '我的', your: '你的；你们的', his: '他的', our: '我们的', their: '他们的',
  am: '是（用于 I）', is: '是；在', are: '是；在', was: '是（过去式）', were: '是（过去式）',
  be: '是；成为', have: '有', has: '有（第三人称单数）', had: '有（过去式）', do: '做；助动词',
  does: '做；助动词（第三人称单数）', did: '做；助动词（过去式）', can: '能；会', cannot: '不能',
  must: '必须', should: '应该', will: '将；会', going: '去；将要', would: '会；愿意',
  a: '一个；一', an: '一个；一', the: '这；那；这些；那些',
  this: '这个', that: '那个', these: '这些', those: '那些', there: '那里；有（there be）',
  student: '学生', students: '学生们', teacher: '老师', classroom: '教室', school: '学校；上学',
  book: '书', books: '书（复数）', English: '英语', class: '班级；课', lesson: '课；课程',
  homework: '家庭作业', desk: '书桌', pen: '钢笔', pencil: '铅笔', paper: '纸', question: '问题',
  answer: '答案；回答', word: '词；单词', sentence: '句子', grammar: '语法', language: '语言',
  friend: '朋友', friends: '朋友们', family: '家庭；家人', brother: '兄弟', sister: '姐妹',
  mother: '母亲', father: '父亲', parent: '父亲或母亲', parents: '父母', child: '孩子',
  children: '孩子们', boy: '男孩', girl: '女孩', man: '男人', woman: '女人', people: '人们',
  home: '家；在家', house: '房子', room: '房间', kitchen: '厨房', park: '公园', town: '城镇',
  city: '城市', street: '街道', shop: '商店', cafe: '咖啡馆', restaurant: '餐馆', museum: '博物馆',
  library: '图书馆', office: '办公室', hospital: '医院', station: '车站', airport: '机场',
  car: '汽车', bus: '公共汽车', train: '火车', bike: '自行车', plane: '飞机', ticket: '票',
  bag: '包', phone: '电话；手机', computer: '电脑', table: '桌子', chair: '椅子', window: '窗户',
  door: '门', garden: '花园', flower: '花', tree: '树', dog: '狗', cat: '猫', animal: '动物',
  food: '食物', apple: '苹果', apples: '苹果（复数）', bread: '面包', rice: '米饭', water: '水',
  tea: '茶', coffee: '咖啡', milk: '牛奶', breakfast: '早餐', lunch: '午餐', dinner: '晚餐',
  day: '天；白天', today: '今天', tomorrow: '明天', yesterday: '昨天', morning: '早晨',
  afternoon: '下午', evening: '晚上', night: '夜晚', week: '星期；周', weekend: '周末',
  month: '月', year: '年', time: '时间', hour: '小时', minute: '分钟',
  good: '好的', bad: '坏的', happy: '开心的', sad: '难过的', big: '大的', small: '小的',
  new: '新的', old: '旧的；年老的', young: '年轻的', clean: '干净的', busy: '忙碌的',
  easy: '容易的', difficult: '困难的', important: '重要的', interesting: '有趣的',
  beautiful: '美丽的', ready: '准备好的', tired: '疲倦的', hungry: '饥饿的', great: '很棒的',
  red: '红色的', blue: '蓝色的', green: '绿色的', yellow: '黄色的',
  read: '读；阅读', reads: '读（第三人称单数）', reading: '阅读', write: '写', speak: '说',
  say: '说', tell: '告诉', listen: '听', look: '看', see: '看见', watch: '观看',
  learn: '学习', study: '学习', teach: '教', play: '玩；演奏', work: '工作', live: '居住',
  like: '喜欢', love: '爱；喜爱', want: '想要', need: '需要', help: '帮助', make: '制作',
  take: '拿；乘坐', get: '得到；到达', give: '给', come: '来', go: '去', walk: '走路',
  run: '跑', eat: '吃', drink: '喝', sleep: '睡觉', buy: '买', visit: '参观；拜访',
  meet: '遇见；见面', enjoy: '享受', start: '开始', finish: '完成', practice: '练习',
  learn: '学习', learning: '学习', understand: '理解', remember: '记得', forget: '忘记',
  play: '玩；演奏', playing: '正在玩；演奏', studying: '正在学习', working: '正在工作',
  reading: '正在读；阅读', writing: '正在写', speaking: '正在说', watching: '正在看',
  playing: '正在玩', visiting: '正在参观', walking: '正在走路', learning: '正在学习',
  played: '玩过；玩（过去式）', watched: '观看（过去式）', worked: '工作（过去式）',
  studied: '学习（过去式）', visited: '参观（过去式）', walked: '走路（过去式）',
  went: '去（过去式）', saw: '看见（过去式）', ate: '吃（过去式）', came: '来（过去式）',
  met: '遇见（过去式）', got: '得到（过去式）', made: '制作（过去式）', took: '拿；乘坐（过去式）',
  usually: '通常', often: '经常', always: '总是', sometimes: '有时', never: '从不',
  now: '现在', soon: '很快', here: '这里', very: '非常', too: '也；太', also: '也',
  and: '和；并且', but: '但是', or: '或者', because: '因为', so: '所以', before: '在……之前',
  after: '在……之后', with: '和……一起', without: '没有', about: '关于', for: '为了；给',
  from: '来自', to: '到；向', in: '在……里面', on: '在……上面；在（某天）', at: '在（某地/某时）',
  under: '在……下面', near: '在……附近', between: '在……之间', into: '进入', over: '在……上方',
  every: '每一个', all: '全部', many: '许多', much: '许多；很', some: '一些', any: '任何；一些',
  one: '一；一个', two: '二；两个', three: '三；三个', four: '四；四个', five: '五；五个',
  first: '第一；首先', next: '下一个', last: '最后的；上一个', more: '更多；更',
  most: '最多；最', than: '比', better: '更好的', best: '最好的', bigger: '更大的',
  smaller: '更小的', cleaner: '更干净的', busier: '更忙碌的', easier: '更容易的',
  happier: '更开心的', because: '因为', when: '当……时', if: '如果', yes: '是的',
  no: '不；不是', not: '不', very: '非常', really: '真正地', together: '一起',
  again: '再次', only: '仅仅', just: '刚刚；只是', still: '仍然', well: '好地', much: '很多；非常',
  idea: '想法；主意', life: '生活；生命', world: '世界', music: '音乐', movie: '电影',
  game: '游戏；比赛', picture: '图片；照片', color: '颜色', morning: '早晨', night: '夜晚',
  anna: '安娜（人名）', lily: '莉莉（人名）', tom: '汤姆（人名）', ben: '本（人名）',
  mia: '米娅（人名）', jack: '杰克（人名）', lucy: '露西（人名）', david: '大卫（人名）'
};
const aliases = {
  "'m": 'am', "'re": 'are', "'s": 'is', is: 'am', are: 'am', was: 'am', were: 'am',
  does: 'do', did: 'do', has: 'have', had: 'have', reads: 'read', studies: 'study',
  played: 'play', watched: 'watch', worked: 'work', visited: 'visit', walked: 'walk',
  went: 'go', saw: 'see', ate: 'eat', came: 'come', met: 'meet', got: 'get', made: 'make',
  took: 'take', better: 'good', best: 'good', bigger: 'big', smaller: 'small',
  cleaner: 'clean', busier: 'busy', easier: 'easy', happier: 'happy'
};
const phonetics = {
  student: '/ˈstjuːdənt/', teacher: '/ˈtiːtʃə(r)/', book: '/bʊk/', English: '/ˈɪŋɡlɪʃ/',
  grammar: '/ˈɡræmə(r)/', language: '/ˈlæŋɡwɪdʒ/', friend: '/frend/', family: '/ˈfæməli/',
  read: '/riːd/', write: '/raɪt/', speak: '/spiːk/', learn: '/lɜːn/', study: '/ˈstʌdi/',
  play: '/pleɪ/', work: '/wɜːk/', live: '/lɪv/', like: '/laɪk/', love: '/lʌv/',
  happy: '/ˈhæpi/', beautiful: '/ˈbjuːtɪfl/', important: '/ɪmˈpɔːtnt/', together: '/təˈɡeðə(r)/'
};
const mcq = (q, options, answer, explain) => ({ q, options, answer, explain });
const fill = (q, answer, explain, hint = '') => ({ q, answer, explain, hint });
const translate = (zh, answer, accepts = []) => ({ zh, answer, accepts });
const ex = (en, zh, note, good = true) => ({ en, zh, note, good });

const lessonList = [
  {
    id: 'sentence', num: 1, group: '句子基础', title: '英语句子：主语和谓语', subtitle: '看懂句子的第一步',
    summary: '英语句子先找“谁/什么”和“做什么/是什么”。主语是句子的主角，谓语说明主角做什么或处于什么状态。',
    formula: '主语 + 谓语 + 其他成分', cues: ['am', 'is', 'are', 'has', 'read', 'lives'],
    rules: [['主语', '说明句子在讲谁或什么，通常是名词、代词或名词短语。'], ['谓语', '说明主语的动作或状态。一个完整句子通常必须有谓语。'], ['语序', '英语常按“主语—谓语—其他”排列，不要直接把中文逐字翻译。']],
    examples: [ex('I am a student.', '我是一名学生。', 'I 是主语，am 是谓语。'), ex('Anna reads English every day.', '安娜每天读英语。', 'Anna 是主语，reads 是谓语。'), ex('The book is on the desk.', '书在书桌上。', 'The book 是主语，is 是谓语。')],
    mistakes: ['中文常说“我有”，英语不能说 I have 吗？可以，但主语和谓语顺序要完整。', '不要忘记 be 动词：He happy 应改为 He is happy。'],
    mcq: [mcq('哪一个是完整句子？', ['I a student.', 'I am a student.', 'Am a student I.'], 1, '英语标准语序是主语 + be 动词 + 表语。'), mcq('句中“Anna”最可能是什么成分？', ['主语', '谓语', '宾语'], 0, 'Anna 是动作 reads 的执行者，所以是主语。'), mcq('“我喜欢英语。”应表达为：', ['I like English.', 'Like I English.', 'I English like.'], 0, '主语 I 在前，谓语 like 在后。')],
    fill: [fill('I ___ a student.', 'am', '主语 I 后面用 am。', 'be 动词'), fill('She ___ English every day.', 'reads', 'she 是第三人称单数，read 加 s。', '一般现在时'), fill('The book ___ on the desk.', 'is', '单数主语 the book 用 is。', 'be 动词')],
    translations: [translate('他是我的老师。', 'He is my teacher.'), translate('我们每天学习英语。', 'We study English every day.')]
  },
  {
    id: 'pronoun', num: 2, group: '句子基础', title: '人称代词与物主形容词', subtitle: 'I / you / he / my / your',
    summary: '人称代词代替人、物或一群人；物主形容词表示“谁的”，后面必须接名词。',
    formula: '主格主语 + 谓语；物主形容词 + 名词', cues: ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their'],
    rules: [['主格', 'I, you, he, she, it, we, they 通常放在动词前作主语。'], ['物主形容词', 'my, your, his, her, our, their 表示所属关系，后面必须接名词。'], ['性别', 'he/his 对应男性，she/her 对应女性，it/its 通常指物或动物。']],
    examples: [ex('He is my brother.', '他是我的兄弟。', 'He 是主语，my 修饰 brother。'), ex('They live near our school.', '他们住在我们学校附近。', 'They 是主语，our 修饰 school。'), ex('Her name is Lily.', '她的名字是莉莉。', 'Her 表示“她的”。')],
    mistakes: ['I 和 my 都能表示“我”，但 I 作主语，my 后面接名词。', '不要把 he 用在女性身上；女性主语用 she。'],
    mcq: [mcq('___ am a student.', ['I', 'My', 'Me'], 0, '句子主语用主格 I。'), mcq('This is ___ book.（她的）', ['she', 'her', 'hers'], 1, '名词 book 前用物主形容词 her。'), mcq('Tom and Jack are brothers. ___ are students.', ['He', 'They', 'We'], 1, '两个人用 they。')],
    fill: [fill('___ is my teacher.（他）', 'He', '男性单数主语用 He。', '主格'), fill('This is ___ school.（我们的）', 'our', '表示“我们的”且后面接名词。', '物主形容词'), fill('___ name is Lily.（她的）', 'Her', '女性所属关系用 Her。', '物主形容词')],
    translations: [translate('她是我姐姐。', 'She is my sister.'), translate('我们的教室很干净。', 'Our classroom is clean.')]
  },
  {
    id: 'be', num: 3, group: '句子基础', title: 'be 动词', subtitle: 'am / is / are 的基本用法',
    summary: 'be 动词可以表示“是、在、处于某种状态”。记住口诀：I 用 am，you 用 are，is 连着他她它，复数全部都用 are。',
    formula: '主语 + am / is / are + 表语或地点', cues: ['am', 'is', 'are'],
    rules: [['I', 'I 后面用 am：I am happy.'], ['单数', 'he、she、it 和单数名词后用 is：She is a teacher.'], ['复数', 'you、we、they 和复数名词后用 are：They are ready.']],
    examples: [ex('I am at home.', '我在家。', 'I + am。'), ex('The classroom is clean.', '教室很干净。', '单数主语 + is。'), ex('We are ready for class.', '我们准备好上课了。', 'We + are。')],
    mistakes: ['He happy 缺少 be 动词，应说 He is happy。', 'I is 搭配错误，I 只能配 am。'],
    mcq: [mcq('I ___ a student.', ['am', 'is', 'are'], 0, 'I 搭配 am。'), mcq('The students ___ in the classroom.', ['am', 'is', 'are'], 2, 'students 是复数，用 are。'), mcq('My mother ___ at home.', ['am', 'is', 'are'], 1, '单数主语 my mother 用 is。')],
    fill: [fill('You ___ my friend.', 'are', 'You 搭配 are。', 'be 动词'), fill('It ___ a small dog.', 'is', 'It 搭配 is。', 'be 动词'), fill('Lily and I ___ ready.', 'are', '两个人是复数，用 are。', 'be 动词')],
    translations: [translate('他在教室里。', 'He is in the classroom.'), translate('我们很开心。', 'We are happy.')]
  },
  {
    id: 'article', num: 4, group: '名词系统', title: '冠词 a / an / the', subtitle: '什么时候加 a、an、the',
    summary: 'a/an 表示第一次提到的一个，the 表示双方都知道或再次提到的特定对象。an 用在元音音素开头的单词前。',
    formula: 'a / an + 可数名词单数；the + 特定名词', cues: ['a', 'an', 'the'],
    rules: [['a', '辅音音素开头的单数可数名词前用 a：a book。'], ['an', '元音音素开头的单数可数名词前用 an：an apple。'], ['the', '双方都知道、独一无二或再次提到的对象用 the：the sun。']],
    examples: [ex('I have a book.', '我有一本书。', '第一次提到 book，用 a。'), ex('She eats an apple.', '她吃一个苹果。', 'apple 以元音音素开头，用 an。'), ex('The book is new.', '那本书是新的。', '再次提到同一本书，用 the。')],
    mistakes: ['不要看字母判断 an；要看发音。an hour 的 h 不发音，所以用 an。', '一个可数名词单数通常不能单独出现，要说 a book 或 the book。'],
    mcq: [mcq('I have ___ apple.', ['a', 'an', 'the'], 1, 'apple 以元音音素开头，用 an。'), mcq('This is ___ book. ___ book is new.', ['a, A', 'a, The', 'the, A'], 1, '首次提到用 a，再次提到用 the。'), mcq('She is ___ teacher.', ['a', 'an', 'the'], 0, 'teacher 以辅音音素开头，用 a。')],
    fill: [fill('He has ___ English book.', 'an', 'English 以元音音素开头。', '冠词'), fill('I see ___ cat. ___ cat is black.', 'a; The', '第一次用 a，再次提到用 the。', '冠词'), fill('Please close ___ door.', 'the', '双方都知道的那扇门用 the。', '特指')],
    translations: [translate('我有一本书。', 'I have a book.'), translate('苹果在桌子上。', 'The apple is on the table.')]
  },
  {
    id: 'plural', num: 5, group: '名词系统', title: '名词单复数', subtitle: 'book → books',
    summary: '英语中两个或更多的人或物通常要用名词复数。规则变化一般加 -s 或 -es，还有一些常见不规则变化。',
    formula: '数量 + 可数名词复数；one + 单数 / two + 复数', cues: ['books', 'students', 'friends', 'apples', 'cars', 'children', 'people'],
    rules: [['一般加 -s', 'book → books，student → students。'], ['加 -es', '以 s、x、ch、sh 结尾常加 -es：box → boxes。'], ['不规则', 'man → men，woman → women，child → children，person → people。']],
    examples: [ex('I have two books.', '我有两本书。', 'two 后面用复数 books。'), ex('There are three children.', '有三个孩子。', 'child 的复数是 children。'), ex('Many people like music.', '很多人喜欢音乐。', 'people 本身是复数。')],
    mistakes: ['two book 错误，应说 two books。', '不要把所有复数都直接加 s，注意 children、people 等不规则形式。'],
    mcq: [mcq('I can see three ___.', ['book', 'books', 'a book'], 1, 'three 后面的可数名词用复数。'), mcq('child 的复数是：', ['childs', 'children', 'childes'], 1, 'child 是不规则变化。'), mcq('“许多学生”应表达为：', ['many student', 'many students', 'much students'], 1, 'many 修饰可数名词复数。')],
    fill: [fill('There are two ___.（book）', 'books', 'two 后面用复数。', '名词复数'), fill('I have three ___.（apple）', 'apples', '一般名词加 s。', '名词复数'), fill('The ___ are playing.（child）', 'children', 'child 的复数是不规则形式。', '不规则复数')],
    translations: [translate('我有三个朋友。', 'I have three friends.'), translate('这些学生很开心。', 'These students are happy.')]
  },
  {
    id: 'demonstrative', num: 6, group: '名词系统', title: 'this / that / these / those', subtitle: '近远与单复数的指示词',
    summary: 'this/that 指单数，these/those 指复数；this/these 常指离说话人近的人或物，that/those 指较远的人或物。',
    formula: 'this / that + 单数名词；these / those + 复数名词', cues: ['this', 'that', 'these', 'those'],
    rules: [['近处单数', 'this book 这本书。'], ['远处单数', 'that book 那本书。'], ['复数', 'these books 这些书；those books 那些书。']],
    examples: [ex('This is my pen.', '这是我的钢笔。', '单数且离说话人近。'), ex('Those are beautiful flowers.', '那些是美丽的花。', '复数且在远处。'), ex('These books are new.', '这些书是新的。', 'these 后面接复数名词和 are。')],
    mistakes: ['these 后面不能接单数名词。', 'This are 错误，this 是单数，应搭配 is。'],
    mcq: [mcq('___ is my book.', ['This', 'These', 'Those'], 0, 'book 是单数，用 This is。'), mcq('___ are my friends.', ['This', 'That', 'These'], 2, 'friends 是复数，用 These。'), mcq('“那辆车”应表达为：', ['this car', 'that car', 'these car'], 1, '远处的单数用 that。')],
    fill: [fill('___ is a cat.（这个）', 'This', '单数近处用 This。', '指示词'), fill('___ books are mine.（那些）', 'Those', '复数远处用 Those。', '指示词'), fill('___ flowers are beautiful.（这些）', 'These', '复数近处用 These。', '指示词')],
    translations: [translate('这是我的教室。', 'This is my classroom.'), translate('那些学生很开心。', 'Those students are happy.')]
  },
  {
    id: 'therebe', num: 7, group: '句子基础', title: 'There be 句型', subtitle: '某处有某物',
    summary: 'There be 表示“某处有某物”。be 动词根据后面第一个名词的单复数选择 is 或 are。',
    formula: 'There is + 单数 / 不可数；There are + 复数', cues: ['there', 'is', 'are', 'some', 'many'],
    rules: [['单数', 'There is a book on the desk.'], ['复数', 'There are two books on the desk.'], ['就近原则', 'There is a pen and two books. 看离 There be 最近的 a pen。']],
    examples: [ex('There is a park near my home.', '我家附近有一个公园。', 'a park 是单数，用 is。'), ex('There are many students in the classroom.', '教室里有很多学生。', 'students 是复数，用 are。'), ex('Is there a library here?', '这里有图书馆吗？', '一般疑问句把 is 提前。')],
    mistakes: ['There have 不是标准英语，表示“有”通常用 There is/are。', 'There are a book 错误，单数用 There is。'],
    mcq: [mcq('There ___ a book on the desk.', ['is', 'are', 'have'], 0, 'a book 是单数，用 is。'), mcq('There ___ many people in the park.', ['is', 'are', 'has'], 1, 'people 是复数，用 are。'), mcq('“这里有一个苹果。”应表达为：', ['There is an apple here.', 'There are an apple here.', 'Here has an apple.'], 0, '单数可数名词用 There is。')],
    fill: [fill('___ a cat under the table.', 'There is', '单数 a cat 用 There is。', 'There be'), fill('___ three books on the desk.', 'There are', 'three books 是复数。', 'There be'), fill('___ there a hospital near here?', 'Is', '疑问句将 is 提前。', '一般疑问句')],
    translations: [translate('桌子上有一本书。', 'There is a book on the table.'), translate('公园里有很多孩子。', 'There are many children in the park.')]
  },
  {
    id: 'havehas', num: 8, group: '动词与时态', title: 'have / has', subtitle: '表示拥有和经历',
    summary: 'have 表示“有”，主语是 I、you、we、they 或复数时用 have；he、she、it 或单数名词后用 has。',
    formula: 'I / you / we / they + have；he / she / it + has', cues: ['have', 'has', 'do', 'does'],
    rules: [['have', 'I have a bike. They have two children.'], ['has', 'He has a bike. The dog has a name.'], ['否定和疑问', '用 do/does 帮助：I do not have...; Does she have...?']],
    examples: [ex('I have a new phone.', '我有一部新手机。', '主语 I 用 have。'), ex('She has a beautiful garden.', '她有一个美丽的花园。', '主语 she 用 has。'), ex('Do you have a pen?', '你有钢笔吗？', '疑问句用 Do you have...?')],
    mistakes: ['She have 错误，应说 She has。', 'Does she has 错误，助动词 does 后的动词用原形 have。'],
    mcq: [mcq('She ___ a red bag.', ['have', 'has', 'is'], 1, 'she 是第三人称单数，用 has。'), mcq('They ___ two dogs.', ['have', 'has', 'are'], 0, 'they 用 have。'), mcq('___ he have a car?', ['Do', 'Does', 'Is'], 1, 'he 的疑问句用 Does。')],
    fill: [fill('I ___ a brother.', 'have', 'I 用 have。', 'have/has'), fill('My father ___ a car.', 'has', '单数第三人称用 has。', 'have/has'), fill('___ you have a pen?', 'Do', 'you 的疑问句用 Do。', '一般疑问句')],
    translations: [translate('我有一个姐姐。', 'I have a sister.'), translate('她有一本英语书。', 'She has an English book.')]
  },
  {
    id: 'present', num: 9, group: '动词与时态', title: '一般现在时：肯定句', subtitle: '表达习惯、事实和规律',
    summary: '一般现在时表示经常发生的动作、习惯、事实或规律。主语是第三人称单数时，动词通常加 -s 或 -es。',
    formula: '主语 + 动词原形 / 动词 + s + 时间', cues: ['read', 'reads', 'study', 'studies', 'like', 'likes', 'live', 'lives', 'every'],
    rules: [['非第三人称单数', 'I/you/we/they + 动词原形：We read English.'], ['第三人称单数', 'he/she/it + 动词加 s：She reads English.'], ['时间标志', 'every day, usually, often, sometimes 常和一般现在时连用。']],
    examples: [ex('I read English every morning.', '我每天早上读英语。', 'I 后用动词原形 read。'), ex('She studies English after school.', '她放学后学习英语。', 'she 后用 studies。'), ex('The sun rises in the east.', '太阳从东方升起。', '客观事实用一般现在时。')],
    mistakes: ['She read 应改为 She reads。', '不要因为句子里有 now 就机械使用现在进行时，now 也可以表示当前习惯，但通常要看语境。'],
    mcq: [mcq('He ___ English every day.', ['read', 'reads', 'reading'], 1, 'he 是第三人称单数，read 加 s。'), mcq('We ___ in a small town.', ['live', 'lives', 'living'], 0, 'we 后用动词原形。'), mcq('“她喜欢音乐。”应表达为：', ['She like music.', 'She likes music.', 'She liking music.'], 1, '第三人称单数 like 加 s。')],
    fill: [fill('My brother ___ football every weekend.', 'plays', 'play 变为第三人称单数 plays。', '第三人称单数'), fill('They ___ English at school.', 'study', 'they 后用动词原形。', '一般现在时'), fill('The cat ___ milk.', 'likes', 'cat 是单数第三人称。', '第三人称单数')],
    translations: [translate('我每天读英语。', 'I read English every day.'), translate('她喜欢音乐。', 'She likes music.')]
  },
  {
    id: 'presentneg', num: 10, group: '动词与时态', title: '一般现在时：否定与疑问', subtitle: 'do / does 的用法',
    summary: '一般现在时的否定句和疑问句通常借助 do 或 does。does 用于 he、she、it 和单数名词，后面动词恢复原形。',
    formula: 'do/does + not + 动词原形；Do/Does + 主语 + 动词原形？', cues: ['do', "don't", 'does', "doesn't"],
    rules: [['否定', 'I do not like coffee. She does not like coffee.'], ['疑问', 'Do you like coffee? Does she like coffee?'], ['关键提醒', 'does 后面的动词必须用原形：Does she like...? 不是 likes。']],
    examples: [ex('I do not watch TV at night.', '我晚上不看电视。', 'I 后用 do not。'), ex('She does not eat meat.', '她不吃肉。', 'she 后用 does not，eat 用原形。'), ex('Does he play football?', '他踢足球吗？', '疑问句以 Does 开头。')],
    mistakes: ['She does not likes 错误，does 后动词用原形。', 'Do she 错误，she 的疑问句用 Does。'],
    mcq: [mcq('She ___ not like coffee.', ['do', 'does', 'is'], 1, 'she 的否定句用 does not。'), mcq('___ they study English?', ['Do', 'Does', 'Are'], 0, 'they 的疑问句用 Do。'), mcq('He does not ___ TV.', ['watches', 'watch', 'watching'], 1, 'does not 后使用动词原形。')],
    fill: [fill('I ___ like tea.', "do not", 'I 的否定句用 do not。', '否定句'), fill('___ she live in Beijing?', 'Does', 'she 的疑问句用 Does。', '一般疑问句'), fill('He does not ___ football.', 'play', 'does not 后用动词原形。', '否定句')],
    translations: [translate('我不喜欢咖啡。', 'I do not like coffee.'), translate('她每天不吃早餐吗？', 'Does she eat breakfast every day?')]
  }
];

lessonList.push(
  {
    id: 'frequency', num: 11, group: '表达扩展', title: '频率副词', subtitle: 'always / usually / often / sometimes / never',
    summary: '频率副词说明动作发生得有多频繁。它们通常放在实义动词前、be 动词后。',
    formula: '主语 + 频率副词 + 实义动词；主语 + be + 频率副词', cues: ['always', 'usually', 'often', 'sometimes', 'never'],
    rules: [['位置', 'She often reads English. 实义动词前用频率副词。'], ['be 动词后', 'He is always happy. 频率副词放在 is 后面。'], ['频率高低', 'always 100%，usually 通常，often 经常，sometimes 有时，never 从不。']],
    examples: [ex('I usually get up at seven.', '我通常七点起床。', 'usually 放在实义动词 get 前。'), ex('She is never late.', '她从不迟到。', 'never 放在 be 动词 is 后。'), ex('We sometimes play football after school.', '我们有时放学后踢足球。', 'sometimes 放在实义动词 play 前。')],
    mistakes: ['I always am happy 不自然，应说 I am always happy。', '频率副词不能随便放在句尾。'],
    mcq: [mcq('She ___ reads English in the morning.', ['always', 'am', 'is'], 0, '实义动词 reads 前用频率副词 always。'), mcq('He is ___ late.', ['never', 'usually', 'always'], 0, 'is 后用频率副词，never 符合句意。'), mcq('“我经常跑步。”应表达为：', ['I often run.', 'I run often always.', 'Often I am run.'], 0, 'often 放在实义动词 run 前。')],
    fill: [fill('I ___ drink coffee.（从不）', 'never', 'never 放在实义动词前。', '频率副词'), fill('She is ___ happy.（总是）', 'always', 'be 动词后用频率副词。', '频率副词'), fill('We ___ play games after school.（有时）', 'sometimes', 'sometimes 放在实义动词前。', '频率副词')],
    translations: [translate('我通常七点起床。', 'I usually get up at seven.'), translate('他从不迟到。', 'He is never late.')]
  },
  {
    id: 'continuous', num: 12, group: '动词与时态', title: '现在进行时', subtitle: 'be + doing，表示此刻正在发生',
    summary: '现在进行时表示现在正在进行或暂时发生的动作，结构是 be 动词 + 动词 ing。',
    formula: '主语 + am / is / are + 动词 ing', cues: ['am', 'is', 'are', 'reading', 'playing', 'studying', 'working', 'now'],
    rules: [['结构', 'I am reading. She is playing. They are studying.'], ['时间标志', 'now、right now、at the moment 常与现在进行时连用。'], ['拼写', '一般加 ing；以不发音 e 结尾去 e 加 ing：write → writing。']],
    examples: [ex('I am reading a book now.', '我现在正在读书。', 'I + am + reading。'), ex('She is playing the piano.', '她正在弹钢琴。', 'she + is + playing。'), ex('They are studying English.', '他们正在学习英语。', 'they + are + studying。')],
    mistakes: ['She is read 错误，应说 She is reading。', '一般现在时和现在进行时不要混用：表示习惯用 reads，表示此刻用 is reading。'],
    mcq: [mcq('She ___ reading now.', ['am', 'is', 'are'], 1, 'she 搭配 is。'), mcq('They ___ playing football.', ['am', 'is', 'are'], 2, 'they 搭配 are。'), mcq('“我正在写作业。”应表达为：', ['I write homework now.', 'I am writing homework now.', 'I am write homework now.'], 1, '现在进行时用 be + doing。')],
    fill: [fill('I ___ reading a book now.', 'am', 'I 搭配 am。', '现在进行时'), fill('She is ___ a picture.', 'drawing', 'draw 去 w 加 ing。', '动词 ing'), fill('They ___ playing in the park.', 'are', 'they 搭配 are。', '现在进行时')],
    translations: [translate('他正在看电视。', 'He is watching TV.'), translate('我们正在学习英语。', 'We are studying English.')]
  },
  {
    id: 'can', num: 13, group: '表达扩展', title: 'can 表示能力', subtitle: '会做、能做、可以做',
    summary: 'can 是情态动词，表示能力、可能性或许可。它后面永远接动词原形，没有人称变化。',
    formula: '主语 + can + 动词原形；主语 + cannot / can\'t + 动词原形', cues: ['can', 'cannot', "can't"],
    rules: [['能力', 'I can swim. She can play the piano.'], ['否定', 'cannot 或 can\'t：He cannot drive.'], ['疑问', 'Can you help me? 将 can 提到主语前。']],
    examples: [ex('I can speak a little English.', '我能说一点英语。', 'can 后接动词原形 speak。'), ex('She can swim very well.', '她游得很好。', 'can 不随 she 变成 cans。'), ex('Can you help me?', '你能帮我吗？', '疑问句把 can 提前。')],
    mistakes: ['She cans swim 错误，can 不变形。', 'She can swims 错误，can 后用动词原形。'],
    mcq: [mcq('He can ___ English.', ['speak', 'speaks', 'speaking'], 0, 'can 后使用动词原形。'), mcq('She ___ play the piano.', ['can', 'cans', 'is can'], 0, 'can 不随主语变化。'), mcq('“你能帮我吗？”应表达为：', ['You can help me?', 'Can you help me?', 'Do you can help me?'], 1, '情态动词疑问句将 can 提前。')],
    fill: [fill('I can ___ English.', 'speak', 'can 后用动词原形。', 'can'), fill('She ___ swim very well.', 'can', 'can 不随主语变化。', 'can'), fill('___ you help me?', 'Can', '疑问句将 Can 提前。', 'can 问句')],
    translations: [translate('我会游泳。', 'I can swim.'), translate('你能帮我吗？', 'Can you help me?')]
  },
  {
    id: 'modal', num: 14, group: '表达扩展', title: 'must 与 should', subtitle: '必须与应该',
    summary: 'must 表示必须，语气较强；should 表示建议或应该做某事。两者后面都接动词原形。',
    formula: '主语 + must / should + 动词原形；主语 + mustn\'t / shouldn\'t + 动词原形', cues: ['must', 'should', "mustn't", "shouldn't"],
    rules: [['must', 'You must wear a seat belt. 表示规定或强烈必要。'], ['should', 'You should sleep early. 表示建议。'], ['否定', 'mustn\'t 表示禁止；shouldn\'t 表示不应该。']],
    examples: [ex('You should drink more water.', '你应该多喝水。', 'should 表建议。'), ex('We must follow the rules.', '我们必须遵守规则。', 'must 表必要。'), ex('You shouldn\'t eat too much sugar.', '你不应该吃太多糖。', 'shouldn\'t 表示不建议。')],
    mistakes: ['should 后不要加 to：You should to go 错误。', 'must 和 should 都是情态动词，后面用动词原形。'],
    mcq: [mcq('You ___ drink more water.', ['should', 'should to', 'shoulds'], 0, 'should 后直接接动词原形。'), mcq('We ___ follow the rules.', ['must', 'must to', 'musts'], 0, 'must 后直接接动词原形。'), mcq('“你不应该熬夜。”应表达为：', ['You shouldn\'t stay up late.', 'You don\'t should stay up late.', 'You should not to stay up late.'], 0, 'shouldn\'t 后接动词原形。')],
    fill: [fill('You ___ sleep early.', 'should', '表示建议用 should。', '情态动词'), fill('We ___ follow the rules.', 'must', '表示必须用 must。', '情态动词'), fill('You ___ eat too much sugar.', "shouldn't", '表示不应该用 shouldn\'t。', '否定情态动词')],
    translations: [translate('你应该早点睡觉。', 'You should go to bed early.'), translate('我们必须遵守规则。', 'We must follow the rules.')]
  },
  {
    id: 'preposition', num: 15, group: '表达扩展', title: '时间与地点介词', subtitle: 'in / on / at 等常见搭配',
    summary: '介词表示时间、地点和方向。in 常用于大范围或月份，on 常用于具体日期和表面，at 常用于具体地点或时刻。',
    formula: '介词 + 名词 / 代词', cues: ['in', 'on', 'at', 'under', 'near', 'between'],
    rules: [['in', 'in the room 在房间里；in May 在五月。'], ['on', 'on the desk 在桌上；on Monday 在星期一。'], ['at', 'at home 在家；at seven 在七点。']],
    examples: [ex('The book is on the desk.', '书在桌子上。', 'on 表示表面接触。'), ex('We have class at nine.', '我们九点上课。', 'at 表示具体时刻。'), ex('She lives near the park.', '她住在公园附近。', 'near 表示附近。')],
    mistakes: ['时间表达要记搭配，不要只用中文“在”对应一个介词。', 'in the desk 和 on the desk 含义不同，要结合图片或语境判断。'],
    mcq: [mcq('The book is ___ the desk.', ['in', 'on', 'at'], 1, '书在桌面上，用 on。'), mcq('We have class ___ nine.', ['in', 'on', 'at'], 2, '具体时刻前用 at。'), mcq('She lives ___ the park.', ['near', 'under', 'between'], 0, '表示公园附近用 near。')],
    fill: [fill('The cat is ___ the table.（在下面）', 'under', '表示在桌子下面。', '地点介词'), fill('I get up ___ seven.', 'at', '具体时刻用 at。', '时间介词'), fill('The picture is ___ the wall.', 'on', '在墙面上用 on。', '地点介词')],
    translations: [translate('书在桌子上。', 'The book is on the table.'), translate('我们九点上课。', 'We have class at nine.')]
  },
  {
    id: 'pastbe', num: 16, group: '动词与时态', title: '一般过去时：be 动词', subtitle: 'was / were',
    summary: 'was 用于 I、he、she、it 和单数主语；were 用于 you、we、they 和复数主语。它表示过去的状态或位置。',
    formula: '单数主语 + was；复数主语 + were', cues: ['was', 'were', 'yesterday', 'last'],
    rules: [['was', 'I was at home yesterday. She was happy.'], ['were', 'We were at school. They were tired.'], ['否定与疑问', 'was not / were not；Was he...? Were they...?']],
    examples: [ex('I was at home yesterday.', '我昨天在家。', 'I 的过去式 be 动词是 was。'), ex('They were happy last week.', '他们上周很开心。', 'they 用 were。'), ex('Was she at school?', '她当时在学校吗？', '疑问句把 was 提前。')],
    mistakes: ['I were 错误，I 用 was。', 'They was 错误，they 用 were。'],
    mcq: [mcq('I ___ at home yesterday.', ['was', 'were', 'am'], 0, 'I 的过去式 be 动词是 was。'), mcq('They ___ happy last week.', ['was', 'were', 'are'], 1, 'they 用 were。'), mcq('“她当时很累。”应表达为：', ['She was tired.', 'She were tired.', 'She is tired yesterday.'], 0, '过去状态用 was。')],
    fill: [fill('The weather ___ nice yesterday.', 'was', '单数主语 the weather 用 was。', 'was/were'), fill('We ___ at the park last Sunday.', 'were', 'we 用 were。', 'was/were'), fill('___ she at home last night?', 'Was', '单数主语 she 的疑问句用 Was。', '一般疑问句')],
    translations: [translate('我昨天很忙。', 'I was busy yesterday.'), translate('他们上周在学校。', 'They were at school last week.')]
  },
  {
    id: 'pastregular', num: 17, group: '动词与时态', title: '一般过去时：规则动词', subtitle: '动词 + ed',
    summary: '规则动词的过去式一般在词尾加 -ed，表示过去发生的动作。疑问句和否定句用 did。',
    formula: '主语 + 动词过去式；did not + 动词原形', cues: ['played', 'watched', 'worked', 'studied', 'visited', 'walked', 'did', "didn't"],
    rules: [['一般加 -ed', 'play → played，watch → watched。'], ['双写与去 y', 'stop → stopped；study → studied。'], ['否定疑问', 'I did not play. Did you play? did 后动词用原形。']],
    examples: [ex('We played football yesterday.', '我们昨天踢了足球。', 'play 的过去式是 played。'), ex('She studied English last night.', '她昨晚学习了英语。', 'study 变为 studied。'), ex('Did you watch the movie?', '你看那部电影了吗？', 'did 后动词用原形。')],
    mistakes: ['Did you played 错误，did 后用动词原形 play。', '不要把过去时间与现在完成时混在一起。'],
    mcq: [mcq('We ___ football yesterday.', ['play', 'played', 'playing'], 1, 'yesterday 表示过去，play 加 ed。'), mcq('She ___ English last night.', ['study', 'studied', 'studies'], 1, 'study 去 y 加 ied。'), mcq('Did you ___ the movie?', ['watched', 'watch', 'watching'], 1, 'did 后使用动词原形。')],
    fill: [fill('I ___ TV last night.（watch）', 'watched', '一般加 ed。', '规则过去式'), fill('They ___ in the park yesterday.（play）', 'played', 'play 加 ed。', '规则过去式'), fill('She did not ___ English yesterday.（study）', 'study', 'did not 后用动词原形。', '过去否定')],
    translations: [translate('我昨天看了一部电影。', 'I watched a movie yesterday.'), translate('他们昨晚学习了英语。', 'They studied English last night.')]
  },
  {
    id: 'pastirregular', num: 18, group: '动词与时态', title: '一般过去时：不规则与疑问', subtitle: 'go → went，see → saw',
    summary: '许多常用动词的过去式是不规则的，需要单独记忆。过去的否定和疑问通常借助 did。',
    formula: '主语 + 过去式；Did + 主语 + 动词原形？', cues: ['went', 'saw', 'had', 'ate', 'came', 'met', 'did', "didn't"],
    rules: [['常见不规则动词', 'go → went，see → saw，have → had，eat → ate。'], ['否定', 'We did not go there. did 后动词用原形。'], ['疑问', 'Did you see him? 可以用 Yes, I did. / No, I didn\'t. 回答。']],
    examples: [ex('I went to the park yesterday.', '我昨天去了公园。', 'go 的过去式是 went。'), ex('She saw a beautiful bird.', '她看见了一只美丽的鸟。', 'see 的过去式是 saw。'), ex('Did you eat breakfast?', '你吃早餐了吗？', '疑问句用 Did + 动词原形。')],
    mistakes: ['Did you went 错误，did 后用原形 go。', '不要给不规则动词随意加 ed：goed、seed 都不正确。'],
    mcq: [mcq('I ___ to the park yesterday.', ['go', 'went', 'goed'], 1, 'go 的过去式是 went。'), mcq('She ___ a bird last week.', ['see', 'saw', 'seed'], 1, 'see 的过去式是 saw。'), mcq('Did you ___ breakfast?', ['ate', 'eat', 'eating'], 1, 'did 后用动词原形。')],
    fill: [fill('I ___ home early yesterday.（go）', 'went', 'go 的过去式是 went。', '不规则动词'), fill('She ___ a good film last night.（see）', 'saw', 'see 的过去式是 saw。', '不规则动词'), fill('Did you ___ my message?（get）', 'get', 'did 后用动词原形。', '过去疑问')],
    translations: [translate('我昨天去了公园。', 'I went to the park yesterday.'), translate('你吃早餐了吗？', 'Did you eat breakfast?')]
  },
  {
    id: 'future', num: 19, group: '动词与时态', title: '一般将来时', subtitle: 'will / be going to',
    summary: 'will 表示将来的动作或临时决定；be going to 表示计划或已有迹象的将来。两者后面都接动词原形。',
    formula: '主语 + will + 动词原形；主语 + am/is/are going to + 动词原形', cues: ['will', 'going', 'tomorrow', 'soon', 'next'],
    rules: [['will', 'I will call you tomorrow. will 不随主语变化。'], ['be going to', 'She is going to study English. be 动词随主语变化。'], ['否定与疑问', 'will not / won\'t；Will you...?']],
    examples: [ex('I will visit my grandmother tomorrow.', '我明天要去看望奶奶。', 'will 后接动词原形。'), ex('We are going to travel next week.', '我们下周打算去旅行。', 'be going to 表示计划。'), ex('Will you help me?', '你会帮我吗？', '疑问句将 will 提前。')],
    mistakes: ['will to go 错误，will 后直接接动词原形。', 'I am going to will go 错误，两个将来结构不能叠加。'],
    mcq: [mcq('I ___ visit my grandmother tomorrow.', ['will', 'will to', 'am'], 0, 'will 后直接接动词原形。'), mcq('She ___ going to study English.', ['am', 'is', 'are'], 1, 'she 搭配 is。'), mcq('“你明天会来吗？”应表达为：', ['Will you come tomorrow?', 'Do you will come tomorrow?', 'You will come tomorrow?'], 0, '将来疑问句将 will 提前。')],
    fill: [fill('I ___ call you tomorrow.', 'will', '将来动作用 will。', '一般将来时'), fill('They are ___ to travel next week.', 'going', 'be going to 结构。', '计划将来'), fill('___ you help me tomorrow?', 'Will', '疑问句将 Will 提前。', '将来疑问句')],
    translations: [translate('我明天会给你打电话。', 'I will call you tomorrow.'), translate('我们打算下周旅行。', 'We are going to travel next week.')]
  },
  {
    id: 'comparative', num: 20, group: '表达扩展', title: '形容词与比较级', subtitle: 'bigger / more important',
    summary: '比较级用于比较两个人或物。短形容词通常加 -er，较长形容词通常在前面加 more，比较对象之间常用 than。',
    formula: 'A + be + 比较级 + than + B', cues: ['than', 'better', 'bigger', 'smaller', 'cleaner', 'more', 'best'],
    rules: [['短词加 -er', 'small → smaller，clean → cleaner。'], ['双写与去 y', 'big → bigger，happy → happier。'], ['长词加 more', 'important → more important，beautiful → more beautiful。']],
    examples: [ex('This book is easier than that one.', '这本书比那本容易。', 'easy 变为 easier。'), ex('My bag is bigger than yours.', '我的包比你的大。', 'big 双写 g 再加 er。'), ex('English is more interesting than I thought.', '英语比我想象的更有趣。', '长形容词前用 more。')],
    mistakes: ['more easier 是重复比较，应说 easier。', '比较级后常接 than，不要忘记比较对象。'],
    mcq: [mcq('This bag is ___ than that one.', ['big', 'bigger', 'more big'], 1, 'big 双写 g 加 er。'), mcq('English is ___ important than I thought.', ['more', 'most', 'much'], 0, '较长形容词前用 more。'), mcq('“她比我开心。”应表达为：', ['She is happier than me.', 'She is more happy than me.', 'She is happyer than me.'], 0, 'happy 变 happier。')],
    fill: [fill('This book is ___ than that one.（easy）', 'easier', 'easy 去 y 加 ier。', '比较级'), fill('My bag is ___ than yours.（big）', 'bigger', 'big 双写 g 加 er。', '比较级'), fill('English is ___ interesting than math.（更）', 'more', '长形容词前加 more。', '比较级')],
    translations: [translate('这本书比那本书容易。', 'This book is easier than that book.'), translate('我的包比你的大。', 'My bag is bigger than yours.')]
  }
);

const articleSentence = (en, zh, grammarNote = '') => ({ en, zh, grammarNote });
const topicExtras = {
  life: [articleSentence('I feel happy at the end of the day.', '一天结束时我感到很开心。', '一般现在时'), articleSentence('A simple life can still be a good life.', '简单的生活也可以是好生活。', 'be 动词')],
  school: [articleSentence('We learn new words in class.', '我们在课堂上学新单词。', '一般现在时'), articleSentence('Our teacher says English is useful.', '我们的老师说英语很有用。', '宾语从句')],
  family: [articleSentence('My family is important to me.', '我的家庭对我很重要。', 'be 动词'), articleSentence('We help each other at home.', '我们在家里互相帮助。', '一般现在时')],
  travel: [articleSentence('I meet new people on the way.', '我在路上遇见新朋友。', '一般现在时'), articleSentence('Travel helps me understand the world.', '旅行帮助我理解世界。', '一般现在时')],
  hobby: [articleSentence('My hobby makes me happy.', '我的爱好让我开心。', '一般现在时'), articleSentence('I practice it every weekend.', '我每个周末都练习它。', '一般现在时')]
};
const localArticleSeeds = {
  sentence: ['A Simple School Day', '简单的校园一天', '主语 + 谓语', [
    articleSentence('Anna is a student.', '安娜是一名学生。', 'Anna 是主语，is 是谓语。'), articleSentence('She has a red book.', '她有一本红色的书。', 'She 是主语，has 是谓语。'), articleSentence('The book is on the desk.', '书在书桌上。', 'The book 是主语，is 是谓语。'), articleSentence('Anna reads English every day.', '安娜每天读英语。', 'reads 说明 Anna 的动作。'), articleSentence('Her friends study with her after school.', '她的朋友们放学后和她一起学习。', 'friends 是主语，study 是谓语。'), articleSentence('They like their school.', '他们喜欢他们的学校。', 'They 是主语，like 是谓语。')
  ]],
  pronoun: ['We Learn Together', '我们一起学习', '人称代词 + 物主形容词', [
    articleSentence('I have a brother.', '我有一个兄弟。', 'I 是主格代词。'), articleSentence('He is a teacher in our school.', '他是我们学校的一名老师。', 'He 是主语，our 修饰 school。'), articleSentence('She likes music and English.', '她喜欢音乐和英语。', 'She 是女性单数主语。'), articleSentence('We study together every day.', '我们每天一起学习。', 'We 是复数主语。'), articleSentence('They live near our home.', '他们住在我们家附近。', 'They 代替一群人。'), articleSentence('My brother and I are good friends.', '我哥哥和我是好朋友。', 'My 修饰 brother。')
  ]],
  be: ['A Busy but Happy Day', '忙碌却开心的一天', '主语 + am / is / are', [
    articleSentence('I am a student.', '我是一名学生。', 'I 搭配 am。'), articleSentence('You are my friend.', '你是我的朋友。', 'You 搭配 are。'), articleSentence('He is at home now.', '他现在在家。', 'He 搭配 is。'), articleSentence('She is happy today.', '她今天很开心。', 'She 搭配 is。'), articleSentence('It is a small dog.', '它是一只小狗。', 'It 搭配 is。'), articleSentence('We are ready for class.', '我们准备好上课了。', 'We 搭配 are。'), articleSentence('They are in the classroom.', '他们在教室里。', 'They 搭配 are。')
  ]],
  article: ['A Book and an Apple', '一本书和一个苹果', 'a / an / the', [
    articleSentence('I have a book and an apple.', '我有一本书和一个苹果。', 'a 与 an 的选择取决于发音。'), articleSentence('The book is new.', '这本书是新的。', '再次提到 book 时用 the。'), articleSentence('The apple is red and sweet.', '这个苹果又红又甜。', '双方都知道的 apple 用 the。'), articleSentence('A good book can open a new world.', '一本好书能打开一个新世界。', 'a 表示一个。'), articleSentence('The world is full of interesting ideas.', '这个世界充满有趣的想法。', 'the world 是独一无二的对象。'), articleSentence('I read the book every evening.', '我每天晚上读这本书。', '特指同一本书用 the。')
  ]],
  plural: ['Three Friends and Two Books', '三个朋友和两本书', '名词单复数', [
    articleSentence('I have two books and three pens.', '我有两本书和三支钢笔。', 'two、three 后使用复数名词。'), articleSentence('Three students are in the classroom.', '三个学生在教室里。', 'students 是复数。'), articleSentence('They have many friends at school.', '他们在学校有很多朋友。', 'many 修饰可数名词复数。'), articleSentence('The children like apples and games.', '孩子们喜欢苹果和游戏。', 'child 的复数是 children。'), articleSentence('Some people read books on the train.', '有些人在火车上读书。', 'people 本身是复数。'), articleSentence('We put the boxes on the desks.', '我们把盒子放在课桌上。', 'box 和 desk 都变为复数。')
  ]],
  demonstrative: ['This, That, These and Those', '这个、那个、这些和那些', 'this / that / these / those', [
    articleSentence('This is my pen.', '这是我的钢笔。', 'this 指近处单数。'), articleSentence('That is your book.', '那是你的书。', 'that 指远处单数。'), articleSentence('These books are new.', '这些书是新的。', 'these 指近处复数。'), articleSentence('Those flowers are beautiful.', '那些花很漂亮。', 'those 指远处复数。'), articleSentence('This classroom is clean.', '这间教室很干净。', 'this 修饰单数名词。'), articleSentence('These students are ready.', '这些学生准备好了。', 'these 修饰复数名词。')
  ]],
  therebe: ['In Our Neighbourhood', '在我们的社区', 'There is / There are', [
    articleSentence('There is a park near my home.', '我家附近有一个公园。', 'a park 是单数，用 is。'), articleSentence('There are many trees in the park.', '公园里有很多树。', 'trees 是复数，用 are。'), articleSentence('There is a small cafe on the street.', '街上有一家小咖啡馆。', 'a cafe 是单数。'), articleSentence('There are three books on the table.', '桌上有三本书。', 'three books 是复数。'), articleSentence('Is there a library near here?', '这附近有图书馆吗？', '疑问句将 Is 提前。'), articleSentence('Yes, there is. It is next to the museum.', '是的，有。它在博物馆旁边。', '肯定回答用 Yes, there is.'), articleSentence('There are many people in the town.', '镇上有很多人。', 'people 是复数。')
  ]],
  havehas: ['What We Have', '我们拥有什么', 'have / has', [
    articleSentence('I have a new phone.', '我有一部新手机。', 'I 用 have。'), articleSentence('You have a nice bag.', '你有一个漂亮的包。', 'You 用 have。'), articleSentence('She has a beautiful garden.', '她有一个美丽的花园。', 'She 用 has。'), articleSentence('He has two brothers.', '他有两个兄弟。', 'He 用 has。'), articleSentence('They have a small dog.', '他们有一只小狗。', 'They 用 have。'), articleSentence('Does she have an English book?', '她有一本英语书吗？', 'Does 后使用动词原形 have。'), articleSentence('We have a happy family.', '我们有一个幸福的家庭。', 'We 用 have。')
  ]]
};

Object.assign(localArticleSeeds, {
  present: ['Everyday English', '每天学英语', '一般现在时肯定句', [
    articleSentence('Mia gets up at seven every morning.', '米娅每天早上七点起床。', 'Mia 是第三人称单数，get 加 s。'), articleSentence('She reads English before breakfast.', '她在早餐前读英语。', 'reads 表示日常习惯。'), articleSentence('Her brother studies at home.', '她的哥哥在家学习。', 'study 变为 studies。'), articleSentence('They like their English class.', '他们喜欢英语课。', 'they 后用动词原形。'), articleSentence('Mia usually helps her mother after dinner.', '米娅通常在晚饭后帮助妈妈。', '频率副词通常放在实义动词前。'), articleSentence('The family lives in a small town.', '这家人住在一个小镇上。', 'family 作为整体用单数 lives。')
  ]],
  presentneg: ['Questions About Everyday Life', '关于日常生活的问题', 'do / does 否定与疑问', [
    articleSentence('Ben does not drink coffee at night.', '本晚上不喝咖啡。', 'does not 后用动词原形。'), articleSentence('Does he like tea?', '他喜欢茶吗？', 'Does 用于第三人称单数疑问句。'), articleSentence('His parents do not work on Sunday.', '他的父母星期天不工作。', 'parents 是复数，用 do not。'), articleSentence('Do they live near the station?', '他们住在车站附近吗？', 'they 的疑问句用 Do。'), articleSentence('Ben usually reads before bed.', '本通常在睡前阅读。', '肯定句保留第三人称单数形式。'), articleSentence('He does not watch TV every night.', '他不是每天晚上都看电视。', 'does not 表示否定习惯。')
  ]],
  frequency: ['My Weekly Routine', '我的一周安排', '频率副词', [
    articleSentence('I usually get up at seven.', '我通常七点起床。', 'usually 放在实义动词 get 前。'), articleSentence('I always eat breakfast.', '我总是吃早餐。', 'always 放在实义动词前。'), articleSentence('I sometimes walk to school.', '我有时走路去学校。', 'sometimes 放在实义动词前。'), articleSentence('I never arrive late.', '我从不迟到。', 'never 表示从不。'), articleSentence('My teacher is always kind.', '我的老师总是很和蔼。', 'be 动词后使用频率副词。'), articleSentence('We often study together after class.', '我们经常课后一起学习。', 'often 放在实义动词前。')
  ]],
  continuous: ['Right Now', '此刻正在发生', 'be + 动词 ing', [
    articleSentence('Lily is reading a book now.', '莉莉现在正在读书。', 'is + reading 构成现在进行时。'), articleSentence('Her brother is playing a game.', '她的弟弟正在玩游戏。', '单数主语用 is。'), articleSentence('Their parents are working in the garden.', '他们的父母正在花园里工作。', '复数主语用 are。'), articleSentence('I am watching the children.', '我正在照看孩子们。', 'I 搭配 am。'), articleSentence('The dog is sleeping under the table.', '狗正在桌子下面睡觉。', 'is + sleeping。'), articleSentence('We are having a good time.', '我们正玩得很开心。', 'are + having。')
  ]],
  can: ['Things We Can Do', '我们能做的事情', 'can + 动词原形', [
    articleSentence('I can speak a little English.', '我能说一点英语。', 'can 后用动词原形。'), articleSentence('Lily can swim very well.', '莉莉游得很好。', 'can 不随主语变化。'), articleSentence('Her brother can play the piano.', '她的弟弟会弹钢琴。', 'can + play。'), articleSentence('We can help each other.', '我们可以互相帮助。', 'can + help。'), articleSentence('Can you cook dinner?', '你会做晚饭吗？', '疑问句将 Can 提前。'), articleSentence('Yes, I can. I can also make bread.', '是的，我会。我还会做面包。', '肯定回答使用 can。')
  ]],
  modal: ['Good Advice for a Busy Week', '忙碌一周的好建议', 'must / should', [
    articleSentence('You should sleep early before a busy day.', '忙碌的一天前你应该早点睡。', 'should 表示建议。'), articleSentence('We must follow the school rules.', '我们必须遵守学校规则。', 'must 表示必须。'), articleSentence('You should drink more water.', '你应该多喝水。', 'should 后接动词原形。'), articleSentence('We must wear a seat belt in the car.', '我们在车里必须系安全带。', 'must 表示规定。'), articleSentence('You should not eat too much sugar.', '你不应该吃太多糖。', 'should not 表示不建议。'), articleSentence('We should help people when we can.', '我们应该在有能力时帮助别人。', 'should 后直接接 help。')
  ]]
});

Object.assign(localArticleSeeds, {
  preposition: ['A Walk Around Town', '在镇上散步', '时间与地点介词', [
    articleSentence('The book is on the desk.', '书在书桌上。', 'on 表示表面接触。'), articleSentence('The cat is under the chair.', '猫在椅子下面。', 'under 表示在下方。'), articleSentence('We have class at nine.', '我们九点上课。', 'at 表示具体时刻。'), articleSentence('My home is near the park.', '我家在公园附近。', 'near 表示附近。'), articleSentence('The picture is on the wall.', '照片在墙上。', 'on 表示在表面上。'), articleSentence('I meet my friend at the station.', '我在车站见朋友。', 'at 表示具体地点。')
  ]],
  pastbe: ['Yesterday at Home', '昨天在家', 'was / were', [
    articleSentence('I was at home yesterday.', '我昨天在家。', 'I 的过去式 be 动词是 was。'), articleSentence('The weather was nice last Sunday.', '上周日天气很好。', '单数主语用 was。'), articleSentence('My parents were at work.', '我的父母当时在上班。', 'parents 是复数，用 were。'), articleSentence('We were happy together.', '我们当时在一起很开心。', 'We 用 were。'), articleSentence('Was it a busy day?', '那是忙碌的一天吗？', '疑问句将 Was 提前。'), articleSentence('Yes, it was, but it was a good day.', '是的，但它也是美好的一天。', '肯定回答用 Yes, it was.'), articleSentence('They were tired after dinner.', '晚饭后他们很累。', 'They 用 were。')
  ]],
  pastregular: ['Last Weekend', '上个周末', '规则动词过去式', [
    articleSentence('We played football last Saturday.', '上周六我们踢了足球。', 'play 的过去式是 played。'), articleSentence('I watched a movie in the evening.', '晚上我看了一部电影。', 'watch 加 ed。'), articleSentence('My sister studied English for an hour.', '我姐姐学习了一小时英语。', 'study 变为 studied。'), articleSentence('We walked in the park after lunch.', '午饭后我们在公园散步。', 'walk 加 ed。'), articleSentence('I visited my grandmother on Sunday.', '星期天我看望了奶奶。', 'visit 加 ed。'), articleSentence('Did you enjoy the weekend?', '你享受这个周末吗？', 'did 后用动词原形。')
  ]],
  pastirregular: ['A Day in the City', '城市的一天', '不规则动词过去式', [
    articleSentence('I went to the city last week.', '我上周去了城市。', 'go 的过去式是 went。'), articleSentence('I saw a beautiful museum.', '我看见了一座漂亮的博物馆。', 'see 的过去式是 saw。'), articleSentence('We had lunch in a small cafe.', '我们在一家小咖啡馆吃了午饭。', 'have 的过去式是 had。'), articleSentence('I met an old friend there.', '我在那里遇见了一位老朋友。', 'meet 的过去式是 met。'), articleSentence('We ate noodles and drank tea.', '我们吃了面条，喝了茶。', 'eat 和 drink 的过去式是不规则形式。'), articleSentence('Did you have a good time?', '你玩得开心吗？', 'Did 后使用动词原形。'), articleSentence('Yes, I had a great time.', '是的，我玩得很开心。', '肯定回答使用 had。')
  ]],
  future: ['Tomorrow and Next Week', '明天和下周', 'will / be going to', [
    articleSentence('I will call my friend tomorrow.', '我明天会给朋友打电话。', 'will + 动词原形。'), articleSentence('We are going to visit a museum next week.', '我们打算下周参观博物馆。', 'be going to 表示计划。'), articleSentence('She will study English after dinner.', '她会在晚饭后学习英语。', 'will 不随主语变化。'), articleSentence('They are going to travel by train.', '他们打算乘火车旅行。', 'are going to + travel。'), articleSentence('Will you come with us?', '你会和我们一起来吗？', '疑问句将 Will 提前。'), articleSentence('Yes, I will. It will be a great day.', '是的，我会。那会是美好的一天。', '肯定回答使用 will。')
  ]],
  comparative: ['Better, Bigger and More Interesting', '更好、更大、更有趣', '形容词比较级', [
    articleSentence('This book is easier than that one.', '这本书比那本容易。', 'easy 变为 easier。'), articleSentence('My bag is bigger than yours.', '我的包比你的大。', 'big 双写 g 再加 er。'), articleSentence('This classroom is cleaner than the old one.', '这间教室比旧教室干净。', 'clean 加 er。'), articleSentence('English is more interesting than I thought.', '英语比我想象的更有趣。', '长形容词前用 more。'), articleSentence('My sister is happier today than yesterday.', '我妹妹今天比昨天更开心。', 'happy 变为 happier。'), articleSentence('This is the best place for us.', '这是最适合我们的地方。', 'best 是 good 的最高级。')
  ]]
});

const advancedModules = [
  { id: 'cet-tenses', num: 21, group: '四级进阶', title: '时态综合', subtitle: '一般、进行、完成时对比', summary: '根据时间关系选择一般体、进行体或完成体。', formula: '时间标志 + 动作状态 + 正确时态', cues: ['have', 'has', 'had', 'been', 'since', 'for'] },
  { id: 'cet-passive', num: 22, group: '四级进阶', title: '被动语态', subtitle: 'be + 过去分词', summary: '当动作承受者更重要，或执行者未知时使用被动语态。', formula: '主语 + be + 过去分词 (+ by ...)', cues: ['is', 'are', 'was', 'were', 'been', 'by'] },
  { id: 'cet-nonfinite', num: 23, group: '四级进阶', title: '非谓语动词', subtitle: 'to do / doing / done', summary: '一个句子已有谓语时，其他动词要用不定式、动名词或分词形式。', formula: '谓语 + to do / doing / done', cues: ['to', 'doing', 'designed', 'written', 'based'] },
  { id: 'cet-relative', num: 24, group: '四级进阶', title: '定语从句', subtitle: 'who / which / that / whose', summary: '用关系词连接一个句子来修饰前面的名词。', formula: '先行词 + 关系词 + 从句', cues: ['who', 'which', 'that', 'whose', 'where'] },
  { id: 'cet-nounclause', num: 25, group: '四级进阶', title: '名词性从句', subtitle: 'that / whether / what', summary: '从句可以像名词一样充当主语、宾语、表语或同位语。', formula: 'that / whether / what + 完整或不完整从句', cues: ['that', 'whether', 'what', 'how', 'why'] }
];

advancedModules.push(
  { id: 'cet-adverbial', num: 26, group: '四级进阶', title: '状语从句', subtitle: '时间、原因、让步、结果', summary: '状语从句说明主句发生的时间、原因、条件、让步或结果。', formula: '连词 + 从句, 主句', cues: ['because', 'although', 'while', 'if', 'so'] },
  { id: 'cet-condition', num: 27, group: '四级进阶', title: '条件句与虚拟语气', subtitle: '真实条件与假设', summary: '真实条件用一般时态，非真实假设根据现在、过去或将来使用不同结构。', formula: 'If + 条件从句 + 主句', cues: ['if', 'were', 'would', 'had', 'could'] },
  { id: 'cet-modalperfect', num: 28, group: '四级进阶', title: '情态动词与推测', subtitle: 'must / may / could have done', summary: '情态动词可以表达能力、责任、可能性和对过去的推断。', formula: '情态动词 + 动词原形 / have done', cues: ['must', 'may', 'might', 'could', 'should', 'have'] },
  { id: 'cet-inversion', num: 29, group: '四级进阶', title: '倒装与强调', subtitle: 'Not only... / It is... that...', summary: '倒装改变正常语序以强调信息，强调句用 It is ... that ... 突出成分。', formula: '强调成分 + 倒装语序 / It is ... that ...', cues: ['not', 'only', 'rarely', 'it', 'that'] },
  { id: 'cet-longsentence', num: 30, group: '四级进阶', title: '长难句拆分', subtitle: '先找主句，再拆从句与非谓语', summary: '长难句先定位主谓宾，再识别从句、非谓语、插入语和逻辑连接。', formula: '主干 + 修饰成分 + 逻辑连接', cues: ['which', 'that', 'because', 'although', 'based', 'however'] }
);

const advancedArticleSeeds = {
  'cet-tenses': ['A Change Over Time', '随着时间发生的变化', '时态综合', [
    articleSentence('Our town has changed a lot since 2018.', '自 2018 年以来，我们的小镇变化很大。', 'since 常与现在完成时连用。'), articleSentence('A new library has just opened near the station.', '车站附近刚开了一家新图书馆。', '现在完成时强调对现在的影响。'), articleSentence('Last year, workers were building a large park.', '去年，工人们正在建一个大公园。', '过去进行时描述过去某时正在发生。'), articleSentence('They finished the project last month.', '他们上个月完成了这个项目。', '过去时间用一般过去时。'), articleSentence('Now more young people are moving here.', '现在更多年轻人正在搬到这里。', '现在进行时描述当前趋势。'), articleSentence('The town has become a better place to live.', '这个小镇已经变成更适合居住的地方。', '现在完成时连接过去和现在。')
  ]],
  'cet-passive': ['How Things Are Made', '事物是怎样被完成的', '被动语态', [
    articleSentence('The library was built five years ago.', '这座图书馆建于五年前。', 'was + built 构成一般过去时被动。'), articleSentence('Many books are stored in this building.', '许多书被保存在这座建筑里。', 'are + stored 构成一般现在时被动。'), articleSentence('The project has been completed by the team.', '这个项目已由团队完成。', 'has been + completed。'), articleSentence('New ideas are often shared online.', '新想法经常在网上分享。', '执行者不重要时可省略 by。'), articleSentence('The problem will be discussed tomorrow.', '这个问题将在明天讨论。', 'will be + discussed。'), articleSentence('Visitors must be given clear information.', '访客必须被提供清晰的信息。', '情态动词后的被动结构。')
  ]],
  'cet-nonfinite': ['Designed for Learning', '为学习而设计', '非谓语动词', [
    articleSentence('Designed for young readers, the library is easy to use.', '这座图书馆为年轻读者设计，很容易使用。', '过去分词作状语。'), articleSentence('Students come here to read and study.', '学生们来这里阅读和学习。', 'to read 表示目的。'), articleSentence('Reading every day helps improve vocabulary.', '每天阅读有助于提高词汇量。', '动名词短语作主语。'), articleSentence('The books written in simple English are popular.', '用简单英语写的书很受欢迎。', 'written 作后置定语。'), articleSentence('People enjoy sharing ideas with others.', '人们喜欢与他人分享想法。', 'enjoy 后接动名词。'), articleSentence('Encouraged by their teacher, they started a reading club.', '受到老师鼓励，他们创办了阅读社。', '过去分词作状语。')
  ]],
  'cet-relative': ['People Who Make a Difference', '让世界变得不同的人', '定语从句', [
    articleSentence('The woman who teaches English is very patient.', '教英语的那位女士非常有耐心。', 'who 指人并在从句中作主语。'), articleSentence('This is the book which helped me most.', '这是帮助我最大的一本书。', 'which 指物。'), articleSentence('The students whose ideas were creative won the prize.', '那些想法有创意的学生获奖了。', 'whose 表示所属关系。'), articleSentence('The park that we visited last week is beautiful.', '我们上周参观的公园很美。', 'that 引导限制性定语从句。'), articleSentence('He lives in a town where everyone knows each other.', '他住在一个大家彼此认识的小镇。', 'where 修饰地点。'), articleSentence('People who keep learning often see new chances.', '持续学习的人常看到新机会。', 'who 从句修饰 people。')
  ]],
  'cet-nounclause': ['What We Believe', '我们所相信的事', '名词性从句', [
    articleSentence('What he said changed my mind.', '他说的话改变了我的想法。', 'what 引导主语从句。'), articleSentence('I believe that practice makes progress.', '我相信练习会带来进步。', 'that 引导宾语从句。'), articleSentence('The question is whether we should continue.', '问题是我们是否应该继续。', 'whether 引导表语从句。'), articleSentence('How we learn is as important as what we learn.', '我们如何学习和学什么同样重要。', 'how 与 what 从句作主语。'), articleSentence('She explained why the plan was useful.', '她解释了为什么这个计划有用。', 'why 引导宾语从句。'), articleSentence('The fact that he never gives up inspires us.', '他从不放弃这一事实激励了我们。', 'that 从句作同位语。')
  ]]
};

Object.assign(advancedArticleSeeds, {
  'cet-adverbial': ['When Plans Meet Reality', '当计划遇到现实', '状语从句', [
    articleSentence('Although the weather was bad, we continued our trip.', '尽管天气不好，我们还是继续旅行。', 'although 引导让步状语从句。'), articleSentence('We waited at the station because the train was late.', '因为火车晚点，我们在车站等待。', 'because 引导原因状语从句。'), articleSentence('While I was reading, my friend called me.', '我读书时，朋友给我打了电话。', 'while 引导时间状语从句。'), articleSentence('If you practice every day, you will improve.', '如果每天练习，你就会进步。', 'if 引导条件状语从句。'), articleSentence('The book was so interesting that I finished it in one day.', '这本书太有趣了，我一天就读完了。', 'so ... that 引导结果状语从句。'), articleSentence('We can reach the goal if we work together.', '如果一起努力，我们就能实现目标。', 'if 从句后接主句。')
  ]],
  'cet-condition': ['If I Could Start Again', '如果我能重新开始', '条件句与虚拟语气', [
    articleSentence('If I have time tomorrow, I will visit the museum.', '如果明天有时间，我会参观博物馆。', '真实条件句使用一般现在时和 will。'), articleSentence('If I were you, I would read more English articles.', '如果我是你，我会读更多英语文章。', '与现在事实相反用 were + would。'), articleSentence('If she had studied harder, she would have passed the exam.', '如果她当时更努力，就会通过考试。', '与过去事实相反用 had done + would have done。'), articleSentence('I wish I could speak English more fluently.', '我希望自己能把英语说得更流利。', 'wish 后可使用过去式表达现在的愿望。'), articleSentence('Without your help, we could not have finished it.', '没有你的帮助，我们不可能完成它。', 'without 可引出隐含条件。'), articleSentence('If we keep practicing, our results will improve.', '如果持续练习，我们的成绩会提高。', '真实条件句表达可能结果。')
  ]],
  'cet-modalperfect': ['Looking Back and Guessing', '回顾与推测', '情态动词与推测', [
    articleSentence('She may have missed the early train.', '她可能错过了早班火车。', 'may have done 表示对过去的可能推断。'), articleSentence('He must have forgotten about the meeting.', '他一定是忘了会议。', 'must have done 表示较肯定的推断。'), articleSentence('They could have taken a different road.', '他们本可以走另一条路。', 'could have done 表示过去可能或未实现的选择。'), articleSentence('You should have told me earlier.', '你本应该早点告诉我。', 'should have done 表示过去本该做却没做。'), articleSentence('The problem might not be as difficult as it seems.', '问题可能没有看上去那么难。', 'might 表示现在的不确定推测。'), articleSentence('We can learn from what happened and do better next time.', '我们可以从发生的事情中学习，下次做得更好。', 'can 表示能力或可能性。')
  ]],
  'cet-inversion': ['More Than Words', '不只是文字', '倒装与强调', [
    articleSentence('Not only did she read the book, but she also wrote a review.', '她不仅读了这本书，还写了书评。', 'Not only 置于句首时使用部分倒装。'), articleSentence('It was the teacher who encouraged me to continue.', '正是老师鼓励我继续下去。', 'It is/was ... that/who 构成强调句。'), articleSentence('Rarely do we see such a clear explanation.', '我们很少看到如此清晰的解释。', '否定副词置于句首引起倒装。'), articleSentence('Only after practice did I understand the rule.', '只有经过练习后我才理解这条规则。', 'Only + 状语置于句首引起倒装。'), articleSentence('What matters most is not speed but understanding.', '最重要的不是速度，而是理解。', 'what 从句作主语并形成对比强调。'), articleSentence('It is through reading that we build vocabulary.', '正是通过阅读，我们积累词汇。', '强调方式状语 through reading。')
  ]],
  'cet-longsentence': ['Reading a Long Sentence', '读懂一个长难句', '长难句拆分', [
    articleSentence('Although the article looks difficult, its main idea is clear.', '尽管这篇文章看起来难，它的主旨很清楚。', '先去掉 although 从句，找主句。'), articleSentence('The study which was published last week shows an important change.', '上周发表的研究显示了一个重要变化。', 'which 从句修饰 the study。'), articleSentence('Based on the results, researchers believe that daily reading helps learners.', '基于结果，研究者认为每日阅读有助于学习者。', 'Based on 是非谓语状语。'), articleSentence('However, progress depends on how regularly we practice.', '然而，进步取决于我们练习得有多规律。', 'how 从句作介词宾语。'), articleSentence('When we meet a long sentence, we should first find its subject and verb.', '遇到长句时，我们应先找主语和谓语。', '先识别主干再处理修饰成分。'), articleSentence('This method makes complex ideas easier to understand.', '这种方法让复杂观点更容易理解。', 'make + 宾语 + 形容词补语。')
  ]]
});

const state = {
  settings: readJSON(STORAGE.settings, { baseUrl: 'https://api.openai.com/v1', model: '', apiKey: '', level: 'A1', dailyGoal: 20, theme: 'system', fontScale: 1, voice: 'en-US', speechRate: 0.9, autoSpeakReview: false, onboardingSeen: false }),
  progress: readJSON(STORAGE.progress, { completed: {}, lastLessonId: '', studyDates: {} }),
  vocabulary: readJSON(STORAGE.vocabulary, {}),
  articles: readJSON(STORAGE.articles, []),
  currentView: 'home',
  lessonFilter: 'all',
  lessonSession: null,
  currentArticle: null,
  selectedWord: null,
  review: { queue: [], index: 0, revealed: false, dueOnly: true },
  metadataEnrichment: null,
  practice: null,
  wrongBook: null,
  writing: null,
  memory: null
};

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'CET4'];
const LEVEL_LABELS = { A1: 'A1 零基础', A2: 'A2 基础', B1: 'B1 进阶', CET4: 'CET-4 四级' };
function courseLevel(item) {
  if (item.level) return item.level;
  if (!item.advanced) return item.num <= 10 ? 'A1' : 'A2';
  return item.num <= 25 ? 'B1' : 'CET4';
}
function coursesForLevel(level = state.settings.level) {
  return courseItems().filter(item => courseLevel(item) === level);
}
function updateArticleTypeAvailability() {
  const select = $('#articleType');
  const hint = $('#articleTypeHint');
  const enabled = (state.settings.level || 'A1') === 'CET4';
  if (select) {
    select.disabled = !enabled;
    if (!enabled) select.value = 'careful';
  }
  if (hint) hint.classList.toggle('hidden', enabled);
}
function renderLevelSwitchers() {
  const level = state.settings.level || 'A1';
  $$('.level-switcher [data-level]').forEach(button => button.classList.toggle('active', button.dataset.level === level));
  const mobile = $('#mobileLevelSelect');
  if (mobile) mobile.value = level;
  const articleLevel = $('#articleLevel');
  if (articleLevel) articleLevel.value = level;
  const heroLabel = $('#heroLevelLabel');
  if (heroLabel) heroLabel.textContent = `${LEVEL_LABELS[level]} · 可随时切换`;
  updateArticleTypeAvailability();
}
function setGlobalLevel(level) {
  if (!LEVEL_ORDER.includes(level)) return;
  const previousLevel = state.settings.level;
  state.settings.level = level;
  if (level === 'CET4' && previousLevel !== 'CET4' && $('#articleType')) $('#articleType').value = 'careful';
  writeJSON(STORAGE.settings, state.settings);
  renderLevelSwitchers();
  renderHome();
  renderGrammar();
  updateArticleTypeAvailability();
  updateReadingVideo();
  showToast(`已切换到 ${LEVEL_LABELS[level]}`);
}
function courseItems() {
  const micro = typeof grammarTopics !== 'undefined' ? grammarTopics : [];
  return lessonList.concat(advancedModules.map(item => Object.assign({}, item, { advanced: true })), micro);
}
function findCourse(id) {
  return courseItems().find(item => item.id === id);
}
function lessonByOffset(id, offset) {
  const items = courseItems();
  const index = items.findIndex(item => item.id === id);
  return items[index + offset] || null;
}
function isAIConfigured() {
  return Boolean(state.settings.baseUrl && state.settings.model && state.settings.apiKey);
}
function dueWords() {
  const now = Date.now();
  return Object.values(state.vocabulary).filter(word => (word.nextReview || 0) <= now);
}
function completedLessonCount() {
  return Object.keys(state.progress.completed || {}).filter(id => state.progress.completed[id] && state.progress.completed[id].completed).length;
}
function touchStudy() {
  const key = new Date().toISOString().slice(0, 10);
  state.progress.studyDates[key] = true;
  writeJSON(STORAGE.progress, state.progress);
}
function normalizeAnswer(value) {
  return String(value || '').toLowerCase().replace(/[\u002e\u002c\u0021\u003f\u003b\u003a\u0022\u0027\u2018\u2019\u201c\u201d]/g, '').replace(/\s+/g, ' ').trim();
}
function localFeedbackText(correct, reference, explanation) {
  const yes = '\u56de\u7b54\u6b63\u786e\u3002';
  const ref = '\u53c2\u8003\u7b54\u6848\uff1a';
  const answer = correct ? yes : ref + (reference || '') + '\u3002';
  return (answer + (explanation ? ' ' + explanation : '')).trim();
}
function hasChineseFeedback(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  return chinese >= 2 && chinese >= latin * 0.12;
}
function chineseFeedbackOrFallback(value, fallback) {
  return hasChineseFeedback(value) ? String(value).trim() : fallback;
}
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function setLoading(on, text = '正在生成文章…') {
  $('#loadingText').textContent = text;
  $('#loadingMask').classList.toggle('hidden', !on);
}
function showView(view) {
  state.currentView = view;
  $$('.view').forEach(section => section.classList.toggle('active', section.id === 'view-' + view));
  $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view || (view === 'lesson' && button.dataset.view === 'grammar')));
  $('#mobileNav').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderMobileNav() {
  const nav = $('#mobileNav');
  nav.innerHTML = [
    ['home', '学习首页'], ['grammar', '语法课堂'], ['practice', '练习中心'], ['reading', '阅读实验室'],
    ['vocabulary', '我的单词本'], ['settings', 'AI 与数据']
  ].map(item => `<button class="nav-item" type="button" data-view="${item[0]}">${item[1]}</button>`).join('');
}
function updateStats() {
  const done = completedLessonCount();
  const due = dueWords().length;
  const wordCount = Object.keys(state.vocabulary).length;
  const grammarTotal = Math.max(1, courseItems().length);
  $('#statLessonProgress').textContent = `${done} / ${grammarTotal}`;
  $('#statLessonBar').style.width = `${Math.round(done / grammarTotal * 100)}%`;
  $('#statWordCount').textContent = wordCount;
  $('#statDueCount').textContent = due;
  $('#navDueCount').textContent = due;
  $('#navDueCount').classList.toggle('hidden', due === 0);
  $('#sidebarDueCount').textContent = due;
  const ringPercent = Math.round(done / grammarTotal * 100);
  $('#grammarProgressRing').style.background = `conic-gradient(var(--green) ${ringPercent}%, #e5e9e4 ${ringPercent}%)`;
  $('#grammarProgressRing strong').textContent = `${ringPercent}%`;
  const week = new Date(Date.now() - 7 * DAY).toISOString().slice(0, 10);
  $('#statStudyDays').textContent = Object.keys(state.progress.studyDates || {}).filter(date => date >= week).length;
  return { done, due, wordCount };
}
function renderHome() {
  const done = completedLessonCount();
  const levelCourses = coursesForLevel();
  const next = levelCourses.find(item => !(state.progress.completed[item.id] && state.progress.completed[item.id].completed)) || levelCourses[levelCourses.length - 1];
  $('#recommendLessonTitle').textContent = next ? `第 ${next.num} 课 · ${next.title}` : '当前难度暂无课程';
  $('#recommendLessonText').textContent = next ? next.summary : '请切换其他难度继续学习。';
  $('#recommendLessonButton').dataset.lessonId = next ? next.id : '';
  const roadmapTitle = $('#roadmapTitle');
  if (roadmapTitle) roadmapTitle.textContent = (state.settings.level === 'CET4' ? 'CET-4' : state.settings.level) + ' 学习路线';
  $('#roadmapSummary').textContent = `${LEVEL_LABELS[state.settings.level]} · ${levelCourses.length} 个模块`;
  $('#homeRoadmap').innerHTML = levelCourses.map(item => {
    const isDone = !item.advanced && state.progress.completed[item.id] && state.progress.completed[item.id].completed;
    return `<button class="roadmap-card ${isDone ? 'done' : ''}" type="button" data-course-id="${item.id}"><i></i><span>${courseLevel(item)} · 第 ${item.num} 课</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.subtitle)}</small></button>`;
  }).join('');
  updateStats();
}
function renderLessonFilters() {
  const levelCourses = coursesForLevel();
  const groups = ['all'].concat(Array.from(new Set(levelCourses.map(item => item.group))));
  if (!groups.includes(state.lessonFilter)) state.lessonFilter = 'all';
  const labels = { all: '当前难度全部课程' };
  $('#lessonFilters').innerHTML = groups.map(group => `<button class="filter-button ${state.lessonFilter === group ? 'active' : ''}" type="button" data-lesson-filter="${group}">${escapeHtml(labels[group] || group)}</button>`).join('');
}
function renderLessonGrid() {
  const levelCourses = coursesForLevel();
  const items = state.lessonFilter === 'all' ? levelCourses : levelCourses.filter(item => item.group === state.lessonFilter);
  $('#lessonGrid').innerHTML = items.map(item => {
    const done = !item.advanced && state.progress.completed[item.id] && state.progress.completed[item.id].completed;
    const score = done ? ` · ${state.progress.completed[item.id].score}%` : '';
    return `<button class="lesson-card ${done ? 'done' : ''}" type="button" data-course-id="${item.id}">
      <div class="lesson-card-top"><span class="lesson-number">${String(item.num).padStart(2, '0')}</span><span class="lesson-status">${item.microTopic ? '微专题' : (item.advanced ? '进阶课程' : (done ? '已完成' + score : '未完成'))}</span></div>
      <h3>${escapeHtml(item.title)}</h3><span class="subtitle">${escapeHtml(item.subtitle)}</span><p>${escapeHtml(item.summary)}</p>
      <footer>${item.microTopic ? '5 道基础题 · AI 专项' : (item.advanced ? '生成对应难度文章' : '8 道练习 · 70% 完成')}</footer>
    </button>`;
  }).join('') || '<div class="empty-state"><h2>当前难度暂无课程</h2><p>请切换其他难度。</p></div>';
}
function renderGrammar() {
  renderLessonFilters();
  renderLessonGrid();
  updateStats();
}

function feedbackHtml(result, text, type = '') {
  if (result === null || result === undefined) return text ? `<div class="answer-feedback info">${escapeHtml(text)}</div>` : '';
  return `<div class="answer-feedback ${result ? 'ok' : 'no'}">${escapeHtml(text || (result ? '回答正确。' : '再检查一下。'))}</div>`;
}
function fillRequirement(question) {
  if (question.answer.includes(';')) return '答题要求：按顺序填写每个空，用分号隔开；必须符合题目给出的语法范围。';
  const count = normalizeAnswer(question.answer).split(/\s+/).filter(Boolean).length;
  const range = question.hint ? `；语法范围：${question.hint}` : '';
  return `答题要求：只填写 ${count} 个英文单词，不要重写整句${range}。若有多个答案符合语法和句意，AI 会按正确答案处理。`;
}
function renderMcq(question, index, session) {
  const selected = session.answers.mcq[index];
  return `<div class="practice-question"><span class="question-label">选择题 ${index + 1}</span><div class="question-text">${escapeHtml(question.q)}</div><div class="answer-requirements">答题要求：只选择一个最符合题意的答案。</div><div class="option-list">
    ${question.options.map((option, optionIndex) => {
      const classes = [];
      if (selected === optionIndex) classes.push('selected');
      if (session.submitted) {
        if (optionIndex === question.answer) classes.push('correct');
        else if (selected === optionIndex) classes.push('incorrect');
      }
      return `<button class="option-button ${classes.join(' ')}" type="button" data-mcq-index="${index}" data-option-index="${optionIndex}" ${session.submitted ? 'disabled' : ''}>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</button>`;
    }).join('')}
  </div>${session.submitted ? feedbackHtml(session.results.mcq[index], session.feedback.mcq[index] || question.explain) : ''}</div>`;
}
function renderFill(question, index, session) {
  const value = session.answers.fill[index] || '';
  const result = session.results.fill[index];
  const feedback = session.feedback.fill[index] || (result ? '回答正确。' : `参考答案：${question.answer}。${question.explain}`);
  return `<div class="practice-question"><span class="question-label">填空题 ${index + 1}</span><div class="question-text">${escapeHtml(question.q)}</div><div class="answer-requirements">${escapeHtml(fillRequirement(question))}</div><input class="fill-input" data-fill-index="${index}" value="${escapeHtml(value)}" ${session.submitted ? 'disabled' : ''} placeholder="${escapeHtml(question.hint || '输入答案')}">${session.submitted ? feedbackHtml(result, feedback) : ''}</div>`;
}
function renderTranslation(question, index, session) {
  const value = session.answers.translations[index] || '';
  const result = session.results.translations[index];
  let feedback = '';
  if (session.submitted) {
    if (result === null || result === undefined) {
      feedback = `<div class="answer-feedback info">参考答案：${escapeHtml(question.answer)}<div class="self-grade"><button type="button" data-self-grade="true" data-translation-index="${index}">我写对了</button><button type="button" data-self-grade="false" data-translation-index="${index}">仍需练习</button></div></div>`;
    } else {
      feedback = feedbackHtml(result, session.feedback.translations[index] || `参考答案：${question.answer}`);
    }
  }
  return `<div class="practice-question"><span class="question-label">翻译题 ${index + 1}</span><div class="question-text">${escapeHtml(question.zh)}</div><div class="answer-requirements">答题要求：完整翻译整句，不要求和参考答案逐字相同；AI 会判断语义和语法。</div><textarea class="translation-input" data-translation-index="${index}" ${session.submitted ? 'disabled' : ''} placeholder="写下你的英文翻译">${escapeHtml(value)}</textarea>${feedback}</div>`;
}
function renderLessonPractice(lesson) {
  const session = state.lessonSession;
  const total = lesson.mcq.length + lesson.fill.length + lesson.translations.length;
  const all = session.results.mcq.concat(session.results.fill, session.results.translations);
  const definite = all.filter(value => value !== null && value !== undefined);
  const correct = definite.filter(Boolean).length;
  const percent = session.submitted ? Math.round(correct / total * 100) : 0;
  const resultText = session.submitted ? `本次练习正确率：${correct}/${total}，即 ${percent}%。${percent >= 70 ? '本课已标记完成。' : '本次练习未达到 70%，可以重做。'}` : '';
  return `<div class="content-card"><h2>课堂练习</h2><p class="muted">共 ${total} 题。提交后 AI 统一批改选择题、填空题和翻译题，并给出逐题反馈；未配置 AI 时使用本地答案判定和自评。</p>
    <div id="practiceQuestions">${lesson.mcq.map((q, i) => renderMcq(q, i, session)).join('')}${lesson.fill.map((q, i) => renderFill(q, i, session)).join('')}${lesson.translations.map((q, i) => renderTranslation(q, i, session)).join('')}</div>
    <div class="practice-result ${session.submitted ? 'show' : ''}"><span class="eyebrow">练习结果</span><strong>${session.submitted ? percent + '%' : ''}</strong><p>${resultText}</p></div>
    <div class="form-actions"><button class="primary-button" type="button" data-action="submit-practice" ${session.submitted ? 'disabled' : ''}>${isAIConfigured() ? '提交并交给 AI 批改' : '提交练习'}</button><button class="secondary-button" type="button" data-action="reset-practice">重做本课</button></div>
  </div>`;
}function videoForCourse(courseId) {
  const course = findCourse(courseId);
  if (course && course.video) return course.video;
  return typeof lessonVideos !== 'undefined' ? lessonVideos[courseId] : null;
}
function videoQualityHtml(video) {
  if (!video || !video.matchQuality) return '';
  const exact = video.matchQuality === 'exact';
  const label = exact ? '\u7cbe\u51c6\u5339\u914d' : '\u76f8\u5173\u8bb2\u89e3 \u00b7 \u5408\u96c6\u590d\u7528';
  return `<span class="video-quality ${exact ? 'exact' : 'partial'}">${label}</span>`;
}
function renderLessonVideoHtml(courseId) {
  const video = videoForCourse(courseId);
  if (!video) return '';
  const player = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(video.bvid)}&page=${video.page || 1}&high_quality=1&danmaku=0`;
  return `<article class="content-card video-lesson-card"><div class="video-heading"><div><span class="eyebrow">视频授课</span><h2>${escapeHtml(video.title)}</h2>${videoQualityHtml(video)}</div><span class="video-teacher">${escapeHtml(video.teacher)}</span></div><button class="video-launch" type="button" data-action="play-video" data-video-src="${player}" data-video-title="${escapeHtml(video.title)}"><span>▶</span><strong>点击播放视频课程</strong><small>加载 B 站官方播放器 · 倍速请在 B 站播放器内设置（最高 2 倍速）</small></button><p class="video-note">${escapeHtml(video.note || '配套语法讲解')}</p><a class="text-button" href="${video.source}" target="_blank" rel="noopener noreferrer">在 B 站打开原视频 →</a></article>`;
}
function updateReadingVideo() {
  const panel = $('#lessonVideoPanel');
  if (!panel) return;
  const courseId = $('#articleGrammar').value;
  const video = videoForCourse(courseId);
  if (!video) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }
  const player = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(video.bvid)}&page=${video.page || 1}&high_quality=1&danmaku=0`;
  panel.classList.remove('hidden');
  panel.innerHTML = `<span class="eyebrow">视频授课</span><h3>${escapeHtml(video.title)}</h3>${videoQualityHtml(video)}<p>${escapeHtml(video.note || '')}</p><small>来源：${escapeHtml(video.teacher)}</small><button class="video-launch compact" type="button" data-action="play-video" data-video-src="${player}" data-video-title="${escapeHtml(video.title)}"><span>▶</span><strong>点击播放视频课程</strong><small>加载 B 站官方播放器 · 倍速请在 B 站播放器内设置（最高 2 倍速）</small></button><a class="text-button" href="${video.source}" target="_blank" rel="noopener noreferrer">在 B 站观看 →</a>`;
}
function renderLessonDetail(lesson) {
  const done = state.progress.completed[lesson.id] && state.progress.completed[lesson.id].completed;
  const previous = lessonByOffset(lesson.id, -1);
  const next = lessonByOffset(lesson.id, 1);
  $('#lessonDetail').innerHTML = `
    <nav class="breadcrumb" aria-label="课程位置"><button type="button" data-view="grammar">语法课堂</button><span>/</span><span>${escapeHtml(lesson.group || '课程')}</span><span>/</span><strong>${escapeHtml(lesson.title)}</strong></nav>
    <div class="lesson-top-nav"><button class="secondary-button" type="button" data-lesson-id="${previous ? previous.id : ''}" ${previous ? '' : 'disabled'}>← 上一课</button><button class="secondary-button" type="button" data-lesson-id="${next ? next.id : ''}" ${next ? '' : 'disabled'}>下一课 →</button></div>
    <div class="lesson-detail-header"><div><span class="eyebrow">${courseLevel(lesson)} · LESSON ${String(lesson.num).padStart(2, '0')}</span><h1 id="lessonTitle">${escapeHtml(lesson.title)}</h1><span class="subtitle">${escapeHtml(lesson.subtitle)}</span><p>${escapeHtml(lesson.summary)}</p></div><div class="lesson-header-badge"><strong>${lesson.num}</strong><span>${done ? '已完成' : '学习中'}</span></div></div>
    <div class="lesson-content-grid">
      <div class="lesson-main-column">
        ${renderLessonVideoHtml(lesson.id)}<article class="content-card"><h2>核心结构</h2><div class="formula-block">${escapeHtml(lesson.formula)}</div><h3>使用规则</h3><ul class="rule-list">${lesson.rules.map(rule => `<li><strong>${escapeHtml(rule[0])}</strong>：${escapeHtml(rule[1])}</li>`).join('')}</ul></article>
        <article class="content-card"><h2>正误例句</h2><div class="example-list">${lesson.examples.map(example => `<div class="example-row ${example.good ? 'good' : 'bad'}"><div class="en">${example.good ? '✓' : '×'} ${escapeHtml(example.en)}</div><div class="zh">${escapeHtml(example.zh)}</div><div class="note">${escapeHtml(example.note)}</div></div>`).join('')}</div></article>
        ${renderLessonPractice(lesson)}
      </div>
      <aside class="lesson-side-column">
        <div class="content-card"><span class="eyebrow">学习提醒</span><h2>常见错误</h2><ul class="mistake-list">${lesson.mistakes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        <div class="content-card"><span class="eyebrow">完成标准</span><h2>至少答对 70%</h2><p class="muted">提交练习后系统会记录正确率。低于 70% 可以重做。</p>${done ? '<span class="done-stamp">本课已完成</span>' : ''}</div>
        <div class="lesson-nav"><button class="secondary-button" type="button" data-lesson-id="${previous ? previous.id : ''}" ${previous ? '' : 'disabled'}>← 上一课</button><button class="secondary-button" type="button" data-lesson-id="${next ? next.id : ''}" ${next ? '' : 'disabled'}>下一课 →</button></div>
      </aside>
    </div>`;
}
function openLesson(id) {
  const lesson = findCourse(id);
  if (!lesson) return;
  state.progress.lastLessonId = id;
  writeJSON(STORAGE.progress, state.progress);
  touchStudy();
  state.lessonSession = { answers: { mcq: {}, fill: {}, translations: {} }, results: { mcq: Array(lesson.mcq.length).fill(null), fill: Array(lesson.fill.length).fill(null), translations: Array(lesson.translations.length).fill(null) }, feedback: { mcq: {}, fill: {}, translations: {} }, submitted: false };
  renderLessonDetail(lesson);
  showView('lesson');
}
function collectPracticeAnswers(lesson) {
  const session = state.lessonSession;
  lesson.fill.forEach((question, index) => { const input = $(`[data-fill-index="${index}"]`); session.answers.fill[index] = input ? input.value : ''; });
  lesson.translations.forEach((question, index) => { const input = $(`[data-translation-index="${index}"]`); session.answers.translations[index] = input ? input.value : ''; });
}

function updateLessonScore(lesson) {
  const session = state.lessonSession;
  const all = session.results.mcq.concat(session.results.fill, session.results.translations);
  const ready = all.every(value => value !== null && value !== undefined);
  const correct = all.filter(Boolean).length;
  const score = Math.round(correct / all.length * 100);
  session.score = score;
  session.ready = ready;
  if (ready && score >= 70) {
    state.progress.completed[lesson.id] = { completed: true, score, completedAt: Date.now() };
    writeJSON(STORAGE.progress, state.progress);
    updateStats();
    renderLessonGrid();
    renderHome();
  }
}
function localPracticeResults(lesson) {
  const session = state.lessonSession;
  const mcq = lesson.mcq.map((question, index) => session.answers.mcq[index] === question.answer);
  const fill = lesson.fill.map((question, index) => normalizeAnswer(session.answers.fill[index]) === normalizeAnswer(question.answer));
  const translations = lesson.translations.map((question, index) => {
    const accepted = [question.answer].concat(question.accepts || []).map(normalizeAnswer);
    return accepted.includes(normalizeAnswer(session.answers.translations[index])) ? true : null;
  });
  const feedback = { mcq: {}, fill: {}, translations: {} };
  lesson.mcq.forEach((question, index) => { feedback.mcq[index] = localFeedbackText(mcq[index], question.options[question.answer], question.explanation); });
  lesson.fill.forEach((question, index) => { feedback.fill[index] = localFeedbackText(fill[index], question.answer, question.explanation); });
  lesson.translations.forEach((question, index) => { feedback.translations[index] = localFeedbackText(translations[index] === true, question.answer, question.explanation); });
  return { mcq, fill, translations, feedback };
}
function applyAIGrades(results, grades) {
  const apply = (type, list) => {
    list.forEach((question, index) => {
      const item = (grades[type] || []).find(entry => Number(entry.index) === index);
      if (type !== 'mcq' && item && typeof item.correct === 'boolean') results[type][index] = item.correct;
      if (item && item.feedback) {
        const aiFeedback = String(item.feedback).trim();
        const fallback = results.feedback[type][index] || localFeedbackText(false, question.answer || question.referenceAnswer || '', question.explanation);
        const negative = /\u5224\u9519|\u9519\u8bef|\u4e0d\u6b63\u786e|\u7b54\u9519|wrong|incorrect/i.test(aiFeedback);
        const positive = /\u6b63\u786e|\u7b54\u5bf9|correct|right/i.test(aiFeedback) && !/\u4e0d|wrong|incorrect/i.test(aiFeedback);
        const contradicts = type === 'mcq' && ((results[type][index] === true && negative) || (results[type][index] === false && positive));
        results.feedback[type][index] = hasChineseFeedback(aiFeedback) && !contradicts ? ('AI \u6279\u6539\uff1a' + aiFeedback) : fallback;
      }
    });
  };
  apply('mcq', results.mcq);
  apply('fill', results.fill);
  apply('translations', results.translations);
  return results;
}
async function submitPractice(lesson) {
  if (state.lessonSession.submitted) return;
  collectPracticeAnswers(lesson);
  const session = state.lessonSession;
  let results = localPracticeResults(lesson);
  session.submitted = true;
  if (isAIConfigured()) {
    setLoading(true, 'AI 正在批改整组练习…');
    try {
      const grades = await gradeLessonWithAI(lesson);
      results = applyAIGrades(results, grades);
    } catch (error) {
      console.warn('AI 整组批改失败，使用本地判定', error);
      showToast('AI 批改失败，已使用本地判定和自评');
    } finally {
      setLoading(false);
    }
  }
  session.results = { mcq: results.mcq, fill: results.fill, translations: results.translations };
  session.feedback = results.feedback;
  updateLessonScore(lesson);
  renderLessonDetail(lesson);
  if (!session.ready) showToast('部分翻译题需要对照参考答案自评');
  else if (isAIConfigured()) showToast('AI 已完成整组批改');
  else showToast(session.score >= 70 ? '练习完成，已记录本课进度' : '本次未达到 70%，可以重做');
}function resetPractice(lesson) {
  openLesson(lesson.id);
  showToast('已重置本课练习');
}

function apiChatUrl(baseUrl) {
  const base = String(baseUrl || '').trim().replace(/\/+$/, '');
  return /\/chat\/completions$/i.test(base) ? base : base + '/chat/completions';
}
function extractJSON(text) {
  const clean = String(text || '').replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(clean); } catch (error) {
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(clean.slice(start, end + 1));
    throw new Error('AI 未返回有效 JSON');
  }
}
async function callAI(messages, temperature = 0.5, externalSignal = null) {
  if (!isAIConfigured()) throw new Error('AI 尚未配置');
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  if (externalSignal) externalSignal.addEventListener('abort', forwardAbort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(apiChatUrl(state.settings.baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.settings.apiKey}` },
      body: JSON.stringify({ model: state.settings.model, temperature, messages }),
      signal: controller.signal
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`AI 请求失败（${response.status}）：${raw.slice(0, 180)}`);
    const data = JSON.parse(raw);
    const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('AI 响应中没有文本内容');
    return content;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('AI 请求超时');
    throw error;
  } finally {
    clearTimeout(timeout);
    if (externalSignal) externalSignal.removeEventListener('abort', forwardAbort);
  }
}
async function gradeLessonWithAI(lesson) {
  const session = state.lessonSession;
  const payload = {
    mcq: lesson.mcq.map((question, index) => ({ index, question: question.q, options: question.options, officialAnswer: question.options[question.answer], studentAnswer: session.answers.mcq[index] == null ? '' : question.options[session.answers.mcq[index]] })),
    fill: lesson.fill.map((question, index) => ({ index, question: question.q, referenceAnswer: question.answer, requirement: fillRequirement(question), grammarHint: question.hint || '', studentAnswer: session.answers.fill[index] })),
    translations: lesson.translations.map((question, index) => ({ index, chinese: question.zh, referenceAnswer: question.answer, studentAnswer: session.answers.translations[index] }))
  };
  const messages = [
    { role: 'system', content: 'You are a strict but fair English teacher. Grade the whole exercise. All feedback strings MUST be in Simplified Chinese. Keep English only in question text, student answers, reference answers, and corrected English examples. Return JSON only, without Markdown. Structure: {"mcq":[{"index":0,"correct":true,"feedback":"..."}],"fill":[{"index":0,"correct":true,"feedback":"..."}],"translations":[{"index":0,"correct":true,"feedback":"..."}]}. Each array must cover every item.' },
    { role: 'user', content: JSON.stringify(payload) }
  ];
  const parsed = extractJSON(await callAI(messages, 0));
  return {
    mcq: Array.isArray(parsed.mcq) ? parsed.mcq : [],
    fill: Array.isArray(parsed.fill) ? parsed.fill : [],
    translations: Array.isArray(parsed.translations) ? parsed.translations : []
  };
}
function lookupDictionary(raw) {
  const word = normalizeWord(raw);
  const candidates = [word, aliases[word], word.replace(/ies$/, 'y'), word.replace(/es$/, ''), word.replace(/s$/, ''), word.replace(/ed$/, ''), word.replace(/ing$/, '')].filter(Boolean);
  for (const key of candidates) {
    if (dictionary[key]) return { word, meaningZh: dictionary[key], phonetic: phonetics[key] || '' };
  }
  return { word, meaningZh: '', phonetic: '' };
}
function buildVocabulary(sentences) {
  const seen = new Set();
  const vocabulary = [];
  sentences.forEach(sentence => {
    String(sentence.en || '').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)?.forEach(raw => {
      const word = normalizeWord(raw);
      if (!word || seen.has(word)) return;
      seen.add(word);
      const info = lookupDictionary(word);
      if (info.meaningZh) vocabulary.push({ word, phonetic: info.phonetic, meaningZh: info.meaningZh, contextZh: sentence.zh || '', example: sentence.en || '' });
    });
  });
  return vocabulary;
}
function validateAIArticle(raw, course, level, topicId) {
  if (!raw || typeof raw !== 'object') throw new Error('AI 文章格式错误');
  const sentences = Array.isArray(raw.sentences) ? raw.sentences.filter(item => item && item.en && item.zh).map(item => ({ en: String(item.en).trim(), zh: String(item.zh).trim(), grammarNote: String(item.grammarNote || ''), paragraph: Number.isInteger(item.paragraph) ? Math.max(0, item.paragraph) : 0 })) : [];
  if (!raw.title || sentences.length < 6) throw new Error('AI 文章缺少标题或有效内容');
  const vocabulary = Array.isArray(raw.vocabulary) ? raw.vocabulary.filter(item => item && item.word).map(item => ({ word: normalizeWord(item.word), phonetic: String(item.phonetic || ''), meaningZh: String(item.meaningZh || ''), contextZh: String(item.contextZh || ''), example: String(item.example || '') })) : buildVocabulary(sentences);
  return { id: uid(), source: 'AI', level, grammarId: course.id, topicId, title: String(raw.title).trim(), titleZh: String(raw.titleZh || '').trim(), grammarFocus: String(raw.grammarFocus || course.title).trim(), sentences, vocabulary, markedWords: {}, viewState: { allTranslations: false, allGrammar: false, sentenceTranslations: {}, sentenceGrammar: {} }, createdAt: Date.now() };
}function buildArticleMessages(course, level, topicId) {
  const topicNames = { life: '日常生活', school: '校园学习', family: '家庭朋友', travel: '旅行见闻', hobby: '兴趣爱好' };
  const levelRules = { A1: '使用极简单句，文章 60-90 词。', A2: '使用基础连接词，文章 90-120 词。', B1: '使用自然段落和基础从句，文章 120-160 词。', CET4: '按大学英语四级阅读难度，文章 160-220 词，中文解释保持通俗。' };
  const system = `你是一名严谨的中国英语老师。你只为零基础到四级学习者写英语阅读。文章必须是完整、连贯的短文，不要写成逐句罗列或语法例句清单。只输出一个 JSON 对象，不要 Markdown 代码块。JSON 结构的字段顺序必须为：{"title":"英文标题","titleZh":"中文标题","grammarFocus":"语法重点","sentences":[{"en":"英文句子","zh":"准确中文翻译","grammarNote":"该句目标语法说明","paragraph":0}],"vocabulary":[{"word":"小写原词","phonetic":"音标可留空","meaningZh":"结合本文的中文释义","contextZh":"本句中文解释","example":"包含该词的英文例句"}]}。paragraph 从 0 开始表示第几段。`;
  const user = `目标语法：${course.title}（${course.formula}）。\n难度：${level}。${levelRules[level] || levelRules.A1}\n主题：${topicNames[topicId] || '日常生活'}。\n写成 2-4 个自然段，每段 2-4 句，至少出现 4 次目标结构。所有句子按文章顺序放入 sentences 数组，不要逐句加标题或单独解释。词汇表覆盖主要实词。`;
  return [{ role: 'system', content: system }, { role: 'user', content: user }];
}
function parseJsonStringValue(raw, key) {
  const marker = `"${key}"`;
  const markerIndex = raw.indexOf(marker);
  if (markerIndex < 0) return '';
  let index = raw.indexOf(':', markerIndex + marker.length);
  if (index < 0) return '';
  while (index + 1 < raw.length && /\s/.test(raw[index + 1])) index++;
  if (raw[index + 1] !== '"') return '';
  const start = index + 1;
  let escaped = false;
  for (let i = start + 1; i < raw.length; i++) {
    const char = raw[i];
    if (char === '"' && !escaped) {
      try { return JSON.parse(raw.slice(start, i + 1)); } catch (error) { return ''; }
    }
    if (char === '\\' && !escaped) escaped = true;
    else escaped = false;
  }
  return '';
}
function completeSentenceObjects(raw) {
  const marker = '"sentences"';
  const markerIndex = raw.indexOf(marker);
  if (markerIndex < 0) return [];
  const arrayStart = raw.indexOf('[', markerIndex + marker.length);
  if (arrayStart < 0) return [];
  const objects = [];
  let depth = 0;
  let objectStart = -1;
  let inString = false;
  let escaped = false;
  for (let i = arrayStart + 1; i < raw.length; i++) {
    const char = raw[i];
    if (inString) {
      if (char === '"' && !escaped) inString = false;
      if (char === '\\' && !escaped) escaped = true;
      else escaped = false;
      continue;
    }
    if (char === '"') { inString = true; continue; }
    if (char === '{') { if (depth === 0) objectStart = i; depth++; }
    else if (char === '}') {
      depth--;
      if (depth === 0 && objectStart >= 0) {
        try { const item = JSON.parse(raw.slice(objectStart, i + 1)); if (item && item.en) objects.push(item); } catch (error) {}
        objectStart = -1;
      }
    } else if (char === ']' && depth === 0) break;
  }
  return objects;
}
function parsePartialArticle(raw, course, level, topicId) {
  const title = parseJsonStringValue(raw, 'title');
  const items = completeSentenceObjects(raw);
  if (!title || !items.length) return null;
  const sentences = items.map((item, index) => ({ en: String(item.en || '').trim(), zh: String(item.zh || '').trim(), grammarNote: String(item.grammarNote || ''), paragraph: Number.isInteger(item.paragraph) ? Math.max(0, item.paragraph) : Math.floor(index / 3) })).filter(item => item.en);
  if (!sentences.length) return null;
  return { id: 'streaming-article', source: 'AI', partial: true, level, grammarId: course.id, topicId, title: String(title).trim(), titleZh: parseJsonStringValue(raw, 'titleZh').trim(), grammarFocus: parseJsonStringValue(raw, 'grammarFocus').trim() || course.title, sentences, vocabulary: buildVocabulary(sentences), markedWords: {}, viewState: { allTranslations: false, allGrammar: false, sentenceTranslations: {}, sentenceGrammar: {} }, createdAt: Date.now() };
}
﻿async function callAIStream(messages, temperature, onDelta, externalSignal) {
  if (!isAIConfigured()) throw new Error('AI 尚未配置');
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  if (externalSignal) externalSignal.addEventListener('abort', forwardAbort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(apiChatUrl(state.settings.baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'Authorization': `Bearer ${state.settings.apiKey}` },
      body: JSON.stringify({ model: state.settings.model, temperature, messages, stream: true }),
      signal: controller.signal
    });
    if (!response.ok) {
      const raw = await response.text();
      const error = new Error(`AI 请求失败（${response.status}）：${raw.slice(0, 180)}`);
      error.streamUnsupported = [400, 404, 405, 415, 422].includes(response.status);
      throw error;
    }
    if (!response.body || !response.body.getReader) throw new Error('当前服务不支持流式输出');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let content = '';
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      buffer += decoder.decode(part.value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        let line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line || line.startsWith(':')) continue;
        if (line.startsWith('data:')) line = line.slice(5).trim();
        if (line === '[DONE]') continue;
        try {
          const data = JSON.parse(line);
          const choice = data && data.choices && data.choices[0];
          let delta = choice && ((choice.delta && choice.delta.content) || choice.text);
          if (Array.isArray(delta)) delta = delta.map(item => item && item.text ? item.text : '').join('');
          if (typeof delta === 'string' && delta) { content += delta; onDelta(delta, content); }
        } catch (error) {}
      }
    }
    if (!content) throw new Error('流式响应为空');
    return content;
  } finally {
    clearTimeout(timeout);
    if (externalSignal) externalSignal.removeEventListener('abort', forwardAbort);
  }
}
function articleTypeSpec(articleType, level) {
  if (level === 'CET4') return { wordBank: '200-250 词', careful: '300-350 词', long: '900-1000 词' }[articleType] || '300-350 词';
  return { A1: '60-90 词', A2: '90-120 词', B1: '120-160 词' }[level] || '120-160 词';
}
function buildArticleTextMessages(course, level, topicId, articleType, chunk = null) {
  const topicNames = { life: '日常生活', school: '校园学习', family: '家庭朋友', travel: '旅行见闻', hobby: '兴趣爱好' };
  const difficulty = level === 'CET4' ? '大学英语四级阅读难度，接近 CEFR B1-B2，使用四级常用词汇、自然逻辑连接和考试常见主题，句子难度符合四级考试。' : '使用与当前等级匹配的词汇和句子。';
  const length = articleTypeSpec(articleType, level);
  if (articleType === 'long' && chunk) {
    const first = chunk.index === 0;
    return [{ role: 'system', content: `你是英语老师。${first ? '第一行英文标题，第二行中文标题，第三行留空，然后' : '只输出续写正文，不要重复标题，'}写第 ${chunk.index + 1}/${chunk.total} 段，约 300-330 个英文词。只输出纯文本。` }, { role: 'user', content: `目标语法：${course.title}。主题：${topicNames[topicId] || '日常生活'}。${difficulty}${chunk.tail ? `\n保持上下文连续。前文结尾：${chunk.tail}` : ''}` }];
  }
  return [{ role: 'system', content: '你是英语老师。只输出纯文本，不要 JSON、Markdown、解释或额外标题。第一行是英文标题，第二行是中文标题，第三行留空，之后是 2-4 段连续英文正文。正文必须自然连贯。' }, { role: 'user', content: `目标语法：${course.title}（${course.formula}）。难度：${level}，${difficulty}${level === 'CET4' ? `阅读题型：${articleType === 'wordBank' ? '四级选词填空文章' : articleType === 'long' ? '四级长篇阅读文章' : '四级仔细阅读文章'}，全文约 ${length}。` : `全文约 ${length}。`}主题：${topicNames[topicId] || '日常生活'}。至少自然出现 4 次目标结构。` }];
}
function parsePlainArticle(raw, course, level, topicId, articleType = 'careful') {
  const clean = String(raw || '').replace(/```(?:text|markdown)?/gi, '').replace(/```/g, '').trim();
  const lines = clean.split(/\r?\n/);
  let first = -1;
  let second = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() && first < 0) { first = i; continue; }
    if (first >= 0 && lines[i].trim() && second < 0) { second = i; break; }
  }
  if (first < 0 || second < 0) return null;
  const title = lines[first].trim().replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '');
  const titleZh = lines[second].trim().replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '');
  const body = lines.slice(second + 1).join('\n').trim();
  if (!body) return null;
  const paragraphs = body.split(/\n\s*\n/).map(item => item.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  const sentences = [];
  paragraphs.forEach((paragraph, paragraphIndex) => {
    const matches = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    matches.map(item => item.trim()).filter(Boolean).forEach(en => sentences.push({ en, zh: '', grammarNote: '', paragraph: paragraphIndex }));
  });
  if (!sentences.length) return null;
  const article = { id: uid(), source: 'AI', partial: false, metadataPending: true, level, articleType, grammarId: course.id, topicId, title, titleZh, grammarFocus: course.title, sentences, vocabulary: buildVocabulary(sentences), markedWords: {}, viewState: { allTranslations: false, allGrammar: false, sentenceTranslations: {}, sentenceGrammar: {} }, createdAt: Date.now() };
  return Object.assign(article, analyzeCET4Coverage(article));
}
const CET4_IGNORED_WORDS = new Set(['the','a','an','and','or','but','is','are','was','were','be','been','being','am','do','does','did','have','has','had','can','could','will','would','should','may','might','must','to','of','in','on','at','for','from','with','without','by','as','it','this','that','these','those','i','you','he','she','we','they','my','your','his','her','our','their','me','him','us','them','not','no','yes','there','here','very','too','also','so','if','when','because','while','after','before','than','then','more','most','some','any','many','much','every','all','one','two','three','four','five','first','next','last']);
function analyzeCET4Coverage(article) {
  const basicWords = new Set(Object.keys(dictionary).map(normalizeWord));
  const words = Array.from(new Set(article.sentences.flatMap(item => String(item.en || '').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []).map(word => normalizeWord(word)).filter(word => word && word.length > 2 && !CET4_IGNORED_WORDS.has(word) && !basicWords.has(word))));
  const inList = words.filter(word => typeof CET4_WORDS !== 'undefined' && CET4_WORDS.has(word));
  const outOfList = words.filter(word => !(typeof CET4_WORDS !== 'undefined' && CET4_WORDS.has(word)));
  return { cet4Coverage: words.length ? Math.round(inList.length / words.length * 100) : 100, outOfList };
}
async function simplifyArticleForCET4(article, course, signal) {
  const text = `${article.title}\n${article.titleZh}\n\n${article.sentences.map(item => item.en).join(' ')}`;
  const messages = [{ role: 'system', content: '你是英语老师。请改成四级词汇覆盖至少95%的版本，保持题型、篇幅和原意。只输出纯文本，第一行英文标题，第二行中文标题，第三行留空，之后为正文。' }, { role: 'user', content: `需要避免或替换的超纲词：${article.outOfList.slice(0, 60).join(', ')}\n原文：\n${text}` }];
  const content = await callAI(messages, 0.3, signal);
  const revised = parsePlainArticle(content, course, article.level, article.topicId, article.articleType);
  return revised && revised.cet4Coverage >= article.cet4Coverage ? revised : article;
}
function buildArticleMetadataMessages(article, course, indexes) {
  const items = indexes.map(index => ({ index, en: article.sentences[index].en }));
  return [{ role: 'system', content: '你是英语老师。只输出 JSON，不要 Markdown。结构必须是：{"sentences":[{"index":0,"zh":"准确中文翻译","grammarNote":"该句语法说明"}]}。必须覆盖每个输入句子。' }, { role: 'user', content: `目标语法：${course.title}。翻译并解释这些句子：\n${JSON.stringify(items)}` }];
}
async function enrichArticleWithAI(article, course, signal) {
  const merged = new Map();
  for (let start = 0; start < article.sentences.length; start += 10) {
    const indexes = article.sentences.map((_, index) => index).slice(start, start + 10);
    const content = await callAI(buildArticleMetadataMessages(article, course, indexes), 0.2, signal);
    const parsed = extractJSON(content);
    if (!parsed || !Array.isArray(parsed.sentences)) throw new Error('翻译与语法返回格式错误');
    parsed.sentences.forEach(item => merged.set(Number(item.index), item));
  }
  article.sentences = article.sentences.map((sentence, index) => {
    const item = merged.get(index) || {};
    return Object.assign({}, sentence, { zh: String(item.zh || '').trim(), grammarNote: String(item.grammarNote || '').trim() });
  });
  article.metadataPending = false;
  article.partial = false;
  return article;
}
function metadataEnrichmentFor(article) {
  const current = state.metadataEnrichment;
  return current && article && current.articleId === article.id ? current : null;
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function enrichArticleWithRetry(article, course, signal) {
  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    if (signal && signal.aborted) throw new Error('AI 请求已取消');
    state.metadataEnrichment = { articleId: article.id, attempt, retrying: attempt > 1 };
    if (state.currentArticle && state.currentArticle.id === article.id) renderArticle(article);
    try {
      await enrichArticleWithAI(article, course, signal);
      state.metadataEnrichment = null;
      return article;
    } catch (error) {
      lastError = error;
      if ((signal && signal.aborted) || (state.articleGeneration && state.articleGeneration.stopped)) throw error;
      if (attempt < 2) await delay(800);
    }
  }
  state.metadataEnrichment = null;
  throw lastError || new Error('补充失败');
}
async function generateAIArticleTextStream(course, level, topicId, articleType, onPartial, onProgress, signal) {
  const startedAt = Date.now();
  let firstDeltaAt = 0;
  let full = '';
  try {
    if (articleType === 'long' && level === 'CET4') {
      for (let chunkIndex = 0; chunkIndex < 3; chunkIndex++) {
        const tail = full.slice(-700);
        const messages = buildArticleTextMessages(course, level, topicId, articleType, { index: chunkIndex, total: 3, tail });
        const chunkText = await callAIStream(messages, 0.5, (delta, accumulated) => {
          if (!firstDeltaAt) firstDeltaAt = Date.now();
          onProgress({ mode: 'stream', chars: full.length + accumulated.length, firstDeltaMs: firstDeltaAt - startedAt, chunk: chunkIndex + 1, chunks: 3 });
          const combined = full + (full ? '\n\n' : '') + accumulated;
          const article = parsePlainArticle(combined, course, level, topicId, articleType);
          if (article) onPartial(article, false);
        }, signal);
        full += (full ? '\n\n' : '') + chunkText.trim();
      }
    } else {
      const messages = buildArticleTextMessages(course, level, topicId, articleType);
      full = await callAIStream(messages, 0.5, (delta, accumulated) => {
        if (!firstDeltaAt) firstDeltaAt = Date.now();
        onProgress({ mode: 'stream', chars: accumulated.length, firstDeltaMs: firstDeltaAt - startedAt });
        const article = parsePlainArticle(accumulated, course, level, topicId, articleType);
        if (article) onPartial(article, false);
      }, signal);
    }
    let article = parsePlainArticle(full, course, level, topicId, articleType);
    if (!article) throw new Error('文章正文格式不完整');
    if (level === 'CET4' && article.cet4Coverage < 95) {
      onProgress({ mode: 'stream', chars: full.length, firstDeltaMs: firstDeltaAt ? firstDeltaAt - startedAt : 0, refiningVocabulary: true });
      article = await simplifyArticleForCET4(article, course, signal);
    }
    return { article, streamed: true, firstDeltaMs: firstDeltaAt ? firstDeltaAt - startedAt : 0 };
  } catch (error) {
    const article = full ? parsePlainArticle(full, course, level, topicId, articleType) : null;
    if (error.name === 'AbortError') {
      if (article) return { article, streamed: true, partial: true, stopped: true };
      throw error;
    }
    onProgress({ mode: 'fallback', reason: error.message, chars: full.length });
    if (article) return { article, streamed: true, partial: true, error };
    const content = await callAI(buildArticleTextMessages(course, level, topicId, articleType), 0.5, signal);
    const fallbackArticle = parsePlainArticle(content, course, level, topicId, articleType);
    if (!fallbackArticle) throw new Error('普通请求返回的文章格式不完整');
    return { article: fallbackArticle, streamed: false, fallback: true, error };
  }
}

const localClosingParagraphs = {
  life: [articleSentence('Life is not always easy, but small routines can make it better.', '生活并不总是容易，但小的日常习惯可以让它变得更好。', '一般现在时'), articleSentence('I try to keep my room clean and my mind calm.', '我尽量保持房间整洁、内心平静。', '一般现在时'), articleSentence('At the end of the day, I write down one thing I learned.', '一天结束时，我会写下自己学到的一件事。', '一般现在时'), articleSentence('This simple habit helps me notice progress.', '这个简单习惯帮助我注意到进步。', '一般现在时')],
  school: [articleSentence('Our teacher often asks us to explain ideas in our own words.', '老师经常要求我们用自己的话解释观点。', '一般现在时'), articleSentence('This makes the lesson more active and useful.', '这让课堂更活跃、更有用。', '一般现在时'), articleSentence('After class, we compare notes and help each other.', '课后我们会对照笔记并互相帮助。', '一般现在时'), articleSentence('Little by little, difficult subjects become easier to understand.', '渐渐地，困难的科目变得更容易理解。', '一般现在时')],
  family: [articleSentence('Families do not always agree, but they can still listen to each other.', '家人并不总是意见一致，但依然可以互相倾听。', '一般现在时'), articleSentence('A kind word can change the mood of a whole room.', '一句友善的话能改变整个房间的气氛。', '一般现在时'), articleSentence('We share meals, stories and small everyday problems.', '我们分享饭菜、故事和日常小烦恼。', '一般现在时'), articleSentence('These moments make home feel safe and warm.', '这些时刻让家变得安全而温暖。', '一般现在时')],
  travel: [articleSentence('A journey is not only about the places we visit.', '一段旅程不只是关于我们参观的地方。', '一般现在时'), articleSentence('It is also about the people we meet and the things we notice.', '它也关于我们遇见的人和注意到的事物。', '一般现在时'), articleSentence('Sometimes a wrong turn leads to a surprising view.', '有时一次走错路会带来意外的风景。', '一般现在时'), articleSentence('That is why travel can teach us to be more open.', '这就是旅行能教会我们更开放的原因。', '一般现在时')],
  hobby: [articleSentence('A hobby gives us a break from school and work.', '爱好让我们从学习和工作中得到休息。', '一般现在时'), articleSentence('It also helps us meet people who share our interests.', '它也帮助我们遇见有共同兴趣的人。', '一般现在时'), articleSentence('We do not have to be perfect to enjoy an activity.', '我们不必做到完美才能享受一项活动。', '一般现在时'), articleSentence('Practice slowly turns interest into real skill.', '练习会慢慢把兴趣变成真正的能力。', '一般现在时')]
};
function createLocalArticle(course, level, topicId) {
  const seed = advancedArticleSeeds[course.id] || localArticleSeeds[course.id] || ['A Short English Story', '一篇英语短文', course.title, [articleSentence('Learning English takes time and regular practice.', '学习英语需要时间和规律练习。', course.title), articleSentence('A short article can connect grammar with real meaning.', '一篇短文可以把语法和真实含义连接起来。', '一般现在时'), articleSentence('When we meet a difficult sentence, we look for its main verb.', '遇到难句时，我们寻找它的主要动词。', '一般现在时'), articleSentence('We can also use the surrounding words to understand a new expression.', '我们也可以利用上下文理解新表达。', '一般现在时'), articleSentence('Reading a little every day makes the language feel more familiar.', '每天读一点会让这门语言更熟悉。', '一般现在时'), articleSentence('The goal is not to translate every word, but to understand the whole idea.', '目标不是翻译每个词，而是理解整体意思。', '一般现在时')]];
  const sentences = clone(seed[3]);
  const closing = localClosingParagraphs[topicId] || localClosingParagraphs.life;
  closing.forEach(item => { if (!sentences.some(sentence => sentence.en === item.en)) sentences.push(clone(item)); });
  sentences.forEach((sentence, index) => { if (sentence.paragraph == null) sentence.paragraph = Math.floor(index / 4); });
  return { id: uid(), source: 'LOCAL', level, grammarId: course.id, topicId, title: seed[0], titleZh: seed[1], grammarFocus: seed[2], sentences, vocabulary: buildVocabulary(sentences), markedWords: {}, viewState: { allTranslations: false, allGrammar: false, sentenceTranslations: {}, sentenceGrammar: {} }, createdAt: Date.now() };
}function renderArticleHistory() {
  const panel = $('#articleHistoryPanel');
  if (!panel) return;
  const articles = state.articles || [];
  panel.innerHTML = `<div class="article-history-head"><h3>我的文章</h3><button class="card-menu-button" type="button" data-action="clear-article-history" ${articles.length ? '' : 'disabled'}>清空</button></div>${articles.length ? `<div class="article-history-list">${articles.map(article => `<div class="article-history-item"><button class="article-history-open" type="button" data-action="open-saved-article" data-article-id="${escapeHtml(article.id)}"><strong>${escapeHtml(article.title || '未命名文章')}${article.partial ? '<span class="partial-badge">未完成</span>' : (article.metadataPending ? '<span class="partial-badge">待补齐</span>' : '')}</strong><small>${escapeHtml(article.level || '')} · ${escapeHtml(article.grammarFocus || '')} · ${new Date(article.createdAt || Date.now()).toLocaleDateString('zh-CN')}</small></button><button class="article-history-delete" type="button" data-action="delete-saved-article" data-article-id="${escapeHtml(article.id)}">删除</button></div>`).join('')}</div>` : '<p class="article-history-empty">还没有已生成的文章。</p>'}`;
}
function openSavedArticle(id) {
  const article = (state.articles || []).find(item => item.id === id);
  if (!article) return;
  state.currentArticle = article;
  state.selectedSentenceIndex = null;
  const articleLevel = LEVEL_ORDER.includes(article.level) ? article.level : (state.settings.level || 'A1');
  if (state.settings.level !== articleLevel) {
    state.settings.level = articleLevel;
    writeJSON(STORAGE.settings, state.settings);
  }
  if (findCourse(article.grammarId)) {
    populateArticleSelects();
    renderLevelSwitchers();
    $('#articleGrammar').value = article.grammarId;
    $('#articleLevel').value = articleLevel;
    $('#articleTopic').value = article.topicId || 'life';
    if ($('#articleType')) {
      $('#articleType').value = articleLevel === 'CET4' && ['wordBank', 'careful', 'long'].includes(article.articleType) ? article.articleType : 'careful';
    }
    updateArticleTypeAvailability();
  }
  renderArticle(article);
  updateReadingVideo();
  showView('reading');
  $('#articlePaper').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function deleteSavedArticle(id) {
  state.articles = (state.articles || []).filter(article => article.id !== id);
  writeJSON(STORAGE.articles, state.articles);
  renderArticleHistory();
  showToast('文章已删除');
}
function clearArticleHistory() {
  if (!(state.articles || []).length) return;
  if (!confirm('确定删除全部历史文章吗？此操作不可恢复。')) return;
  state.articles = [];
  writeJSON(STORAGE.articles, state.articles);
  renderArticleHistory();
  showToast('历史文章已清空');
}
function saveArticle(article) {
  const existing = state.articles.filter(item => item.id !== article.id);
  state.articles = [article].concat(existing);
  writeJSON(STORAGE.articles, state.articles);
  renderArticleHistory();
}

function tokenizeSentence(text) {
  return String(text || '').split(/([A-Za-z]+(?:'[A-Za-z]+)?)/g).filter(Boolean).map(part => ({ isWord: /^[A-Za-z]/.test(part), text: part }));
}
function articleViewState(article) {
  if (!article.viewState) article.viewState = { allTranslations: false, allGrammar: false, sentenceTranslations: {}, sentenceGrammar: {} };
  article.viewState.sentenceTranslations = article.viewState.sentenceTranslations || {};
  article.viewState.sentenceGrammar = article.viewState.sentenceGrammar || {};
  return article.viewState;
}
function renderArticle(article) {
  state.currentArticle = article;
  const course = findCourse(article.grammarId) || { cues: [] };
  const view = articleViewState(article);
  const cueSet = new Set((course.cues || []).map(word => word.toLowerCase()));
  const savedKeys = new Set(Object.keys(state.vocabulary));
  const marked = article.markedWords || {};
  const enrichment = metadataEnrichmentFor(article);
  const metadataStatus = enrichment
    ? `<span id="articleMetadataStatus" class="metadata-inline-status" aria-live="polite">${enrichment.retrying ? '首次补充失败，正在自动重试…' : '正在自动补充中文和语法…'}</span>`
    : article.metadataPending && !article.partial && !state.articleGeneration
      ? '<button class="secondary-button" type="button" data-action="enrich-article">重试补充翻译和语法</button>'
      : '';
  const sourceLabel = article.partial ? 'AI 生成中' : (article.metadataPending ? 'AI 英文版' : (article.source === 'AI' ? 'AI 生成' : '本地文章'));
  const typeLabel = article.level === 'CET4' ? ({ wordBank: '选词填空 · 200–250词', careful: '仔细阅读 · 300–350词', long: '长篇阅读 · 900–1000词' })[article.articleType] || '' : '等级默认';
  const coverageLabel = article.level === 'CET4' && article.cet4Coverage != null ? '四级词汇覆盖 ' + article.cet4Coverage + '%' : '';
  const paragraphs = [];
  article.sentences.forEach((sentence, sentenceIndex) => {
    const paragraphIndex = Number.isInteger(sentence.paragraph) ? sentence.paragraph : Math.floor(sentenceIndex / 3);
    paragraphs[paragraphIndex] = paragraphs[paragraphIndex] || [];
    paragraphs[paragraphIndex].push({ sentence, sentenceIndex });
  });
  const body = paragraphs.map((items, paragraphIndex) => `<p class="passage-paragraph" data-paragraph="${paragraphIndex}">${items.map(({ sentence, sentenceIndex }) => {
    const english = tokenizeSentence(sentence.en).map(token => {
      if (!token.isWord) return escapeHtml(token.text);
      const key = normalizeWord(token.text);
      const classes = ['word-token'];
      if (cueSet.has(key) || cueSet.has(token.text.toLowerCase())) classes.push('grammar-cue');
      if (marked[key]) classes.push('marked');
      if (savedKeys.has(key)) classes.push('saved');
      return `<span class="${classes.join(' ')}" role="button" tabindex="0" data-article-word="${escapeHtml(token.text)}" data-sentence-index="${sentenceIndex}">${escapeHtml(token.text)}</span>`;
    }).join('');
    const translationVisible = view.allTranslations || view.sentenceTranslations[sentenceIndex];
    const grammarVisible = view.allGrammar || view.sentenceGrammar[sentenceIndex];
    const selected = state.selectedSentenceIndex === sentenceIndex;
    return `<span class="article-sentence ${selected ? 'selected' : ''}" data-article-sentence="${sentenceIndex}">${english}<span class="sentence-translation ${translationVisible ? '' : 'hidden'}">${escapeHtml(sentence.zh)}</span>${sentence.grammarNote ? `<span class="sentence-grammar ${grammarVisible ? '' : 'hidden'}">${escapeHtml(sentence.grammarNote)}</span>` : ''}</span>`;
  }).join(' ')}</p>`).join('');
  const totalWords = article.sentences.reduce((sum, sentence) => sum + (sentence.en.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []).length, 0);
  $('#articleWordCount').textContent = `${totalWords} 个词`;
  $('#articlePaper').innerHTML = `<header class="article-header"><span class="eyebrow">${escapeHtml(article.level)} · ${sourceLabel}</span><h2>${escapeHtml(article.title)}</h2><div class="article-zh-title ${view.allTranslations ? '' : 'hidden'}">${escapeHtml(article.titleZh || '')}</div><div class="article-meta"><span>目标语法：${escapeHtml(article.grammarFocus || course.title)}</span><span>${article.sentences.length} 句 · ${paragraphs.length} 段</span>${typeLabel ? `<span>${typeLabel}</span>` : ''}${coverageLabel ? `<span>${coverageLabel}</span>` : ''}<span>点击单词查词典，点击句子单独切换</span></div></header><div class="article-body">${body}</div><div class="article-toolbar"><button class="secondary-button" type="button" data-action="toggle-all-translations">${view.allTranslations ? '隐藏全文中文' : '显示全文中文'}</button><button class="secondary-button" type="button" data-action="toggle-all-grammar">${view.allGrammar ? '隐藏全部语法' : '显示全部语法'}</button><button class="secondary-button" type="button" data-action="refresh-article-metadata">强制重新获取中文和语法</button>${metadataStatus}<button class="primary-button" type="button" data-action="regenerate-article">换一篇</button><button class="text-button" type="button" data-action="open-reading-settings">调整生成条件</button></div>`;
  renderSentenceTools();
}
function renderSentenceTools() {
  const box = $('#sentenceTools');
  if (!box) return;
  const article = state.currentArticle;
  if (!article || state.selectedSentenceIndex == null || !article.sentences[state.selectedSentenceIndex]) { box.classList.add('hidden'); return; }
  const view = articleViewState(article);
  const index = state.selectedSentenceIndex;
  const sentence = article.sentences[index];
  box.classList.remove('hidden');
  box.innerHTML = `<div class="sentence-tools-head"><span class="eyebrow">已选句子</span><button class="sentence-tools-close" type="button" data-action="close-sentence-tools" aria-label="关闭句子工具">×</button></div><p class="selected-sentence">${escapeHtml(sentence.en)}</p><div class="drawer-actions sentence-tools-actions"><button class="secondary-button" type="button" data-action="toggle-sentence-translation">${view.allTranslations || view.sentenceTranslations[index] ? '隐藏本句中文' : '显示本句中文'}</button><button class="secondary-button" type="button" data-action="toggle-sentence-grammar">${view.allGrammar || view.sentenceGrammar[index] ? '隐藏本句语法' : '显示本句语法'}</button></div>`;
}
function sentenceElementFromNode(node) {
  const element = node && node.nodeType === 1 ? node : node && node.parentElement;
  return element ? element.closest('[data-article-sentence]') : null;
}
function selectSentence(index) {
  state.selectedSentenceIndex = index;
  if (!state.currentArticle) return;
  $$('.article-sentence').forEach(element => element.classList.toggle('selected', Number(element.dataset.articleSentence) === index));
  renderSentenceTools();
}
function clearSelectedSentence() {
  state.selectedSentenceIndex = null;
  const selection = window.getSelection();
  if (selection) selection.removeAllRanges();
  $$('.article-sentence').forEach(element => element.classList.remove('selected'));
  renderSentenceTools();
}
let sentenceSelectionTimer = null;
let sentencePressTimer = null;
let sentencePressStart = null;
function cancelSentenceLongPress() {
  clearTimeout(sentencePressTimer);
  sentencePressTimer = null;
  sentencePressStart = null;
}
function beginSentenceLongPress(event) {
  if (event.pointerType === 'mouse' || event.button !== 0) return;
  const sentence = sentenceElementFromNode(event.target);
  if (!sentence) return;
  sentencePressStart = { x: event.clientX, y: event.clientY };
  clearTimeout(sentencePressTimer);
  sentencePressTimer = setTimeout(() => {
    sentencePressTimer = null;
    sentencePressStart = null;
    state.justSelectedText = true;
    clearTimeout(state.justSelectedTextTimer);
    state.justSelectedTextTimer = setTimeout(() => { state.justSelectedText = false; }, 800);
    selectSentence(Number(sentence.dataset.articleSentence));
  }, 550);
}
function moveSentenceLongPress(event) {
  if (!sentencePressStart) return;
  const distance = Math.hypot(event.clientX - sentencePressStart.x, event.clientY - sentencePressStart.y);
  if (distance > 10) cancelSentenceLongPress();
}
function selectSentenceFromSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const start = sentenceElementFromNode(range.startContainer);
  const end = sentenceElementFromNode(range.endContainer);
  if (!start || (end && end !== start)) return;
  const index = Number(start.dataset.articleSentence);
  if (!Number.isInteger(index)) return;
  state.justSelectedText = true;
  clearTimeout(state.justSelectedTextTimer);
  state.justSelectedTextTimer = setTimeout(() => { state.justSelectedText = false; }, 350);
  selectSentence(index);
}
function scheduleSentenceSelection() {
  if (state.currentView !== 'reading') return;
  clearTimeout(sentenceSelectionTimer);
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  sentenceSelectionTimer = setTimeout(selectSentenceFromSelection, coarsePointer ? 180 : 40);
}
function selectSentenceFromMouse() {
  selectSentenceFromSelection();
  state.justSelectedText = false;
}

function toggleAllTranslations() {
  const view = articleViewState(state.currentArticle);
  view.allTranslations = !view.allTranslations;
  persistCurrentArticle();
  renderArticle(state.currentArticle);
}
function toggleAllGrammar() {
  const view = articleViewState(state.currentArticle);
  view.allGrammar = !view.allGrammar;
  persistCurrentArticle();
  renderArticle(state.currentArticle);
}
function toggleSentenceTranslation() {
  if (!state.currentArticle || state.selectedSentenceIndex == null) return;
  const view = articleViewState(state.currentArticle);
  const index = state.selectedSentenceIndex;
  view.sentenceTranslations[index] = !view.sentenceTranslations[index];
  persistCurrentArticle();
  renderArticle(state.currentArticle);
}
function toggleSentenceGrammar() {
  if (!state.currentArticle || state.selectedSentenceIndex == null) return;
  const view = articleViewState(state.currentArticle);
  const index = state.selectedSentenceIndex;
  view.sentenceGrammar[index] = !view.sentenceGrammar[index];
  persistCurrentArticle();
  renderArticle(state.currentArticle);
}function setGenerationStatus(message, options = {}) {
  const box = $('#generationStatus');
  if (!box) return;
  box.classList.toggle('hidden', !message);
  if (!message) return;
  $('#generationStatusText').textContent = message;
  $('#stopGenerationButton').classList.toggle('hidden', !options.stop);
  $('#retryGenerationButton').classList.toggle('hidden', !options.retry);
}
function stopArticleGeneration() {
  const generation = state.articleGeneration;
  if (!generation) return;
  generation.stopped = true;
  generation.controller.abort();
  setLoading(false);
  if (generation.partial) {
    generation.partial.partial = true;
    saveArticle(generation.partial);
    renderArticle(generation.partial);
    setGenerationStatus('已停止生成，已保留当前内容', { retry: true });
  } else {
    setGenerationStatus('已停止生成', { retry: true });
  }
}
async function refreshArticleMetadata() {
  const article = state.currentArticle;
  const course = article && findCourse(article.grammarId);
  if (!article || !course) return;
  if (!isAIConfigured()) { showToast('请先在“AI 与数据”中配置接口、模型和 API Key'); return; }
  if (state.metadataEnrichment) { showToast('当前正在补充，请稍候'); return; }
  if (!confirm('将重新获取本篇所有句子的中文和语法，并覆盖当前内容。是否继续？')) return;
  try {
    await enrichArticleWithRetry(article, course, null);
    saveArticle(article);
    renderArticle(article);
    setGenerationStatus('');
    showToast('已重新获取中文和语法');
  } catch (error) {
    state.metadataEnrichment = null;
    saveArticle(article);
    renderArticle(article);
    setGenerationStatus('重新获取失败，旧内容已保留', {});
    showToast('重新获取失败：' + error.message);
  }
}
async function enrichCurrentArticle() {
  const article = state.currentArticle;
  if (!article || !article.metadataPending || state.metadataEnrichment) return;
  const course = findCourse(article.grammarId);
  if (!course) return;
  try {
    await enrichArticleWithRetry(article, course, null);
    saveArticle(article);
    renderArticle(article);
    setGenerationStatus('');
    showToast('中文翻译和语法说明已补齐');
  } catch (error) {
    article.metadataPending = true;
    state.metadataEnrichment = null;
    saveArticle(article);
    renderArticle(article);
    setGenerationStatus('自动补充失败，可点击“重试补充翻译和语法”', {});
    showToast('补充失败：' + error.message);
  }
}
async function generateArticle() {
  const courseId = $('#articleGrammar').value;
  const level = $('#articleLevel').value;
  const topicId = $('#articleTopic').value;
  const selectedArticleType = $('#articleType') ? $('#articleType').value : 'careful';
  const articleType = level === 'CET4' ? selectedArticleType : 'levelDefault';
  const course = findCourse(courseId);
  if (!course) return;
  if (state.articleGeneration) state.articleGeneration.controller.abort();
  const generation = { id: uid(), controller: new AbortController(), partial: null, stopped: false };
  state.articleGeneration = generation;
  const button = $('#articleControls .primary-button');
  button.disabled = true;
  $('#generateButtonLabel').textContent = '生成中…';
  let article = null;
  let complete = false;
  let firstProgress = false;
  const bufferTimer = setTimeout(() => {
    if (state.articleGeneration !== generation || firstProgress) return;
    setLoading(true, '服务商暂未返回流式内容，可能正在缓冲…');
    setGenerationStatus('等待首个流式增量，服务商可能在缓冲响应…', { stop: true });
  }, 3500);
  try {
    if (isAIConfigured()) {
      setLoading(true, '正在连接 AI…');
      setGenerationStatus('等待 AI 响应…', { stop: true });
      const result = await generateAIArticleTextStream(course, level, topicId, articleType, partial => {
        if (state.articleGeneration !== generation) return;
        generation.partial = partial;
        firstProgress = true;
        clearTimeout(bufferTimer);
        setLoading(false);
        setGenerationStatus(`流式生成中 · 已生成 ${partial.sentences.length} 句`, { stop: true });
        renderArticle(partial);
      }, progress => {
        if (state.articleGeneration !== generation) return;
        firstProgress = true;
        clearTimeout(bufferTimer);
        if (progress.mode === 'fallback') {
          setLoading(true, '服务商未返回流式内容，已自动回退普通请求…');
          setGenerationStatus('服务商不支持流式，已回退普通请求', {});
        } else {
          setGenerationStatus(progress.refiningVocabulary ? '四级词汇覆盖率不足，正在自动简化…' : `流式接收中${progress.chunk ? ` · 第 ${progress.chunk}/${progress.chunks} 段` : ''} · 首字 ${progress.firstDeltaMs}ms · ${progress.chars} 字符`, { stop: true });
        }
      }, generation.controller.signal);
      if (state.articleGeneration !== generation) return;
      article = result.article;
      article.metadataPending = true;
      state.metadataEnrichment = { articleId: article.id, attempt: 1, retrying: false };
      saveArticle(article);
      renderArticle(article);
      setLoading(false);
      if (result.partial || generation.stopped) {
        article.partial = true;
        state.metadataEnrichment = null;
        setGenerationStatus('已保留已生成的英文文章', { retry: true });
      } else {
        setGenerationStatus('英文正文已生成，正在自动补充中文和语法…', {});
        try {
          await enrichArticleWithRetry(article, course, generation.controller.signal);
          complete = true;
          setGenerationStatus('');
          saveArticle(article);
          renderArticle(article);
        } catch (enrichError) {
          if (generation.stopped) {
            article.partial = true;
            state.metadataEnrichment = null;
            setGenerationStatus('已停止生成，英文文章已保留', { retry: true });
          } else {
            article.metadataPending = true;
            state.metadataEnrichment = null;
            setGenerationStatus('自动补充失败，可点击“重试补充翻译和语法”', {});
            showToast('英文文章已保存，自动补充失败：' + enrichError.message);
          }
          saveArticle(article);
          renderArticle(article);
        }
      }
    } else {
      article = createLocalArticle(course, level, topicId);
      article.articleType = articleType;
      complete = true;
      setGenerationStatus('');
      showToast('当前为本地模式，已生成模板文章');
    }
  } catch (error) {
    if (state.articleGeneration !== generation) return;
    setLoading(false);
    if (generation.stopped) {
      if (generation.partial) { article = generation.partial; article.partial = true; setGenerationStatus('已停止生成，已保留当前内容', { retry: true }); }
      else { article = null; setGenerationStatus('已停止生成', { retry: true }); }
    } else if (generation.partial) {
      article = generation.partial; article.partial = true;
      setGenerationStatus('流式连接中断，已保留当前内容', { retry: true });
      showToast('生成中断，已保留已收到的内容');
    } else {
      article = createLocalArticle(course, level, topicId); complete = true; setGenerationStatus('');
      showToast('AI 生成失败，已回退到本地文章：' + error.message); console.warn('AI 文章生成失败', error);
    }
  } finally {
    clearTimeout(bufferTimer);
    if (state.articleGeneration === generation) { button.disabled = false; $('#generateButtonLabel').textContent = '生成文章'; }
  }
  if (state.articleGeneration !== generation) return;
  state.articleGeneration = null;
  if (!article) { state.metadataEnrichment = null; return; }
  saveArticle(article); state.selectedSentenceIndex = null; renderArticle(article); touchStudy(); updateStats(); if (complete) setGenerationStatus('');
}

const mnemonicSeeds = {
  student: 'student 来自 study（学习），学生就是把学习当成日常的人。',
  teacher: 'teacher 与 teach（教）同源，负责教的人就是老师。',
  beautiful: 'beauty 是“美”，beautiful 是“充满美的”，可联想 beauty + ful。',
  important: 'import 有“带入”的意思，能带入重要结果的事情就是 important。',
  together: 'to + get + her 可联想“去把她叫来，大家就在一起了”。',
  family: 'family 可联想“father and mother, I love you”的首字母。',
  friend: 'friend 结尾是 end，真正的朋友会陪你到最后。',
  remember: 're- 表示“再次”，member 表示“成员/记住的一部分”，再次记起就是 remember。',
  forget: 'for + get 可联想“为了得到新东西，旧知识反而忘了”。',
  believe: 'be + lieve 可联想“在 lie（谎言）中仍然选择相信”。',
  receive: 'receive 可以记作 receive = re + ceive，重点记忆“接到、收到”。',
  practice: 'practice 和“反复做”绑定：看一遍不够，practice 要练出来。'
};
function mnemonicFor(word, meaning) {
  return mnemonicSeeds[word] || `把 ${word} 放回文章原句记忆：先读整句，再遮住 ${word}，根据“${meaning || '中文释义'}”回忆英文，最后跟读三次。`;
}
function wordDataCache() { return readJSON(STORAGE.wordData, {}); }
function saveWordDataCache(cache) { writeJSON(STORAGE.wordData, cache); }
async function ensureWordData(raw, meaning) {
  const word = normalizeWord(raw);
  if (!word) return null;
  const cache = wordDataCache();
  const current = cache[word] || {};
  if (!current.mnemonic) current.mnemonic = mnemonicFor(word, meaning || current.meaningZh);
  if (!current.meaningZh && meaning) current.meaningZh = meaning;
  if (!current.phonetic) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { signal: controller.signal });
      clearTimeout(timer);
      if (response.ok) {
        const data = await response.json();
        const entry = Array.isArray(data) ? data[0] : null;
        const phonetic = entry && (entry.phonetic || (entry.phonetics || []).map(item => item.text).find(Boolean));
        if (phonetic) current.phonetic = phonetic;
      }
    } catch (error) { console.warn('音标查询失败', word, error); }
  }
  cache[word] = current;
  saveWordDataCache(cache);
  if (state.vocabulary[word]) {
    state.vocabulary[word].phonetic = state.vocabulary[word].phonetic || current.phonetic || '';
    state.vocabulary[word].mnemonic = state.vocabulary[word].mnemonic || current.mnemonic;
    writeJSON(STORAGE.vocabulary, state.vocabulary);
  }
  return current;
}
function studyOptions(correctWord, type) {
  const all = Object.keys(dictionary).filter(word => word.length > 1 && word !== correctWord);
  const pool = shuffle(all).slice(0, 3);
  if (type === 'meaning') return shuffle([{ key: correctWord, label: dictionary[correctWord] || '结合文章理解' }].concat(pool.map(key => ({ key, label: dictionary[key] }))));
  return shuffle([correctWord].concat(pool));
}
function startWordStudy() {
  const words = Object.values(state.vocabulary);
  if (!words.length) { showToast('单词本还是空的，先去文章里加入生词'); return; }
  const due = words.filter(word => (word.nextReview || 0) <= Date.now());
  const queue = (due.length ? due : words).sort((a, b) => (a.level || 0) - (b.level || 0)).slice(0, state.settings.dailyGoal || 20);
  state.study = { queue: queue.map(word => word.word), wordIndex: 0, stageIndex: 0, stageResults: [], feedback: null, completed: 0 };
  showView('vocabulary'); renderStudy();
}
function studyStageName(index) { return ['看词选义', '看义选词', '听音拼写'][index]; }
function renderStudy() {
  const panel = $('#studyPanel'); const study = state.study;
  if (!study) { panel.classList.add('hidden'); return; }
  if (study.wordIndex >= study.queue.length) {
    panel.classList.remove('hidden');
    panel.innerHTML = `<div class="review-top"><span>今日背词完成</span><button class="text-button" type="button" data-action="close-study">收起</button></div><h2 class="review-word">完成 ${study.completed} 个词</h2><p>系统已根据三阶段表现更新复习时间。</p><div class="review-actions"><button class="review-known" type="button" data-action="close-study">返回单词本</button></div>`;
    return;
  }
  const key = study.queue[study.wordIndex]; const word = state.vocabulary[key]; const data = wordDataCache()[key] || {};
  const meaning = word.meaningZh || data.meaningZh || dictionary[key] || '结合文章理解';
  const phonetic = word.phonetic || data.phonetic || '';
  const mnemonic = word.mnemonic || data.mnemonic || mnemonicFor(key, meaning);
  panel.classList.remove('hidden'); let question = '';
  if (study.stageIndex === 0) {
    question = `<h2 class="review-word">${escapeHtml(word.displayWord || key)}</h2><div class="review-phonetic">${escapeHtml(phonetic)}</div><p>选择正确释义</p><div class="study-options">${studyOptions(key, 'meaning').map(item => `<button class="study-option" type="button" data-action="study-option" data-study-value="${escapeHtml(item.key)}">${escapeHtml(item.label)}</button>`).join('')}</div>`;
  } else if (study.stageIndex === 1) {
    question = `<h2 class="review-word">${escapeHtml(meaning)}</h2><div class="review-phonetic">${escapeHtml(phonetic)}</div><p>选择对应英文单词</p><div class="study-options">${studyOptions(key, 'word').map(item => `<button class="study-option" type="button" data-action="study-option" data-study-value="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div>`;
  } else {
    question = `<h2 class="review-word">${escapeHtml(meaning)}</h2><div class="review-phonetic">${escapeHtml(phonetic)}</div><p>根据释义和音标拼写英文</p><div class="study-input-row"><input id="studySpelling" autocomplete="off" placeholder="输入英文单词"><button class="primary-button" type="button" data-action="study-submit">提交</button></div>`;
  }
  panel.innerHTML = `<div class="review-top"><span>背单词 ${study.wordIndex + 1} / ${study.queue.length} · ${studyStageName(study.stageIndex)}</span><button class="text-button" type="button" data-action="close-study">退出</button></div>${question}${study.feedback ? `<div class="review-answer"><strong>${study.feedback.correct ? '回答正确' : '正确答案：' + escapeHtml(study.feedback.answer)}</strong><p>${escapeHtml(mnemonic)}</p></div><div class="review-actions"><button class="review-known" type="button" data-action="study-next">${study.stageIndex === 2 ? '完成这个单词' : '继续下一阶段'}</button></div>` : ''}`;
}
function answerStudy(value) {
  const study = state.study; if (!study || study.feedback) return;
  const key = study.queue[study.wordIndex]; const correct = normalizeAnswer(value) === normalizeAnswer(key);
  study.stageResults.push(correct); study.feedback = { correct, answer: key }; renderStudy();
}
function finishStudyWord() {
  const study = state.study; const key = study.queue[study.wordIndex]; const word = state.vocabulary[key]; const correctCount = study.stageResults.filter(Boolean).length;
  if (correctCount === 3) { word.level = Math.min(5, (word.level || 0) + 1); word.correct += 1; word.nextReview = Date.now() + REVIEW_INTERVALS[word.level] * DAY; }
  else if (correctCount === 2) { word.nextReview = Date.now() + DAY; word.level = Math.max(1, word.level || 0); }
  else { word.level = 0; word.wrong += 1; word.nextReview = Date.now() + 10 * 60 * 1000; }
  word.lastStudiedAt = Date.now(); writeJSON(STORAGE.vocabulary, state.vocabulary);
  study.completed += 1; study.wordIndex += 1; study.stageIndex = 0; study.stageResults = []; study.feedback = null;
}
function nextStudyStage() {
  const study = state.study; if (!study) return;
  if (study.stageIndex < 2) { study.stageIndex += 1; study.feedback = null; renderStudy(); }
  else { finishStudyWord(); renderStudy(); renderVocabulary(); updateStats(); }
}
function wordInfoFor(raw, sentence) {
  const key = normalizeWord(raw);
  const articleItem = state.currentArticle && state.currentArticle.vocabulary ? state.currentArticle.vocabulary.find(item => normalizeWord(item.word) === key) : null;
  const local = lookupDictionary(key);
  const saved = state.vocabulary[key];
  const cached = wordDataCache()[key] || {};
  return { word: key, phonetic: (articleItem && articleItem.phonetic) || (saved && saved.phonetic) || cached.phonetic || local.phonetic || '', meaningZh: (articleItem && articleItem.meaningZh) || (saved && saved.meaningZh) || cached.meaningZh || local.meaningZh || '', mnemonic: (saved && saved.mnemonic) || cached.mnemonic || mnemonicFor(key, (saved && saved.meaningZh) || local.meaningZh || ''), contextZh: sentence.zh || (articleItem && articleItem.contextZh) || '', example: (articleItem && articleItem.example) || sentence.en || '' };
}
function openWordDrawer(raw, sentenceIndex, contextOverride = null) {
  const sentence = contextOverride || (state.currentArticle && state.currentArticle.sentences[sentenceIndex]) || { en: raw, zh: '' };
  const info = wordInfoFor(raw, sentence);
  state.selectedWord = Object.assign(info, { sentenceIndex, raw, contextOverride });
  $('#drawerGrammar').textContent = state.currentArticle ? (state.currentArticle.grammarFocus || '生词卡') : '生词卡';
  $('#drawerWord').textContent = raw;
  $('#drawerPhonetic').textContent = info.phonetic || '';
  $('#drawerMeaning').textContent = info.meaningZh || '尚未加载释义，可使用 AI 查询';
  $('#drawerContext').textContent = sentence.en;
  $('#drawerContextZh').textContent = info.contextZh;
  $('#drawerExample').textContent = info.example && info.example !== sentence.en ? `例句：${info.example}` : '';
  $('#drawerExample').classList.toggle('hidden', !$('#drawerExample').textContent);
  $('#drawerMnemonic').textContent = info.mnemonic;
  ensureWordData(raw, info.meaningZh).then(data => {
    if (!data || !state.selectedWord || state.selectedWord.word !== info.word) return;
    state.selectedWord.phonetic = data.phonetic || state.selectedWord.phonetic;
    state.selectedWord.meaningZh = data.meaningZh || state.selectedWord.meaningZh;
    state.selectedWord.mnemonic = data.mnemonic || state.selectedWord.mnemonic;
    $('#drawerPhonetic').textContent = state.selectedWord.phonetic || '';
    $('#drawerMeaning').textContent = state.selectedWord.meaningZh || '尚未加载释义，可使用 AI 查询';
    $('#drawerMnemonic').textContent = state.selectedWord.mnemonic || '';
    renderVocabulary();
  });
  const isMarked = Boolean(state.currentArticle && state.currentArticle.markedWords && state.currentArticle.markedWords[info.word]);
  const isSaved = Boolean(state.vocabulary[info.word]);
  $('#drawerMarkButton').textContent = isMarked ? '取消标注' : '标注生词';
  $('#drawerMarkButton').classList.toggle('hidden', !state.currentArticle);
  $('#drawerSaveButton').textContent = isSaved ? '移出单词本' : '加入单词本';
  $('#drawerLookupButton').classList.toggle('hidden', Boolean(info.meaningZh));
  $('#wordDrawer').classList.remove('hidden');
  $('#wordDrawer').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeWordDrawer() {
  $('#wordDrawer').classList.add('hidden');
  $('#wordDrawer').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function persistCurrentArticle() {
  if (!state.currentArticle) return;
  const index = state.articles.findIndex(item => item.id === state.currentArticle.id);
  if (index >= 0) state.articles[index] = state.currentArticle;
  else state.articles.unshift(state.currentArticle);
  state.articles = state.articles;
  writeJSON(STORAGE.articles, state.articles);
  renderArticleHistory();
}
function toggleSelectedMark() {
  if (!state.selectedWord || !state.currentArticle) { showToast('只有文章内的单词支持标注'); return; }
  const key = state.selectedWord.word;
  state.currentArticle.markedWords[key] = !state.currentArticle.markedWords[key];
  persistCurrentArticle();
  renderArticle(state.currentArticle);
  openWordDrawer(state.selectedWord.raw, state.selectedWord.sentenceIndex);
}
function toggleSelectedSave() {
  if (!state.selectedWord) return;
  const key = state.selectedWord.word;
  if (state.vocabulary[key]) { delete state.vocabulary[key]; showToast('已从单词本移出'); }
  else {
    const sentence = state.selectedWord.contextOverride || (state.currentArticle && state.currentArticle.sentences[state.selectedWord.sentenceIndex]) || { en: state.selectedWord.raw, zh: '' };
    state.vocabulary[key] = { word: key, displayWord: state.selectedWord.raw, phonetic: state.selectedWord.phonetic || '', meaningZh: state.selectedWord.meaningZh || '', mnemonic: state.selectedWord.mnemonic || mnemonicFor(key, state.selectedWord.meaningZh || ''), contextZh: state.selectedWord.contextZh || '', example: state.selectedWord.example || sentence.en || '', context: sentence.en || '', addedAt: Date.now(), level: 0, correct: 0, wrong: 0, nextReview: Date.now() };
    if (state.currentArticle) state.currentArticle.markedWords[key] = true;
    showToast('已加入单词本，将进入间隔复习');
  }
  writeJSON(STORAGE.vocabulary, state.vocabulary);
  if (state.currentArticle) { persistCurrentArticle(); renderArticle(state.currentArticle); }
  openWordDrawer(state.selectedWord.raw, state.selectedWord.sentenceIndex, state.selectedWord.contextOverride);
  renderVocabulary();
  updateStats();
  renderHome();
}

async function lookupWordWithAI() {
  if (!state.selectedWord) return;
  if (!isAIConfigured()) { showToast('请先在“AI 与数据”中配置接口'); showView('settings'); return; }
  const selected = state.selectedWord;
  setLoading(true, 'AI 正在查询上下文释义…');
  try {
    const prompt = `请为英语学习者解释下面单词在句子中的含义。只返回 JSON：{"meaningZh":"中文释义","phonetic":"音标可留空","example":"一个简单英文例句"}。\n单词：${selected.raw}\n句子：${selected.contextOverride ? selected.contextOverride.en : state.currentArticle.sentences[selected.sentenceIndex].en}`;
    const parsed = extractJSON(await callAI([{ role: 'user', content: prompt }], 0.2));
    if (state.currentArticle) {
      const itemIndex = state.currentArticle.vocabulary.findIndex(item => normalizeWord(item.word) === selected.word);
      const item = { word: selected.word, phonetic: parsed.phonetic || '', meaningZh: parsed.meaningZh || '', contextZh: selected.contextZh, example: parsed.example || selected.example };
      if (itemIndex >= 0) state.currentArticle.vocabulary[itemIndex] = item;
      else state.currentArticle.vocabulary.push(item);
      persistCurrentArticle();
    }
    renderArticle(state.currentArticle);
    openWordDrawer(selected.raw, selected.sentenceIndex);
  } catch (error) { showToast('AI 查询失败：' + error.message); }
  finally { setLoading(false); }
}
function normalizedSpeechText(text) {
  return String(text || '').replace(/[^A-Za-z0-9'\- ]+/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}
function speakText(text) {
  const clean = normalizedSpeechText(text);
  if (!clean) { showToast('这个单词没有可朗读的英文内容'); return; }
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { showToast('当前浏览器不支持语音朗读，请使用 Edge 或 Chrome'); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  const preferred = state.settings.voice || 'en-US';
  utterance.lang = preferred;
  utterance.rate = Math.max(0.5, Math.min(1.5, Number(state.settings.speechRate) || 0.9));
  const voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  const voice = voices.find(item => item.lang === preferred) || voices.find(item => /^en-(US|GB)/i.test(item.lang)) || voices.find(item => /^en/i.test(item.lang));
  if (voice) utterance.voice = voice;
  let started = false;
  utterance.onstart = () => { started = true; };
  utterance.onerror = event => { showToast('语音播放失败：' + (event.error || '浏览器语音服务不可用')); };
  const timer = setTimeout(() => { if (!started) showToast('语音没有启动，请确认系统允许浏览器播放声音'); }, 1600);
  utterance.onend = () => clearTimeout(timer);
  try { speechSynthesis.speak(utterance); } catch (error) { clearTimeout(timer); showToast('语音播放失败：' + error.message); }
}

function masteryDots(level) {
  return `<span class="mastery-dots">${Array.from({ length: 6 }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('')}</span>`;
}
function renderVocabulary() {
  const query = ($('#vocabSearch') && $('#vocabSearch').value || '').trim().toLowerCase();
  const words = Object.values(state.vocabulary).filter(word => !query || word.word.includes(query) || String(word.meaningZh || '').toLowerCase().includes(query)).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));
  const allCount = Object.keys(state.vocabulary).length;
  const dueCount = dueWords().length;
  $('#vocabSummary').textContent = allCount ? `${allCount} 个生词 · ${dueCount} 个到期` : '暂无生词';
  if (!words.length) {
    $('#vocabularyList').innerHTML = `<div class="empty-state"><h2>${allCount ? '没有匹配的单词' : '单词本还是空的'}</h2><p>${allCount ? '换一个关键词试试。' : '去阅读实验室点击不认识的单词，加入后会在这里安排复习。'}</p><button class="primary-button" type="button" data-view="reading">去阅读</button></div>`;
    return;
  }
  $('#vocabularyList').innerHTML = words.map(word => {
    const due = (word.nextReview || 0) <= Date.now();
    const nextText = due ? '现在需要复习' : `下次复习：${new Date(word.nextReview).toLocaleDateString('zh-CN')}`;
    return `<article class="vocab-card"><div class="vocab-card-top"><div><h3>${escapeHtml(word.displayWord || word.word)}</h3><div class="meaning">${escapeHtml(word.meaningZh || '暂无释义')}</div><div class="word-phonetic">${escapeHtml(word.phonetic || wordDataCache()[word.word]?.phonetic || '')}</div><p class="word-mnemonic">${escapeHtml(word.mnemonic || wordDataCache()[word.word]?.mnemonic || mnemonicFor(word.word, word.meaningZh || ''))}</p></div><button class="card-menu-button" type="button" data-action="remove-word" data-word="${escapeHtml(word.word)}">移除</button></div><div class="mastery-row">${masteryDots(word.level || 0)}<span>熟练度 ${word.level || 0}/5 · ${nextText}</span></div>${word.context ? `<p class="context">“${escapeHtml(word.context)}”</p>` : ''}<div class="article-toolbar"><button class="text-button" type="button" data-action="speak-word" data-word="${escapeHtml(word.displayWord || word.word)}">🔊 发音</button></div></article>`;
  }).join('');
}

function startReview(dueOnly) {
  const now = Date.now();
  const source = Object.values(state.vocabulary).filter(word => !dueOnly || (word.nextReview || 0) <= now).sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));
  if (!source.length) { showToast(dueOnly ? '当前没有到期单词' : '单词本还是空的'); return; }
  state.review = { queue: source.map(word => word.word), index: 0, revealed: false, dueOnly };
  showView('vocabulary');
  renderReview();
}
function renderReview() {
  const panel = $('#reviewPanel');
  const review = state.review;
  if (!review.queue.length) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }
  if (review.index >= review.queue.length) {
    panel.classList.remove('hidden');
    panel.innerHTML = `<div class="review-top"><span>复习完成</span><button class="text-button" type="button" data-action="close-review">收起</button></div><div class="review-word">完成</div><p>本轮复习已结束。下次到期时间已经更新。</p><div class="review-actions"><button class="review-known" type="button" data-action="close-review">返回单词本</button></div>`;
    return;
  }
  const word = state.vocabulary[review.queue[review.index]];
  panel.classList.remove('hidden');
  panel.innerHTML = `<div class="review-top"><span>复习 ${review.index + 1} / ${review.queue.length}</span><button class="text-button" type="button" data-action="close-review">收起</button></div><h2 class="review-word">${escapeHtml(word.displayWord || word.word)}</h2><div class="review-phonetic">${escapeHtml(word.phonetic || '')}</div><div class="review-answer ${review.revealed ? '' : 'hidden'}"><strong>${escapeHtml(word.meaningZh || '暂无释义')}</strong>${word.context ? `<p>${escapeHtml(word.context)}</p>` : ''}${word.contextZh ? `<p class="muted">${escapeHtml(word.contextZh)}</p>` : ''}</div><div class="review-actions">${review.revealed ? '<button class="review-forgot" type="button" data-review-rating="forgot">忘了</button><button class="review-fuzzy" type="button" data-review-rating="fuzzy">模糊</button><button class="review-known" type="button" data-review-rating="known">记住</button><button class="review-reveal" type="button" data-action="skip-review">稍后跳过</button>' : '<button class="review-reveal" type="button" data-action="reveal-review">显示答案</button><button class="review-reveal" type="button" data-action="speak-word" data-word="' + escapeHtml(word.displayWord || word.word) + '">🔊 听发音</button>'}</div>`;
}
function skipReview() {
  state.review.index += 1;
  state.review.revealed = false;
  renderReview();
  if (state.settings.autoSpeakReview && state.review.index < state.review.queue.length) {
    const next = state.vocabulary[state.review.queue[state.review.index]];
    if (next) speakText(next.displayWord || next.word);
  }
}
function rateReview(rating) {
  const key = state.review.queue[state.review.index];
  const word = state.vocabulary[key];
  if (!word) return;
  const now = Date.now();
  if (rating === 'forgot') { word.level = 0; word.wrong += 1; word.nextReview = now + 10 * 60 * 1000; }
  else if (rating === 'fuzzy') { word.nextReview = now + DAY; }
  else { word.level = Math.min(5, (word.level || 0) + 1); word.correct += 1; word.nextReview = now + REVIEW_INTERVALS[word.level] * DAY; }
  word.lastReviewedAt = now;
  writeJSON(STORAGE.vocabulary, state.vocabulary);
  state.review.index += 1;
  state.review.revealed = false;
  renderReview();
  if (state.settings.autoSpeakReview && state.review.index < state.review.queue.length) {
    const next = state.vocabulary[state.review.queue[state.review.index]];
    if (next) speakText(next.displayWord || next.word);
  }
  renderVocabulary();
  updateStats();
  renderHome();
}
function removeVocabularyWord(key) {
  delete state.vocabulary[key];
  writeJSON(STORAGE.vocabulary, state.vocabulary);
  renderVocabulary();
  updateStats();
  renderHome();
  showToast('已移出单词本');
}

function setApiKeyVisibility(visible) {
  const input = $('#settingApiKey');
  const button = $('#toggleApiKey');
  if (!input || !button) return;
  input.classList.toggle('secret-input-masked', !visible);
  button.textContent = visible ? '隐藏' : '显示';
  button.setAttribute('aria-pressed', String(visible));
  button.setAttribute('aria-label', visible ? '隐藏 API Key' : '显示 API Key');
}function setConnectionStatus(type, title, detail = '') {
  const box = $('#aiConnectionStatus');
  if (!box) return;
  box.className = `ai-connection-status ${type}`;
  box.innerHTML = `<strong>${escapeHtml(title)}</strong>${detail ? escapeHtml(detail) : ''}`;
}
function aiConnectionError(status, raw) {
  const body = String(raw || '').slice(0, 240);
  if (status === 401) return { title: 'API Key 无效', detail: `服务商返回 401。请检查 Key 是否完整、是否过期。\n${body}` };
  if (status === 403) return { title: '没有模型访问权限', detail: `服务商返回 403。请检查账号权限或模型权限。\n${body}` };
  if (status === 404) return { title: '接口地址或模型不存在', detail: `服务商返回 404。请检查 base URL，以及模型名是否支持 Chat Completions。\n${body}` };
  if (status === 429) return { title: '请求被限流', detail: `服务商返回 429。账号额度不足或请求过于频繁。\n${body}` };
  if (status) return { title: `连接失败（HTTP ${status}）`, detail: body || '请检查服务商配置。' };
  return { title: '无法连接服务商', detail: `可能是网络不可用、CORS 未开放或接口地址错误。\n${body}` };
}
async function testAIConnection() {
  const baseUrl = $('#settingBaseUrl').value.trim();
  const model = $('#settingModel').value.trim();
  const apiKey = $('#settingApiKey').value.trim();
  const button = $('#testAiConnectionButton');
  if (!baseUrl || !model || !apiKey) {
    setConnectionStatus('error', '配置不完整', '请填写接口地址、模型名称和 API Key 后再测试。');
    return false;
  }
  setConnectionStatus('testing', '正在测试连接…', `正在请求模型 ${model}`);
  if (button) button.disabled = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(apiChatUrl(baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature: 0, stream: false, messages: [{ role: 'user', content: 'Reply with OK only.' }] }),
      signal: controller.signal
    });
    const raw = await response.text();
    if (!response.ok) {
      const info = aiConnectionError(response.status, raw);
      state.settings.connection = { ok: false, model, testedAt: Date.now(), error: info.title, detail: info.detail };
      writeJSON(STORAGE.settings, state.settings);
      setConnectionStatus('error', info.title, info.detail);
      updateAIStatus();
      return false;
    }
    const data = JSON.parse(raw);
    const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('服务返回成功状态，但没有模型文本内容。');
    state.settings.connection = { ok: true, model, testedAt: Date.now(), detail: '连接测试通过' };
    writeJSON(STORAGE.settings, state.settings);
    setConnectionStatus('success', '连接成功', `模型：${model}\n测试时间：${new Date().toLocaleString('zh-CN')}`);
    updateAIStatus();
    return true;
  } catch (error) {
    const info = error.name === 'AbortError'
      ? { title: '连接超时', detail: '服务商在 20 秒内没有响应。' }
      : aiConnectionError(0, error.message);
    state.settings.connection = { ok: false, model, testedAt: Date.now(), error: info.title, detail: info.detail };
    writeJSON(STORAGE.settings, state.settings);
    setConnectionStatus('error', info.title, info.detail);
    updateAIStatus();
    return false;
  } finally {
    clearTimeout(timeout);
    if (button) button.disabled = false;
  }
}
function updateAIStatus() {
  const badge = $('#aiStatusBadge');
  const configured = isAIConfigured();
  const connection = state.settings.connection;
  if (configured && connection && connection.ok === true) {
    badge.textContent = `AI 已连接 · ${connection.model || state.settings.model}`;
    badge.className = 'status-badge ready';
  } else if (configured && connection && connection.ok === false) {
    badge.textContent = 'AI 连接失败 · 请检查设置';
    badge.className = 'status-badge error';
  } else {
    badge.textContent = configured ? 'AI 已配置 · 未测试' : 'AI 未配置 · 本地模式';
    badge.className = 'status-badge neutral';
  }
}
function loadSettingsForm() {
  $('#settingBaseUrl').value = state.settings.baseUrl || '';
  $('#settingModel').value = state.settings.model || '';
  $('#settingApiKey').value = state.settings.apiKey || '';
  setApiKeyVisibility(false);
  const connection = state.settings.connection;
  if (isAIConfigured() && connection) setConnectionStatus(connection.ok ? 'success' : 'error', connection.ok ? '连接成功' : (connection.error || '连接失败'), connection.detail || '');
  else $('#aiConnectionStatus').className = 'ai-connection-status hidden';
  updateAIStatus();
}
function saveSettingsForm() {
  state.settings = Object.assign({}, state.settings, { baseUrl: $('#settingBaseUrl').value.trim(), model: $('#settingModel').value.trim(), apiKey: $('#settingApiKey').value.trim() });
  writeJSON(STORAGE.settings, state.settings);
  updateAIStatus();
  showToast(isAIConfigured() ? 'AI 设置已保存，正在测试连接' : '设置已保存；填写完整后才会调用 AI');
  if (isAIConfigured()) testAIConnection();
}
function exportData() {
  const includeApiKey = Boolean($('#exportApiKey') && $('#exportApiKey').checked);
  if (includeApiKey && !confirm('备份将包含明文 API Key。不要把此文件分享给他人。是否继续导出？')) return;
  const settingsBackup = Object.assign({}, state.settings); delete settingsBackup.apiKey;
  if (includeApiKey) settingsBackup.apiKey = state.settings.apiKey;
  const payload = { version: 4, exportedAt: new Date().toISOString(), progress: state.progress, vocabulary: state.vocabulary, articles: state.articles, practice: state.practice || {}, wrongBook: state.wrongBook || [], writing: state.writing || { draft: null, history: [] }, memory: state.memory || { entries: [] }, settings: settingsBackup };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `english-learning-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast(includeApiKey ? '备份已导出，包含明文 API Key' : '备份已导出，未包含 API Key');
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (!payload || typeof payload !== 'object') throw new Error('文件内容无效');
      if (!payload.progress || !payload.vocabulary || !Array.isArray(payload.articles)) throw new Error('缺少学习数据字段');
      const includesKey = Boolean(payload.settings && payload.settings.apiKey);
      const message = includesKey ? '备份包含明文 API Key。导入会替换当前设置和学习数据，是否继续？' : '导入将替换当前课程进度、生词本和文章记录，是否继续？';
      if (!confirm(message)) return;
      state.progress = payload.progress;
      state.vocabulary = payload.vocabulary;
      state.articles = payload.articles;
      state.practice = Object.assign({ tab: 'grammar', cache: {}, active: null, filter: 'all' }, payload.practice || {});
      state.wrongBook = Array.isArray(payload.wrongBook) ? payload.wrongBook : [];
      state.writing = payload.writing || { draft: null, history: [] };
      state.memory = payload.memory || { entries: [] };
      if (payload.settings) state.settings = Object.assign({}, state.settings, payload.settings);
      writeJSON(STORAGE.progress, state.progress);
      writeJSON(STORAGE.vocabulary, state.vocabulary);
      writeJSON(STORAGE.articles, state.articles);
      writeJSON(STORAGE.practice, state.practice);
      writeJSON(STORAGE.wrongBook, state.wrongBook);
      writeJSON(STORAGE.writing, state.writing);
      writeJSON(STORAGE.memory, state.memory);
      writeJSON(STORAGE.settings, state.settings);
      renderAll();
  renderLevelSwitchers();
      showToast('学习数据导入成功');
    } catch (error) { showToast('导入失败：' + error.message); }
  };
  reader.onerror = () => showToast('文件读取失败');
  reader.readAsText(file);
}
function clearLearningData() {
  if (!confirm('确定重置全部学习数据吗？课程进度、生词、错题、练习记录和写作记录都会删除，AI 设置会保留。')) return;
  state.progress = { completed: {}, lastLessonId: '', studyDates: {} };
  state.vocabulary = {};
  state.articles = [];
  state.practice = { tab: 'grammar', cache: {}, active: null, filter: 'all' };
  state.wrongBook = [];
  state.writing = { draft: null, history: [] };
  state.memory = { entries: [] };
  state.review = { queue: [], index: 0, revealed: false, dueOnly: true };
  writeJSON(STORAGE.progress, state.progress);
  writeJSON(STORAGE.vocabulary, state.vocabulary);
  writeJSON(STORAGE.articles, state.articles);
  writeJSON(STORAGE.practice, state.practice);
  writeJSON(STORAGE.wrongBook, state.wrongBook);
  writeJSON(STORAGE.writing, state.writing);
  writeJSON(STORAGE.memory, state.memory);
  renderAll();
  showToast('学习数据已清空');
}

function populateArticleSelects() {
  const grammar = $('#articleGrammar');
  if (!grammar) return;
  const selected = grammar.value;
  const groups = [
    { label: 'A1 基础语法', items: lessonList.filter(item => item.num <= 10) },
    { label: 'A2 主线语法', items: lessonList.filter(item => item.num > 10) },
    { label: 'CET-4 四级进阶', items: advancedModules },
    { label: '语法微专题 101+', items: typeof grammarTopics !== 'undefined' ? grammarTopics : [] }
  ];
  const seen = new Set();
  grammar.innerHTML = groups.map(group => {
    const options = group.items.filter(item => {
      const key = String(item.id || item.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(item => `<option value="${item.id}">${item.microTopic ? '' : String(item.num).padStart(2, '0') + ' · '}${escapeHtml(item.title)}</option>`).join('');
    return options ? `<optgroup label="${group.label}">${options}</optgroup>` : '';
  }).join('');
  if (selected && findCourse(selected)) grammar.value = selected;
}
function selectAdvancedModule(id) {
  const module = advancedModules.find(item => item.id === id);
  if (!module) return;
  populateArticleSelects();
  $('#articleGrammar').value = id;
  setGlobalLevel('CET4');
  showView('reading');
  showToast(`已选择四级模块“${module.title}”，点击生成文章`);
}
function renderAll() {
  populateArticleSelects();
  renderHome();
  renderGrammar();
  renderVocabulary();
  renderArticleHistory();
  loadSettingsForm();
  updateStats();
  if (state.currentArticle) renderArticle(state.currentArticle);
}

async function handleClick(event) {
  const levelButton = event.target.closest('[data-level]');
  if (levelButton) { setGlobalLevel(levelButton.dataset.level); return; }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    const view = viewButton.dataset.view;
    if (view === 'reading') populateArticleSelects();
    showView(view);
    if (view === 'vocabulary') renderVocabulary();
    if (view === 'home') renderHome();
    return;
  }
  const wordButton = event.target.closest('[data-article-word]');
  if (wordButton) {
    if (state.justSelectedText) return;
    openWordDrawer(wordButton.dataset.articleWord, Number(wordButton.dataset.sentenceIndex));
    return;
  }
  const courseButton = event.target.closest('[data-course-id]');
  if (courseButton && courseButton.dataset.courseId) {
    const course = findCourse(courseButton.dataset.courseId);
    if (course && course.advanced) selectAdvancedModule(course.id);
    else openLesson(courseButton.dataset.courseId);
    return;
  }
  const lessonButton = event.target.closest('[data-lesson-id]');
  if (lessonButton && lessonButton.dataset.lessonId) { openLesson(lessonButton.dataset.lessonId); return; }
  const filterButton = event.target.closest('[data-lesson-filter]');
  if (filterButton) { state.lessonFilter = filterButton.dataset.lessonFilter; renderLessonFilters(); renderLessonGrid(); return; }
  const mcqButton = event.target.closest('[data-mcq-index]');
  if (mcqButton) {
    const index = Number(mcqButton.dataset.mcqIndex);
    const optionIndex = Number(mcqButton.dataset.optionIndex);
    state.lessonSession.answers.mcq[index] = optionIndex;
    $$(`[data-mcq-index="${index}"]`).forEach(button => button.classList.toggle('selected', Number(button.dataset.optionIndex) === optionIndex));
    return;
  }
  const selfGradeButton = event.target.closest('[data-self-grade]');
  if (selfGradeButton) {
    const currentLesson = lessonList.find(item => item.id === state.progress.lastLessonId) || lessonList[0];
    if (!currentLesson) return;
    const index = Number(selfGradeButton.dataset.translationIndex);
    state.lessonSession.results.translations[index] = selfGradeButton.dataset.selfGrade === 'true';
    updateLessonScore(currentLesson);
    renderLessonDetail(currentLesson);
    return;
  }
  const ratingButton = event.target.closest('[data-review-rating]');
  if (ratingButton) { rateReview(ratingButton.dataset.reviewRating); return; }
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === 'continue-learning') { const id = actionButton.dataset.lessonId || lessonList[0].id; const course = findCourse(id); if (course && course.advanced) selectAdvancedModule(id); else openLesson(id); }
  else if (action === 'open-mobile-nav') $('#mobileNav').classList.toggle('hidden');
  else if (action === 'start-due-review') startReview(true);
  else if (action === 'start-word-study') startWordStudy();
  else if (action === 'close-study') { state.study = null; renderStudy(); }
  else if (action === 'study-option') answerStudy(actionButton.dataset.studyValue);
  else if (action === 'study-submit') { const input = $('#studySpelling'); if (input) answerStudy(input.value); }
  else if (action === 'study-next') nextStudyStage();
  else if (action === 'start-all-review') startReview(false);
  else if (action === 'close-review') { state.review.queue = []; renderReview(); }
  else if (action === 'reveal-review') { state.review.revealed = true; renderReview(); }
  else if (action === 'close-word-drawer') closeWordDrawer();
  else if (action === 'speak-current') speakText(state.selectedWord ? state.selectedWord.raw : '');
  else if (action === 'toggle-word-mark') toggleSelectedMark();
  else if (action === 'toggle-word-save') toggleSelectedSave();
  else if (action === 'ai-lookup-word') lookupWordWithAI();
  else if (action === 'submit-practice') submitPractice(findCourse(state.progress.lastLessonId));
  else if (action === 'reset-practice') resetPractice(findCourse(state.progress.lastLessonId));
  else if (action === 'play-video') { const src = actionButton.dataset.videoSrc; actionButton.outerHTML = `<div class="video-frame"><iframe src="${src}" loading="lazy" allowfullscreen title="${escapeHtml(actionButton.dataset.videoTitle || '视频课程')}"></iframe></div>`; }
  else if (action === 'stop-generation') stopArticleGeneration();
  else if (action === 'enrich-article') enrichCurrentArticle();
  else if (action === 'refresh-article-metadata') refreshArticleMetadata();
  else if (action === 'regenerate-article') generateArticle();
  else if (action === 'open-reading-settings') { $('#articleControls').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#articleGrammar').focus(); }
  else if (action === 'toggle-all-translations') toggleAllTranslations();
  else if (action === 'toggle-all-grammar') toggleAllGrammar();
  else if (action === 'toggle-sentence-translation') toggleSentenceTranslation();
  else if (action === 'toggle-sentence-grammar') toggleSentenceGrammar();
  else if (action === 'close-sentence-tools') clearSelectedSentence();
  else if (action === 'remove-word') removeVocabularyWord(actionButton.dataset.word);
  else if (action === 'speak-word') speakText(actionButton.dataset.word);
  else if (action === 'export-data') exportData();
  else if (action === 'import-data') $('#importFile').click();
  else if (action === 'clear-data') clearLearningData();
  else if (action === 'skip-review') skipReview();
  else if (action === 'test-ai-connection') testAIConnection();
  else if (action === 'open-saved-article') openSavedArticle(actionButton.dataset.articleId);
  else if (action === 'delete-saved-article') deleteSavedArticle(actionButton.dataset.articleId);
  else if (action === 'clear-article-history') clearArticleHistory();
  else if (action === 'clear-ai-settings') { state.settings.apiKey = ''; state.settings.connection = null; $('#settingApiKey').value = ''; $('#aiConnectionStatus').className = 'ai-connection-status hidden'; writeJSON(STORAGE.settings, state.settings); updateAIStatus(); showToast('API Key 已清空'); }
}

function bindEvents() {
  document.addEventListener('click', handleClick);
  const apiKeyToggle = $('#toggleApiKey');
  if (apiKeyToggle) {
    apiKeyToggle.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      setApiKeyVisibility($('#settingApiKey').classList.contains('secret-input-masked'));
    });
  }
  const mobileMenuButton = document.querySelector('[data-action="open-mobile-nav"]');
  const mobileNav = $('#mobileNav');
  if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      mobileNav.classList.toggle('hidden');
    });
    mobileNav.addEventListener('click', event => {
      const item = event.target.closest('[data-view]');
      if (!item) return;
      event.preventDefault();
      event.stopPropagation();
      showView(item.dataset.view);
      mobileNav.classList.add('hidden');
    });
  }
  $('#articleControls').addEventListener('submit', event => { event.preventDefault(); generateArticle(); });
  $('#aiSettingsForm').addEventListener('submit', event => { event.preventDefault(); saveSettingsForm(); });
  $('#vocabSearch').addEventListener('input', renderVocabulary);
  $('#mobileLevelSelect').addEventListener('change', event => setGlobalLevel(event.target.value));
  $('#articleLevel').addEventListener('change', event => setGlobalLevel(event.target.value));
  $('#articleGrammar').addEventListener('change', updateReadingVideo);
  $('#importFile').addEventListener('change', event => { const file = event.target.files[0]; if (file) importData(file); event.target.value = ''; });
  $('#wordDrawer').addEventListener('click', event => { if (event.target === $('#wordDrawer')) closeWordDrawer(); });
  $('#articlePaper').addEventListener('keydown', event => {
    const wordButton = event.target.closest('[data-article-word]');
    if (!wordButton || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    openWordDrawer(wordButton.dataset.articleWord, Number(wordButton.dataset.sentenceIndex));
  });
  $('#articlePaper').addEventListener('pointerdown', beginSentenceLongPress);
  $('#articlePaper').addEventListener('pointermove', moveSentenceLongPress);
  $('#articlePaper').addEventListener('pointerup', cancelSentenceLongPress);
  $('#articlePaper').addEventListener('pointercancel', cancelSentenceLongPress);
  $('#articlePaper').addEventListener('contextmenu', event => {
    if (state.justSelectedText || sentencePressTimer) event.preventDefault();
  });
  $('#articlePaper').addEventListener('mouseup', scheduleSentenceSelection);
  $('#articlePaper').addEventListener('touchend', scheduleSentenceSelection);
  document.addEventListener('selectionchange', scheduleSentenceSelection);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeWordDrawer(); $('#mobileNav').classList.add('hidden'); } });
}
function init() {
  renderMobileNav();
  renderLevelSwitchers();
  populateArticleSelects();
  bindEvents();
  loadSettingsForm();
  renderAll();
  renderLevelSwitchers();
  updateReadingVideo();
  if (state.articles && state.articles[0]) {
    const latest = state.articles[0];
    state.currentArticle = latest;
    if (findCourse(latest.grammarId)) {
      $('#articleGrammar').value = latest.grammarId;
      $('#articleLevel').value = latest.level || 'A1';
      $('#articleTopic').value = latest.topicId || 'life';
    }
    renderArticle(latest);
  }
  showView('home');
}

init();
