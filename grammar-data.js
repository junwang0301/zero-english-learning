'use strict';
let grammarTopicRows = `
g-noun-count|词性基础|A1|名词：可数与不可数|数量与冠词|判断名词能否直接计数，决定冠词、复数和数量词。|I have two books.|I have two book.=>I have two books.=>可数名词复数加 s。|I need a water.=>I need some water.=>water 不可数，不用 a。|plural
g-noun-plural|词性基础|A1|名词复数规则变化|s / es / y 变 i|掌握名词复数的常见拼写规则。|There are two buses.|There are two boxs.=>There are two boxes.=>box 加 es。|I see three citys.=>I see three cities.=>辅音 y 变 i 加 es。|plural
g-noun-irregular|词性基础|A1|特殊复数与单复数同形|children / people / sheep|记住高频不规则名词复数，避免机械加 s。|There are two children here.|There are two childs.=>There are two children.=>child 复数是 children。|There are many peoples.=>There are many people.=>people 通常已是复数。|plural
g-noun-possessive|词性基础|A1|名词所有格|'s 与 of|表达所属关系时，根据人和物选择所有格形式。|This is Lily's bag.|This is Lily bag.=>This is Lily's bag.=>人名后加 's。|the wall color=>the color of the wall=>无生命名词常用 of。|plural
g-pronoun-personal|词性基础|A1|人称代词主格与宾格|I / me / he / him|根据代词在句中作主语还是宾语选择主格或宾格。|She helps me.|Me help she.=>She helps me.=>主格作主语，宾格作宾语。|I saw he.=>I saw him.=>动词后用宾格。|pronoun
g-pronoun-possessive|词性基础|A1|物主代词与物主形容词|my / mine|区分名词前的物主形容词和独立使用的物主代词。|This is my book.|This is I book.=>This is my book.=>名词前用物主形容词。|The book is my.=>The book is mine.=>独立使用物主代词。|pronoun
g-pronoun-reflexive|词性基础|A2|反身代词|myself / yourself|动作回到主语本身时使用反身代词。|She taught herself English.|She taught her English.=>She taught herself English.=>动作回到主语自身。|He did it by him.=>He did it by himself.=>by oneself 表示独自。|pronoun
g-pronoun-demonstrative|词性基础|A1|指示代词|this / that /这些 / those|根据距离和单复数选择指示代词。|These books are new.|This books are new.=>These books are new.=>this 不能修饰复数。|Those book is old.=>That book is old.=>单数用 that。|demonstrative
g-pronoun-indefinite|词性基础|A2|不定代词|someone / anyone / nothing|掌握不定代词的指人、指物和肯定否定语境。|Someone is at the door.|Someone are at the door.=>Someone is at the door.=>不定代词作单数。|I don't know nothing.=>I don't know anything.=>否定句用 anything。|pronoun
g-adj-use|词性基础|A1|形容词用法与位置|定语与表语|形容词可放在名词前作定语，也可放在 be 动词后作表语。|She is a happy girl.|She is happily.=>She is happy.=>be 动词后用形容词。|She sings beautiful.=>She sings beautifully.=>修饰动词用副词。|comparative
g-adj-comparison|词性基础|A2|比较级|than / more|比较两个人或事物时使用比较级。|This book is easier than that one.|This book is more easier.=>This book is easier.=>不能重复比较。|She is more tall than me.=>She is taller than me.=>短形容词用 er。|comparative
g-adj-superlative|词性基础|A2|最高级|the best / the most|三者或以上比较时使用最高级。|She is the tallest in her class.|She is tallest in her class.=>She is the tallest in her class.=>最高级前加 the。|This is the most cheapest.=>This is the cheapest.=>most 与 est 不叠加。|comparative
g-adverb-types|词性基础|A2|副词分类与作用|时间、地点、方式、程度|副词修饰动词、形容词、其他副词或整个句子。|She speaks English clearly.|She speaks English clear.=>She speaks English clearly.=>修饰动词用副词。|He is very carefully.=>He is very careful.=>be 后用形容词。|frequency
g-adverb-position|词性基础|B1|副词位置|频率与方式副词|副词位置会改变句子重心，要按类型放置。|I often read English in the morning.|I read often English.=>I often read English.=>频率副词位置错误。|She carefully drove the car.=>She drove the car carefully.=>方式副词常放句末。|frequency
g-adj-adverb|词性基础|A2|形容词与副词区别|careful / carefully|根据修饰对象判断用形容词还是副词。|The driver is careful.|The driver drives careful.=>The driver drives carefully.=>修饰动作用副词。|She looks happily.=>She looks happy.=>look 作系动词用形容词。|frequency
g-verb-types|词性基础|A2|动词分类|实义、系、助、情态|识别动词功能是分析句子和选词的基础。|She is a teacher.|She does a teacher.=>She is a teacher.=>系动词连接表语。|She can swims.=>She can swim.=>情态动词后用原形。|be
g-number-cardinal|词性基础|A1|基数词|one / two / twenty-one|基数词表示数量，常修饰可数名词复数。|There are twenty-one students.|There are twenty one students.=>There are twenty-one students.=>二十一加连字符。|I have two hundreds books.=>I have two hundred books.=>具体数字后 hundred 不加 s。|number
g-number-ordinal|词性基础|A2|序数词|first / second / twentieth|序数词表示顺序，通常前加 the。|She is the first winner.|She is first winner.=>She is the first winner.=>序数词前通常加 the。|It is my three time.=>It is my third time.=>第三次用序数词。|number
g-number-fraction-date|词性基础|B1|分数与日期表达|half / dates|掌握分数、年份和日期的常见读法。|Three quarters of the students agree.|Three quarter of the students agree.=>Three quarters of the students agree.=>分子大于一，分母用复数。|May one is my birthday.=>May 1st is my birthday.=>日期中用序数词。|number
g-prep-time|词性基础|A1|时间介词|in / on / at|根据时间长度和具体程度选择介词。|I get up at seven o'clock.|I get up on seven o'clock.=>I get up at seven o'clock.=>时刻用 at。|I was born in May 5th.=>I was born on May 5th.=>具体日期用 on。|preposition
g-prep-place|词性基础|A1|地点介词|in / on / at|根据空间位置和范围选择地点介词。|The book is on the desk.|The book is in the desk.=>The book is on the desk.=>表面用 on。|I am at home.=>I am at home.=>固定搭配 at home。|preposition
g-prep-collocation|词性基础|B1|介词固定搭配|look at / depend on|介词搭配需要整体记忆，不能只按中文直译。|I am good at English.|I am good in English.=>I am good at English.=>固定搭配用 at。|I depend in you.=>I depend on you.=>depend on 是固定搭配。|preposition
g-prep-doing|词性基础|B1|介词后接动名词|interested in doing|介词后接动词时通常使用 doing 形式。|She is interested in learning English.|She is interested in learn English.=>She is interested in learning English.=>介词后接 doing。|I look forward to see you.=>I look forward to seeing you.=>to 在此是介词。|preposition
g-article-aan|词性基础|A1|a / an 的区别|看发音不看字母|a/an 表示一个，选择取决于后一个音素而不是字母。|It took an hour.|It took a hour.=>It took an hour.=>hour 以元音音素开头。|She is an university student.=>She is a university student.=>university 以辅音音素开头。|article
g-article-the|词性基础|A2|the 与零冠词|特指与泛指|根据是否特指、是否独一无二选择 the 或零冠词。|The sun rises in the east.|Sun rises in east.=>The sun rises in the east.=>独一无二事物加 the。|I like the music.=>I like music.=>泛指音乐通常零冠词。|article
g-conjunction|词性基础|A2|连词基础|and / but / because|连词连接词、短语或句子，并表达逻辑关系。|Although it was raining, we went out.|Although it was raining, but we went out.=>Although it was raining, we went out.=>although 与 but 不连用。|I like tea and coffee.=>I like tea and coffee.=>and 连接并列成分。|clauses
g-interjection|词性基础|A1|感叹词基础|wow / oh / oops|感叹词表达情绪，通常独立于句子结构。|Wow, that is amazing!|Wow that is amazing.=>Wow, that is amazing!=>感叹词后通常加逗号或感叹号。|Oh, I see.=>Oh, I see.=>oh 表示理解或惊讶。|sentence
g-modal-can|动词专项|A1|can / could|能力、许可与请求|掌握情态动词 can/could 的用法和否定疑问形式。|She can swim.|She cans swim.=>She can swim.=>情态动词不变形。|Could you help me?=>Could you help me?=>could 可表示委婉请求。|can
g-modal-may|动词专项|A2|may / might|许可、可能|用 may/might 表达能力、许可和不确定推测。|It might rain later.|It might rains later.=>It might rain later.=>情态动词后用原形。|May I come in?=>May I come in?=>May I 表示礼貌请求。|modal
g-modal-must|动词专项|A2|must / have to|必须与不得不|区分主观必须和客观需要。|You must wear a seat belt.|You must to wear a seat belt.=>You must wear a seat belt.=>must 后接原形。|You mustn't have to go.=>You don't have to go.=>不必用 don't have to。|modal
g-modal-should|动词专项|A1|should|建议与应该|用 should 给出建议，否定形式为 should not。|You should drink more water.|You should to drink more water.=>You should drink more water.=>should 后接原形。|You shouldn't to stay up.=>You shouldn't stay up.=>shouldn't 后接原形。|modal
g-modal-need|动词专项|B1|need|需要与情态用法|区分 need 作实义动词和情态动词的用法。|You need to take a rest.|You need take a rest.=>You need to take a rest.=>need to do 结构。|You needn't to worry.=>You needn't worry.=>needn't 后接原形。|modal
g-modal-shall-will|动词专项|A2|shall / will|将来、意愿与建议|掌握 will 和 shall 的基本用法和语境差异。|I will call you tomorrow.|I will to call you tomorrow.=>I will call you tomorrow.=>will 后接原形。|Shall we going now?=>Shall we go now?=>Shall we 后接动词原形。|future
g-nonfinite-infinitive|动词专项|B1|to do 不定式|目的、将来与固定搭配|不定式可作目的状语、宾语或补语。|I want to learn English.|I want learn English.=>I want to learn English.=>want to do 结构。|I went there for see you.=>I went there to see you.=>目的用不定式。|cet-nonfinite
g-nonfinite-gerund|动词专项|B1|doing 动名词|主语、宾语与介词后|动名词具有名词性质，可作主语、宾语或介词宾语。|Reading helps me relax.|Read helps me relax.=>Reading helps me relax.=>动名词作主语。|I enjoy to read.=>I enjoy reading.=>enjoy 后接 doing。|cet-nonfinite
g-nonfinite-participle|动词专项|B1|现在分词与过去分词|doing / done|分词可作定语、状语或补语，注意主动和被动关系。|The boy running on the playground is Tom.|The boy run on the playground is Tom.=>The boy running on the playground is Tom.=>主动关系用 doing。|The book writing by him is new.=>The book written by him is new.=>被动关系用 done。|cet-nonfinite
`;
grammarTopicRows += `
g-verb-pattern|动词专项|B1|高频动词搭配辨析|stop / remember / forget / try|同一个动词后接 to do 或 doing 时含义可能不同。|Remember to lock the door.|Remember locking the door.=>Remember to lock the door.=>未做动作用 to do。|I stopped to smoke.=>I stopped smoking.=>根据含义选择 to do 或 doing。|cet-nonfinite
g-verb-pattern-more|动词专项|B1|动词接续规律|want / enjoy / decide / finish|根据动词固定搭配选择 to do 或 doing。|She decided to study abroad.|She decided studying abroad.=>She decided to study abroad.=>decide to do。|He finished to write the report.=>He finished writing the report.=>finish doing。|cet-nonfinite
g-syntax-subject|句法专题|A1|句子成分：主语|动作或状态的发出者|主语回答谁/什么，通常由名词、代词或名词短语充当。|The students are in the classroom.|The students is in the classroom.=>The students are in the classroom.=>复数主语配 are。|Reading is useful.=>Reading is useful.=>动名词可作主语。|sentence
g-syntax-predicate|句法专题|A1|句子成分：谓语|说明主语做什么或是什么|谓语是句子的核心，通常由动词或动词短语充当。|She reads English every day.|She read English every day.=>She reads English every day.=>第三人称单数谓语加 s。|She can swims.=>She can swim.=>情态动词后接原形。|sentence
g-syntax-object|句法专题|A1|句子成分：宾语|动作的承受者|宾语回答谁/什么，通常跟在及物动词或介词后。|I like English.|I like.=>I like English.=>及物动词需要宾语。|She gave me a book.=>She gave me a book.=>me 和 a book 都是宾语。|sentence
g-syntax-predicative|句法专题|A1|句子成分：表语|说明主语身份或状态|表语跟在系动词后，说明主语是什么或怎么样。|She is happy.|She is happily.=>She is happy.=>系动词后用形容词。|He becomes a teacher.=>He becomes a teacher.=>becomes 后接名词表语。|sentence
g-syntax-attribute|句法专题|A2|句子成分：定语|修饰名词或代词|定语说明名词的性质、所属、数量或特征。|The red book is mine.|The book red is mine.=>The red book is mine.=>形容词定语通常前置。|The book on the desk is new.=>The book on the desk is new.=>介词短语作后置定语。|cet-relative
g-syntax-adverbial|句法专题|A2|句子成分：状语|时间、地点、原因、方式|状语修饰动词、形容词、副词或整个句子。|She studies English carefully.|She studies English careful.=>She studies English carefully.=>方式状语用副词。|Because it rained, we stayed home.=>Because it rained, we stayed home.=>原因状语从句。|clauses
g-syntax-complement|句法专题|B1|句子成分：补语|补充说明宾语或主语|补语补充说明宾语或主语的状态、身份或动作结果。|The news made me happy.|The news made me happily.=>The news made me happy.=>宾补用形容词。|We elected him monitor.=>We elected him monitor.=>名词作宾补。|sentence
g-pattern-sv|句法专题|A1|五大句型：主谓|S + V|不及物动词构成的句子只需要主语和谓语。|The baby sleeps.|The baby sleeps a bed.=>The baby sleeps.=>不及物动词不带宾语。|They arrived at the station.=>They arrived at the station.=>地点状语可加在句末。|sentence
g-pattern-svo|句法专题|A1|五大句型：主谓宾|S + V + O|及物动词后需要动作承受者作宾语。|She likes music.|She likes.=>She likes music.=>及物动词需要宾语。|I know where is he.=>I know where he is.=>宾语从句用陈述语序。|cet-nounclause
g-pattern-svp|句法专题|A1|五大句型：主系表|S + V + P|系动词连接主语和表语，说明状态或身份。|He is a doctor.|He is doctor.=>He is a doctor.=>单数可数名词前加冠词。|She feels happily.=>She feels happy.=>feel 作系动词后用形容词。|be
`;
grammarTopicRows += `
g-pattern-svoo|句法专题|A2|五大句型：主谓双宾|S + V + IO + DO|有些动词后接间接宾语和直接宾语。|She gave me a book.|She gave a book me.=>She gave me a book.=>双宾语顺序要正确。|She explained me the rule.=>She explained the rule to me.=>explain 常接 to 结构。|sentence
g-pattern-svoc|句法专题|B1|五大句型：主谓宾补|S + V + O + C|宾语补足语补充说明宾语的状态或身份。|We made him happy.|We made him happily.=>We made him happy.=>宾补用形容词。|They elected him the monitor.=>They elected him monitor.=>职位名词作宾补常省略冠词。|sentence
g-clause-object|句法专题|B1|宾语从句|that / whether / wh-|从句作动词或介词的宾语，必须使用陈述语序。|I know that he is right.|I know that is he right.=>I know that he is right.=>宾语从句用陈述语序。|I wonder if will he come.=>I wonder if he will come.=>if 从句不倒装。|cet-nounclause
g-clause-relative|句法专题|B1|定语从句|who / which / that / whose|关系词连接从句并修饰前面的先行词。|The man who is talking is my teacher.|The man which is talking is my teacher.=>The man who is talking is my teacher.=>指人用 who。|This is the book who I bought.=>This is the book which I bought.=>指物用 which/that。|cet-relative
g-clause-adverbial|句法专题|B1|状语从句|时间、条件、原因、让步|状语从句说明主句发生的时间、条件、原因或让步。|If it rains, we will stay home.|If it will rain, we stay home.=>If it rains, we will stay home.=>条件从句用一般现在时表将来。|Although he was tired, but he continued.=>Although he was tired, he continued.=>although 与 but 不连用。|clauses
g-tense-present|八大时态|A1|一般现在时|习惯、事实与规律|一般现在时表达经常发生的动作、事实和规律。|She reads English every day.|She read English every day.=>She reads English every day.=>第三人称单数加 s。|She does not reads.=>She does not read.=>does 后用原形。|present
g-tense-past|八大时态|A1|一般过去时|过去动作与状态|一般过去时表示过去某个时间发生并结束的动作或状态。|I visited my grandparents yesterday.|I visit my grandparents yesterday.=>I visited my grandparents yesterday.=>过去动作加 ed。|Did you went there?=>Did you go there?=>did 后用原形。|pastregular
g-tense-future|八大时态|A2|一般将来时|will / be going to|一般将来时表示将来发生的动作、计划或预测。|She will call you tomorrow.|She will to call you tomorrow.=>She will call you tomorrow.=>will 后接原形。|I am going to will go.=>I am going to go.=>两个将来结构不叠加。|future
g-tense-present-continuous|八大时态|A1|现在进行时|be + doing|现在进行时表示此刻或现阶段正在发生的动作。|She is reading now.|She is read now.=>She is reading now.=>进行时用 doing。|She reading now.=>She is reading now.=>进行时不能省略 be。|continuous
g-tense-past-continuous|八大时态|A2|过去进行时|was/were + doing|过去进行时表示过去某个时间正在发生的动作。|I was reading at eight last night.|I read at eight last night.=>I was reading at eight last night.=>过去某时正在做用过去进行时。|While I was reading, the phone rang.=>While I was reading, the phone rang.=>while 连接持续动作。|cet-tenses
g-tense-present-perfect|八大时态|B1|现在完成时|have/has + done|现在完成时强调过去动作对现在的影响或持续到现在。|I have lived here for five years.|I live here for five years.=>I have lived here for five years.=>持续到现在用完成时。|She has went home.=>She has gone home.=>完成时用过去分词。|cet-tenses
g-tense-past-perfect|八大时态|B1|过去完成时|had + done|过去完成时表示在过去某时间之前已经完成的动作。|She had finished her homework before dinner.|She finished her homework before dinner.=>She had finished her homework before dinner.=>过去的过去用过去完成时。|I had saw it before.=>I had seen it before.=>过去完成时用过去分词。|cet-tenses
`;
grammarTopicRows += `
g-tense-perfect-continuous|八大时态|B1|现在完成进行时|have/has been doing|强调动作从过去持续到现在并可能继续。|She has been studying for three hours.|She has studied for three hours.=>She has been studying for three hours.=>强调持续过程用完成进行时。|She has been study.=>She has been studying.=>完成进行时用 doing。|cet-tenses
g-passive|语态与特殊句式|B1|被动语态|be + done|主语是动作承受者时使用被动语态。|The bridge was built in 2020.|The bridge built in 2020.=>The bridge was built in 2020.=>被动语态需要 be。|The book was wrote by him.=>The book was written by him.=>被动用过去分词。|cet-passive
g-inversion|语态与特殊句式|B1|倒装句|否定词与部分倒装|倒装改变正常语序以强调或满足特定结构。|Not only did she sing, but she also danced.|Not only she sang, but she also danced.=>Not only did she sing, but she also danced.=>否定词后倒装。|Only then I understood.=>Only then did I understand.=>Only 状语后倒装。|cet-inversion
g-emphasis|语态与特殊句式|B1|强调句|It is/was ... that ...|强调句用于突出句子中的某一部分。|It was Tom who helped me.|It was Tom who help me.=>It was Tom who helped me.=>从句保持完整谓语。|It is English that I love it.=>It is English that I love.=>强调句去掉结构后不能多宾语。|cet-inversion
g-subjunctive|语态与特殊句式|B1|虚拟语气|if 非真实条件|虚拟语气表示与事实相反的假设、愿望或建议。|If I were you, I would take the chance.|If I was you, I would take the chance.=>If I were you, I would take the chance.=>虚拟现在用 were。|If I had studied, I would pass.=>If I had studied, I would have passed.=>与过去相反用 would have done。|cet-condition
g-confuse-spend|高频易混词|B1|spend / take / cost / pay|主语与句型辨析|四个词都能表达花费，但主语和句型不同。|It took me two hours to finish it.|It spent me two hours to finish it.=>It took me two hours to finish it.=>take 句型。|The book cost me ten yuan.=>The book cost me ten yuan.=>物作主语用 cost。|cet-nounclause
g-confuse-usedto|高频易混词|B1|used to 结构辨析|used to do / be used to doing|区分过去常常、习惯于和被动使用。|She is used to getting up early.|She is used to get up early.=>She is used to getting up early.=>to 是介词，后接 doing。|She used to getting up early.=>She used to get up early.=>过去常常用 used to do。|cet-tenses
g-confuse-too|高频易混词|B1|too / so / enough|结果与程度结构|区分 too...to、so...that 和 enough to 的结果表达。|She is too young to drive.|She is too young that she can't drive.=>She is too young to drive.=>too...to 结构。|He is enough old to drive.=>He is old enough to drive.=>enough 放形容词后。|cet-tenses
g-confuse-because|高频易混词|B1|because / because of|从句与短语|because 后接句子，because of 后接名词或短语。|He was late because of the rain.|He was late because of it rained.=>He was late because it rained.=>完整句子用 because。|He was late because the rain.=>He was late because of the rain.=>短语用 because of。|clauses
g-confuse-although|高频易混词|A2|although / but|让步连词禁忌|although 和 but 不能同时连接同一个让步关系。|Although it was late, he continued working.|Although it was late, but he continued working.=>Although it was late, he continued working.=>although 与 but 不连用。|But although it was late, he continued.=>Although it was late, he continued.=>不要重复连接词。|clauses
g-confuse-afford|高频易混词|B1|afford / provide / supply|提供与负担|根据主语和搭配选择 afford、provide 与 supply。|I can't afford to buy a car.|I can't afford buy a car.=>I can't afford to buy a car.=>afford to do。|They provided us food.=>They provided us with food.=>provide sb with sth。|cet-tenses
g-confuse-rise|高频易混词|B1|rise / raise|不及物与及物|rise 通常不及物，raise 通常及物。|The sun rises in the east.|The sun raises in the east.=>The sun rises in the east.=>rise 不及物。|He rose his hand.=>He raised his hand.=>raise 后接宾语。|cet-tenses
`;
grammarTopicRows += `
g-confuse-borrow|高频易混词|A2|borrow / lend / keep|借入、借出与保留|根据方向和使用时长选择 borrow、lend、keep。|I borrowed a book from the library.|I borrowed a book to the library.=>I borrowed a book from the library.=>borrow from。|Can you borrow me your pen?=>Can you lend me your pen?=>借出用 lend。|cet-tenses
g-confuse-among|高频易混词|B1|among / between|三者与两者|between 常用于两者之间，among 常用于三者或以上。|The house is between the bank and the school.|The house is among the bank and the school.=>The house is between the bank and the school.=>两者用 between。|She is popular between the students.=>She is popular among the students.=>群体中用 among。|preposition
g-confuse-each|高频易混词|A2|each / every|个体与整体|each 强调每一个个体，every 强调整体中的每一个。|Each student has a book.|Each students have a book.=>Each student has a book.=>each 后接单数。|Every of the students is here.=>Every one of the students is here.=>every 不能直接接 of。|number
g-confuse-many|高频易混词|A2|many / much|可数与不可数|many 修饰可数名词复数，much 修饰不可数名词。|There are many books on the desk.|There are much books on the desk.=>There are many books on the desk.=>可数名词用 many。|I don't have many money.=>I don't have much money.=>不可数名词用 much。|number
g-writing-patterns|写作基础|A2|基础万能句型|五种高频表达|掌握可用于开头、观点和总结的稳定句型。|I think reading is important.|I think reading important.=>I think reading is important.=>宾语从句要有谓语。|In my opinion, we should keep learning.=>In my opinion, we should keep learning.=>表达观点句型。|sentence
g-writing-transitions|写作基础|B1|开头、过渡与结尾|First / However / In conclusion|使用连接词建立文章逻辑层次。|However, every choice has two sides.|However every choice has two sides.=>However, every choice has two sides.=>连接词后常加逗号。|In conclusion, we should keep learning.=>In conclusion, we should keep learning.=>结尾连接词。|sentence
g-writing-complex|写作基础|B1|并列句与复合句|and / because / although|用连接词把简单句组合成有层次的句子。|I like English because it is useful.|I like English because is useful.=>I like English because it is useful.=>从句必须有主语。|Although it was hard, I kept going.=>Although it was hard, I kept going.=>让步从句。|clauses
g-writing-pitfalls|写作基础|B1|常见中式英语避雷|主语、语序与搭配|避免逐字翻译造成的主语、语序和搭配错误。|I have a lot of homework to do.|I have many homeworks.=>I have a lot of homework.=>homework 不可数。|I very like English.=>I like English very much.=>程度副词位置错误。|sentence
`;
const grammarGroupRules = {
  '词性基础': ['先判断词性和句中功能。', '注意位置、修饰关系和固定搭配。', '结合单复数、可数性和上下文选词。'],
  '动词专项': ['先判断谓语还是非谓语。', '注意时态、语态、人称和固定搭配。', '情态动词后通常接动词原形。'],
  '句法专题': ['先找主干，再判断修饰成分。', '从句使用陈述语序，注意连接词。', '一个简单句通常只有一个主要谓语。'],
  '八大时态': ['先找时间标志和动作状态。', '判断一般、进行、完成或完成进行。', '注意第三人称单数、助动词和过去分词。'],
  '语态与特殊句式': ['先判断主动还是被动。', '注意倒装、强调和虚拟语气的固定结构。', '结构调整后要保留完整句子成分。'],
  '高频易混词': ['先判断主语和动作方向。', '比较可数、不可数和搭配差异。', '把固定搭配作为整体记忆。'],
  '写作基础': ['先写清主谓宾，再增加修饰。', '用连接词建立段落逻辑。', '避免中文逐字翻译和重复句式。']
};
const grammarGroupFormulas = {
  '词性基础': '词性 + 句法功能 + 搭配', '动词专项': '主语 + 动词结构 + 宾语/表语',
  '句法专题': '主干 + 修饰成分', '八大时态': '时间标志 + 动作状态 + 正确时态',
  '语态与特殊句式': '正确结构 + 语序 + 语境', '高频易混词': '主语 + 搭配 + 语义方向',
  '写作基础': '观点 + 连接 + 例证/结论'
};
function parseGrammarMistake(value, fallback) {
  const parts = String(value || '').split('=>');
  return { wrong: parts[0] || fallback, correct: parts[1] || fallback, note: parts[2] || '检查语法结构和搭配。' };
}
function grammarTopicFromRow(line, index) {
  const parts = line.split('|');
  const [id, group, level, title, subtitle, summary, correct, wrong1, wrong2, videoKey] = parts;
  const first = parseGrammarMistake(wrong1, correct);
  const second = parseGrammarMistake(wrong2, correct);
  const rules = grammarGroupRules[group] || ['先理解定义和结构。', '结合例句判断用法。', '完成后检查常见错误。'];
  const videoSource = (typeof lessonVideos !== 'undefined' && (lessonVideos[videoKey] || lessonVideos.rabbitGrammar)) || { bvid: 'BV1XY411J7aG', page: 2, title: '英语语法精讲合集', teacher: '英语兔', source: 'https://www.bilibili.com/video/BV1XY411J7aG' };
  return {
    id, num: 101 + index, group, level, title, subtitle, summary,
    formula: grammarGroupFormulas[group] || '观察结构 + 判断用法 + 检查错误', cues: [],
    rules: rules.map((text, ruleIndex) => ['要点 ' + (ruleIndex + 1), text]),
    examples: [
      { en: correct, zh: '正确示例：' + correct, note: summary, good: true },
      { en: first.wrong, zh: '错误示例：' + first.wrong, note: first.note, good: false }
    ],
    mistakes: [`${first.wrong} → ${first.correct}：${first.note}`, `${second.wrong} → ${second.correct}：${second.note}`],
    mcq: [
      { q: '选择正确句子：', options: [correct, first.wrong, second.wrong], answer: 0, explanation: summary },
      { q: '选择正确的修改：' + second.wrong, options: [second.correct, first.correct, second.wrong], answer: 0, explanation: second.note }
    ],
    fill: [
      { q: '改正句子：' + first.wrong, answer: first.correct, hint: '句子改错', explanation: first.note },
      { q: '改正句子：' + second.wrong, answer: second.correct, hint: '句子改错', explanation: second.note }
    ],
    translations: [{ zh: '请用本专题语法写一个正确句子：' + title, answer: correct, explanation: summary }],
    microTopic: true,
    video: Object.assign({}, videoSource, { note: `合集内重点学习：${title}。${videoSource.note || ''}`, topicTitle: title })
  };
}
const grammarTopics = grammarTopicRows.trim().split(/\r?\n/).filter(Boolean).map(grammarTopicFromRow);

