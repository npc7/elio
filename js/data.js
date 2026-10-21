/* Elio curriculum data — ages 2–3.
 * Lesson types:
 *   cards  — flashcards: { items: [{ e, t?, rep?, svg?, zh, en, szh?, sen?, label?, sub?, word? }] }
 *   choose — tap the right one: { from: [lessonIds] } (auto rounds) or { rounds: [{ q, show?, options, a, ok? }] }
 *   count  — tap to count: { rounds: [{ e, n, zh, en }] }
 *   story  — narrated picture pages: { pages: [{ e, zh, en }] }
 *   sort   — put into one of two bins: { bins: [b, b], items: [{ e, zh, en, b }] }
 */
(() => {
  const C = (e, zh, en, szh, sen) => ({ e, zh, en, szh, sen });
  const P = (e, zh, en) => ({ e, zh, en });
  const OK = { e: '👍', zh: '可以', en: 'OK' };
  const NO = { e: '🙅', zh: '不可以', en: 'Not OK' };

  window.ELIO = {
    worlds: [
      {
        id: 'world', e: '🌍', zh: '认识世界', en: 'My World', color: '#FFE08A',
        lessons: [
          { id: 'farm', e: '🐮', zh: '农场动物', en: 'Farm Animals', type: 'cards', items: [
            C('🐶', '小狗', 'dog', '汪汪汪', 'woof woof'),
            C('🐱', '小猫', 'cat', '喵喵喵', 'meow'),
            C('🦆', '鸭子', 'duck', '嘎嘎嘎', 'quack quack'),
            C('🐮', '奶牛', 'cow', '哞——', 'moo'),
            C('🐑', '小羊', 'sheep', '咩咩咩', 'baa baa'),
            C('🐷', '小猪', 'pig', '噜噜噜', 'oink oink'),
            C('🐓', '公鸡', 'rooster', '喔喔喔', 'cock-a-doodle-doo'),
            C('🐴', '小马', 'horse', '咴咴咴', 'neigh'),
          ] },
          { id: 'wild', e: '🦁', zh: '野生动物', en: 'Wild Animals', type: 'cards', items: [
            C('🐯', '老虎', 'tiger', '嗷呜', 'roar'),
            C('🦁', '狮子', 'lion', '吼——', 'roar'),
            C('🐘', '大象', 'elephant', '长长的鼻子', 'a long trunk'),
            C('🦒', '长颈鹿', 'giraffe', '长长的脖子', 'a long neck'),
            C('🐒', '猴子', 'monkey', '吱吱吱', 'ooh ooh ah ah'),
            C('🐻', '小熊', 'bear', '抱一抱', 'big hug'),
            C('🐸', '青蛙', 'frog', '呱呱呱', 'ribbit'),
            C('🐰', '小兔子', 'rabbit', '蹦蹦跳', 'hop hop'),
            C('🐟', '小鱼', 'fish', '游啊游', 'swim swim'),
            C('🐦', '小鸟', 'bird', '叽叽喳喳', 'tweet tweet'),
          ] },
          { id: 'find-animal', e: '🔍', zh: '找动物', en: 'Find Animals', type: 'choose', from: ['farm', 'wild'] },
          { id: 'fruits', e: '🍎', zh: '水果蔬菜', en: 'Fruits & Veggies', type: 'cards', items: [
            C('🍎', '苹果', 'apple'), C('🍌', '香蕉', 'banana'), C('🍇', '葡萄', 'grapes'),
            C('🍉', '西瓜', 'watermelon'), C('🍓', '草莓', 'strawberry'), C('🍊', '橘子', 'orange'),
            C('🍐', '梨', 'pear'), C('🍑', '桃子', 'peach'), C('🥕', '胡萝卜', 'carrot'),
            C('🍅', '西红柿', 'tomato'), C('🌽', '玉米', 'corn'), C('🥦', '西兰花', 'broccoli'),
          ] },
          { id: 'food', e: '🥛', zh: '好吃的', en: 'Yummy Food', type: 'cards', items: [
            C('🥛', '牛奶', 'milk'), C('🍞', '面包', 'bread'), C('🍚', '米饭', 'rice'),
            C('🥚', '鸡蛋', 'egg'), C('🍜', '面条', 'noodles'), C('🥟', '饺子', 'dumplings'),
            C('💧', '水', 'water', '多喝水', 'drink water'),
          ] },
          { id: 'find-fruit', e: '🧺', zh: '找水果', en: 'Find Fruits', type: 'choose', from: ['fruits'] },
          { id: 'vehicles', e: '🚗', zh: '交通工具', en: 'Vehicles', type: 'cards', items: [
            C('🚗', '小汽车', 'car', '嘀嘀嘀', 'beep beep'),
            C('🚌', '公交车', 'bus', '上车啦', 'all aboard'),
            C('🚂', '火车', 'train', '呜——呜——', 'choo choo'),
            C('✈️', '飞机', 'airplane', '飞上天', 'up in the sky'),
            C('🚢', '轮船', 'ship', '呜——', 'toot toot'),
            C('🚲', '自行车', 'bike', '叮铃铃', 'ring ring'),
            C('🚒', '消防车', 'fire truck', '呜哇呜哇', 'nee-naw'),
            C('🚑', '救护车', 'ambulance', '呜哇呜哇', 'nee-naw'),
            C('🚁', '直升机', 'helicopter', '呼呼呼', 'whirr'),
            C('🚀', '火箭', 'rocket', '三、二、一，发射！', 'three, two, one, blast off!'),
          ] },
          { id: 'find-vehicle', e: '🚦', zh: '找车车', en: 'Find Vehicles', type: 'choose', from: ['vehicles'] },
          { id: 'body', e: '👀', zh: '我的身体', en: 'My Body', type: 'cards', items: [
            C('👀', '眼睛', 'eyes', '看一看', 'look'),
            C('👂', '耳朵', 'ears', '听一听', 'listen'),
            C('👃', '鼻子', 'nose', '闻一闻', 'smell'),
            C('👄', '嘴巴', 'mouth', '张开嘴', 'open wide'),
            C('🦷', '牙齿', 'teeth', '刷刷牙', 'brush brush'),
            C('✋', '小手', 'hands', '拍拍手', 'clap clap'),
            C('🦶', '小脚', 'feet', '跺跺脚', 'stomp stomp'),
            C('💇', '头发', 'hair', '梳梳头', 'comb comb'),
          ] },
        ],
      },

      {
        id: 'english', e: '🔤', zh: '英语启蒙', en: 'Hello English', color: '#B5E3A8', enFirst: true,
        lessons: [
          { id: 'hello', e: '👋', zh: '打招呼', en: 'Hello!', type: 'cards', items: [
            C('👋', '你好', 'Hello!'), C('🙋', '再见', 'Bye-bye!'), C('🙏', '谢谢', 'Thank you!'),
            C('🌞', '早上好', 'Good morning!'), C('🌙', '晚安', 'Good night!'), C('❤️', '我爱你', 'I love you!'),
            C('👍', '好的', 'Yes!'), C('🙅', '不要', 'No!'),
          ] },
          { id: 'family', e: '👨‍👩‍👧', zh: '我的家人', en: 'My Family', type: 'cards', items: [
            C('👩', '妈妈', 'Mommy'), C('👨', '爸爸', 'Daddy'), C('👶', '宝宝', 'Baby'),
            C('👵', '奶奶', 'Grandma'), C('👴', '爷爷', 'Grandpa'), C('👦', '哥哥', 'Brother'),
            C('👧', '姐姐', 'Sister'), C('🧒', '我', 'Me!'),
          ] },
          { id: 'colors', e: '🎨', zh: '颜色', en: 'Colors', type: 'cards', items: [
            C('🔴', '红色', 'red'), C('🟠', '橙色', 'orange'), C('🟡', '黄色', 'yellow'),
            C('🟢', '绿色', 'green'), C('🔵', '蓝色', 'blue'), C('🟣', '紫色', 'purple'),
            C('🌸', '粉色', 'pink'), C('🟤', '棕色', 'brown'), C('⚫', '黑色', 'black'), C('⚪', '白色', 'white'),
          ] },
          { id: 'find-color', e: '🖍️', zh: '找颜色', en: 'Find Colors', type: 'choose', from: ['colors'], qzh: '{x}在哪里？', qen: 'Find {x}!' },
          { id: 'numbers-en', e: '🔟', zh: '数字 1-10', en: 'Numbers 1-10', type: 'cards', items: [
            { t: '1', e: '🐣', rep: 1, zh: '一', en: 'one' }, { t: '2', e: '🐣', rep: 2, zh: '二', en: 'two' },
            { t: '3', e: '🐣', rep: 3, zh: '三', en: 'three' }, { t: '4', e: '🐣', rep: 4, zh: '四', en: 'four' },
            { t: '5', e: '🐣', rep: 5, zh: '五', en: 'five' }, { t: '6', e: '🐣', rep: 6, zh: '六', en: 'six' },
            { t: '7', e: '🐣', rep: 7, zh: '七', en: 'seven' }, { t: '8', e: '🐣', rep: 8, zh: '八', en: 'eight' },
            { t: '9', e: '🐣', rep: 9, zh: '九', en: 'nine' }, { t: '10', e: '🐣', rep: 10, zh: '十', en: 'ten' },
          ] },
          { id: 'actions', e: '🏃', zh: '动起来', en: 'Move!', type: 'cards', tip: '和宝宝一边说一边做动作', items: [
            C('🏃', '跑', 'run', '跑一跑', "Let's run!"), C('🦘', '跳', 'jump', '跳一跳', "Let's jump!"),
            C('👏', '拍手', 'clap', '拍拍手', 'Clap your hands!'), C('💃', '跳舞', 'dance', '跳个舞', "Let's dance!"),
            C('👋', '挥手', 'wave', '挥挥手', 'Wave hello!'), C('🎤', '唱歌', 'sing', '唱首歌', "Let's sing!"),
            C('🍽️', '吃饭', 'eat', '吃饭饭', 'Yum yum!'), C('😴', '睡觉', 'sleep', '睡觉觉', 'Night night!'),
          ] },
          { id: 'abc', e: '🅰️', zh: '字母 ABC', en: 'ABC', type: 'cards', items: [
            ['A', '🍎', '苹果', 'Apple'], ['B', '⚽', '球', 'Ball'], ['C', '🐱', '猫', 'Cat'], ['D', '🐶', '狗', 'Dog'],
            ['E', '🥚', '鸡蛋', 'Egg'], ['F', '🐟', '鱼', 'Fish'], ['G', '🍇', '葡萄', 'Grapes'], ['H', '🎩', '帽子', 'Hat'],
            ['I', '🍦', '冰淇淋', 'Ice cream'], ['J', '🧃', '果汁', 'Juice'], ['K', '🪁', '风筝', 'Kite'], ['L', '🦁', '狮子', 'Lion'],
            ['M', '🌙', '月亮', 'Moon'], ['N', '👃', '鼻子', 'Nose'], ['O', '🍊', '橙子', 'Orange'], ['P', '🐷', '猪', 'Pig'],
            ['Q', '👸', '女王', 'Queen'], ['R', '🐰', '兔子', 'Rabbit'], ['S', '☀️', '太阳', 'Sun'], ['T', '🐯', '老虎', 'Tiger'],
            ['U', '☂️', '雨伞', 'Umbrella'], ['V', '🎻', '小提琴', 'Violin'], ['W', '🍉', '西瓜', 'Watermelon'], ['X', '🦊', '狐狸', 'Fox'],
            ['Y', '🪀', '悠悠球', 'Yo-yo'], ['Z', '🦓', '斑马', 'Zebra'],
          ].map(([L, e, zh, w]) => ({
            t: L + L.toLowerCase(), e, zh, label: w, sub: zh,
            en: L === 'X' ? 'X. Fox has an X!' : `${L}. ${L} is for ${w}!`,
          })) },
          { id: 'find-en', e: '🎯', zh: '找一找', en: 'Find it!', type: 'choose', from: ['farm', 'fruits'] },
        ],
      },

      {
        id: 'numbers', e: '🔢', zh: '数字形状', en: 'Numbers & Shapes', color: '#A9D2F5',
        lessons: [
          { id: 'count5', e: '🖐️', zh: '数一数 1-5', en: 'Count 1-5', type: 'count', rounds: [
            { e: '🍎', n: 1, zh: '苹果', en: 'apple' }, { e: '🐥', n: 2, zh: '小鸡', en: 'chicks' },
            { e: '🎈', n: 3, zh: '气球', en: 'balloons' }, { e: '⭐', n: 4, zh: '星星', en: 'stars' },
            { e: '🐟', n: 5, zh: '小鱼', en: 'fish' },
          ] },
          { id: 'count10', e: '🔟', zh: '数一数 6-10', en: 'Count 6-10', type: 'count', rounds: [
            { e: '🍓', n: 6, zh: '草莓', en: 'strawberries' }, { e: '🚗', n: 7, zh: '小汽车', en: 'cars' },
            { e: '🐞', n: 8, zh: '瓢虫', en: 'ladybugs' }, { e: '🌸', n: 9, zh: '小花', en: 'flowers' },
            { e: '🦆', n: 10, zh: '鸭子', en: 'ducks' },
          ] },
          { id: 'numbers-zh', e: '1️⃣', zh: '认数字', en: 'Numbers', type: 'cards', items:
            ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'].map((zh, i) => ({
              t: String(i + 1), e: ['🍎', '🐥', '🎈', '⭐', '🐟', '🍓', '🚗', '🐞', '🌸', '🦆'][i], rep: i + 1, zh,
              en: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][i],
            })) },
          { id: 'shapes', e: '🔺', zh: '形状', en: 'Shapes', type: 'cards', items: [
            { svg: 'circle', zh: '圆形', en: 'circle', szh: '圆圆的', sen: 'round round' },
            { svg: 'square', zh: '正方形', en: 'square' },
            { svg: 'triangle', zh: '三角形', en: 'triangle', szh: '三个角', sen: 'three corners' },
            { svg: 'rectangle', zh: '长方形', en: 'rectangle' },
            { svg: 'star', zh: '星形', en: 'star', szh: '一闪一闪', sen: 'twinkle twinkle' },
            { svg: 'heart', zh: '心形', en: 'heart', szh: '爱你哟', sen: 'love you' },
            { svg: 'oval', zh: '椭圆形', en: 'oval', szh: '像鸡蛋', sen: 'like an egg' },
            { svg: 'diamond', zh: '菱形', en: 'diamond' },
          ] },
          { id: 'find-shape', e: '🟦', zh: '找形状', en: 'Find Shapes', type: 'choose', from: ['shapes'] },
          { id: 'big-small', e: '🐘', zh: '大和小', en: 'Big & Small', type: 'choose', rounds: [
            { q: { zh: '哪个大？', en: 'Which one is big?' }, options: [{ e: '🐘', scale: 1.5 }, { e: '🐘', scale: 0.6 }], a: 0 },
            { q: { zh: '哪个小？', en: 'Which one is small?' }, options: [{ e: '🍎', scale: 0.6 }, { e: '🍎', scale: 1.5 }], a: 0 },
            { q: { zh: '哪个大？', en: 'Which one is big?' }, options: [{ e: '🚌', scale: 1.5 }, { e: '🚌', scale: 0.6 }], a: 0 },
            { q: { zh: '哪个小？', en: 'Which one is small?' }, options: [{ e: '🐶', scale: 0.6 }, { e: '🐶', scale: 1.5 }], a: 0 },
            { q: { zh: '哪个大？', en: 'Which one is big?' }, options: [{ e: '⚽', scale: 1.5 }, { e: '⚽', scale: 0.6 }], a: 0 },
            { q: { zh: '哪个小？', en: 'Which one is small?' }, options: [{ e: '🐻', scale: 0.6 }, { e: '🐻', scale: 1.5 }], a: 0 },
          ] },
          { id: 'more-less', e: '🍪', zh: '多和少', en: 'More & Less', type: 'choose', rounds: [
            { q: { zh: '哪边多？', en: 'Which has more?' }, options: [{ e: '🍪', rep: 4 }, { e: '🍪', rep: 1 }], a: 0 },
            { q: { zh: '哪边多？', en: 'Which has more?' }, options: [{ e: '🎈', rep: 5 }, { e: '🎈', rep: 2 }], a: 0 },
            { q: { zh: '哪边少？', en: 'Which has less?' }, options: [{ e: '🍓', rep: 1 }, { e: '🍓', rep: 4 }], a: 0 },
            { q: { zh: '哪边多？', en: 'Which has more?' }, options: [{ e: '⭐', rep: 6 }, { e: '⭐', rep: 2 }], a: 0 },
            { q: { zh: '哪边少？', en: 'Which has less?' }, options: [{ e: '🐟', rep: 2 }, { e: '🐟', rep: 5 }], a: 0 },
          ] },
        ],
      },

      {
        id: 'china', e: '🏮', zh: '中国故事', en: 'China Stories', color: '#F7B2AD',
        lessons: [
          { id: 'hanzi', e: '日', zh: '汉字宝宝', en: 'Chinese Characters', type: 'cards', tip: '象形字：字长得像它表示的东西', items: [
            ['日', '☀️', '太阳', 'sun'], ['月', '🌙', '月亮', 'moon'], ['山', '⛰️', '高山', 'mountain'],
            ['水', '💧', '河水', 'water'], ['火', '🔥', '火苗', 'fire'], ['人', '🧍', '大人小孩', 'person'],
            ['木', '🌳', '大树', 'tree'], ['口', '👄', '嘴巴', 'mouth'], ['雨', '🌧️', '下雨', 'rain'],
            ['田', '🌾', '稻田', 'field'], ['目', '👁️', '眼睛', 'eye'], ['鱼', '🐟', '小鱼', 'fish'],
          ].map(([t, e, w, en]) => ({ t, e, zh: `${t}，${w}`, en, label: w, sub: en })) },
          { id: 'zodiac', e: '🐲', zh: '十二生肖', en: 'Chinese Zodiac', type: 'cards', items: [
            C('🐭', '鼠', 'rat'), C('🐮', '牛', 'ox'), C('🐯', '虎', 'tiger'), C('🐰', '兔', 'rabbit'),
            C('🐲', '龙', 'dragon'), C('🐍', '蛇', 'snake'), C('🐴', '马', 'horse'), C('🐑', '羊', 'goat'),
            C('🐵', '猴', 'monkey'), C('🐔', '鸡', 'rooster'), C('🐶', '狗', 'dog'), C('🐷', '猪', 'pig'),
          ] },
          { id: 'spring', e: '🧧', zh: '过年啦', en: 'Chinese New Year', type: 'story', pages: [
            P('🧧🏮', '过年啦！大家穿上新衣服，开开心心。', "It's Chinese New Year! Everyone wears new clothes."),
            P('🏮📜', '贴春联，挂红灯笼，红红火火。', 'We hang red lanterns and red banners.'),
            P('👨‍👩‍👧🥟', '一家人坐在一起，包饺子。', 'The family makes dumplings together.'),
            P('🎆🎇', '放烟花啦，好漂亮！', 'Look at the fireworks! So pretty!'),
            P('👵🧧', '给爷爷奶奶拜年，说"新年好"！', 'Say "Happy New Year" to Grandma and Grandpa!'),
            P('🦁🥁', '舞狮子，敲锣鼓，咚咚锵！', 'Lion dance with big drums! Dong dong qiang!'),
            P('🐉✨', '新年快乐！', 'Happy New Year!'),
          ] },
          { id: 'midautumn', e: '🥮', zh: '中秋节', en: 'Mid-Autumn Festival', type: 'story', pages: [
            P('🌕', '中秋节的晚上，月亮又圆又亮。', 'On Mid-Autumn night, the moon is big and round.'),
            P('🥮', '我们吃月饼，甜甜的。', 'We eat sweet mooncakes.'),
            P('👨‍👩‍👧‍👦', '一家人团团圆圆，在一起。', 'The whole family is together.'),
            P('🌙🐇', '传说，月亮上住着嫦娥和小玉兔。', 'Legend says Chang\'e and a jade rabbit live on the moon.'),
            P('🏮🌕', '提着灯笼，一起看月亮。', 'We carry lanterns and look at the moon.'),
          ] },
          { id: 'dragonboat', e: '🐉', zh: '端午节', en: 'Dragon Boat Festival', type: 'story', pages: [
            P('🐉🚣', '端午节到了，赛龙舟，划呀划！', 'Dragon Boat Festival! Row, row, row the dragon boat!'),
            P('🍙', '我们吃粽子，糯糯的，香香的。', 'We eat zongzi, sticky rice wrapped in leaves.'),
            P('🌿', '门口挂上艾草，香香的。', 'We hang fresh green leaves by the door.'),
            P('📜', '端午节，是为了纪念伟大的诗人屈原。', 'We remember a great poet named Qu Yuan.'),
          ] },
          { id: 'treasures', e: '🐼', zh: '中国名片', en: 'China Treasures', type: 'story', pages: [
            P('🐼🎋', '大熊猫是中国的国宝，最爱吃竹子。', 'Giant pandas are China\'s treasure. They love bamboo.'),
            P('🏯🐉', '长城很长很长，像一条长龙趴在山上。', 'The Great Wall is very long, like a dragon on the mountains.'),
            P('🧱👷', '很久以前，人们一块砖一块砖把它建起来。', 'Long ago, people built it brick by brick.'),
            P('🏯❤️', '故宫有好多红房子，以前皇帝住在这里。', 'The Forbidden City has many red buildings. Emperors lived there.'),
          ] },
          { id: 'inventions-cn', e: '🧭', zh: '古代发明', en: 'Ancient Inventions', type: 'story', pages: [
            P('📜', '很久以前，中国人发明了纸，可以在上面画画写字。', 'Long ago, people in China invented paper.'),
            P('🧭', '发明了指南针，帮人们找到方向。', 'They invented the compass to find the way.'),
            P('🎆', '发明了火药，变成了漂亮的烟花。', 'They invented gunpowder, and made fireworks.'),
            P('📖', '发明了印刷，书本越来越多。', 'They invented printing, so we have lots of books.'),
            P('🍵🧵', '还会种茶叶，织丝绸。', 'They also grew tea and made silk.'),
          ] },
          { id: 'kongrong', e: '🍐', zh: '孔融让梨', en: 'Kong Rong Shares', type: 'story', pages: [
            P('👦', '很久以前，有个小朋友叫孔融。', 'Long ago, there was a little boy named Kong Rong.'),
            P('🍐🍐🍐', '家里有一盘梨，有大的，有小的。', 'There was a plate of pears, big and small.'),
            P('👦🍐', '孔融拿了一个最小的。', 'Kong Rong took the smallest one.'),
            P('👨‍👦', '他说：哥哥比我大，大的给哥哥吃。', '"My big brother should have a big one," he said.'),
            P('👶🍐', '弟弟比我小，也给弟弟一个大的。', '"My little brother should have a big one too."'),
            P('❤️', '孔融懂得分享，真是好孩子！', 'Kong Rong knows how to share. Good job!'),
          ] },
          { id: 'caochong', e: '⚖️', zh: '曹冲称象', en: 'Weighing the Elephant', type: 'story', pages: [
            P('🐘', '有人送来一头大象，好大好大！', 'Someone brought a very, very big elephant!'),
            P('⚖️❓', '大象有多重呢？没有那么大的秤呀。', 'How heavy is it? There is no scale big enough.'),
            P('👦💡', '小朋友曹冲想到一个好办法。', 'A little boy named Cao Chong had an idea.'),
            P('🐘🚤', '把大象牵到船上，看船沉到哪里，画一条线。', 'Put the elephant on a boat. Draw a line where the water is.'),
            P('🪨🚤', '再把石头搬上船，一直到那条线。', 'Then fill the boat with stones up to the same line.'),
            P('⚖️🪨', '称一称石头，就知道大象有多重啦！', 'Weigh the stones, and you know how heavy the elephant is!'),
            P('💡🧠', '动动小脑筋，就有好办法！', 'Use your brain, and you can find a way!'),
          ] },
        ],
      },

      {
        id: 'trip', e: '🗺️', zh: '世界之旅', en: 'World Trip', color: '#9FE3EC',
        lessons: [
          { id: 'earth', e: '🌍', zh: '我们的地球', en: 'Our Earth', type: 'story', pages: [
            P('🌍', '这是我们的家——地球。', 'This is our home, Earth.'),
            P('🌊🐳', '地球上有大大的海洋。', 'Earth has big, big oceans.'),
            P('🏔️', '有高高的山。', 'It has tall mountains.'),
            P('🌳🌳', '有绿绿的森林。', 'It has green forests.'),
            P('🏜️🐫', '还有热热的沙漠。', 'And hot deserts.'),
            P('🧒👧👦', '世界上有很多小朋友，说不一样的话，都是好朋友！', 'Children all over the world speak different languages. We are all friends!'),
          ] },
          { id: 'animal-places', e: '🦘', zh: '动物住在哪', en: 'Where Animals Live', type: 'cards', items: [
            C('🦘', '袋鼠', 'kangaroo', '住在澳大利亚', 'lives in Australia'),
            C('🐨', '考拉', 'koala', '住在澳大利亚', 'lives in Australia'),
            C('🐧', '企鹅', 'penguin', '住在冰冷的南极', 'lives in Antarctica'),
            C('🐻‍❄️', '北极熊', 'polar bear', '住在北极', 'lives in the Arctic'),
            C('🦒', '长颈鹿', 'giraffe', '住在非洲', 'lives in Africa'),
            C('🐫', '骆驼', 'camel', '住在沙漠', 'lives in the desert'),
            C('🐼', '熊猫', 'panda', '住在中国', 'lives in China'),
            C('🐳', '鲸鱼', 'whale', '住在大海', 'lives in the ocean'),
          ] },
          { id: 'animal-homes', e: '🏠', zh: '动物的家', en: 'Animal Homes', type: 'choose', rounds: [
            { q: { zh: '企鹅住在哪里？', en: 'Where does the penguin live?' }, show: '🐧', options: [{ e: '🧊', zh: '冰雪', en: 'ice' }, { e: '🏜️', zh: '沙漠', en: 'desert' }], a: 0 },
            { q: { zh: '骆驼住在哪里？', en: 'Where does the camel live?' }, show: '🐫', options: [{ e: '🏜️', zh: '沙漠', en: 'desert' }, { e: '🌊', zh: '大海', en: 'ocean' }], a: 0 },
            { q: { zh: '小鱼住在哪里？', en: 'Where does the fish live?' }, show: '🐟', options: [{ e: '🌊', zh: '水里', en: 'water' }, { e: '🌳', zh: '树上', en: 'tree' }], a: 0 },
            { q: { zh: '小鸟住在哪里？', en: 'Where does the bird live?' }, show: '🐦', options: [{ e: '🪺', zh: '鸟窝', en: 'nest' }, { e: '🌊', zh: '水里', en: 'water' }], a: 0 },
            { q: { zh: '小狗住在哪里？', en: 'Where does the dog live?' }, show: '🐶', options: [{ e: '🏠', zh: '房子', en: 'house' }, { e: '🧊', zh: '冰雪', en: 'ice' }], a: 0 },
            { q: { zh: '猴子住在哪里？', en: 'Where does the monkey live?' }, show: '🐒', options: [{ e: '🌴', zh: '树林', en: 'jungle' }, { e: '🧊', zh: '冰雪', en: 'ice' }], a: 0 },
          ] },
          { id: 'world-hello', e: '🗣️', zh: '世界你好', en: 'Hello, World', type: 'cards', items: [
            { e: '🇨🇳', zh: '中国小朋友说', en: 'In China, we say', word: { text: '你好', lang: 'zh-CN' }, label: '你好', sub: '中国 China' },
            { e: '🇬🇧', zh: '英国小朋友说', en: 'In England, we say', word: { text: 'Hello', lang: 'en-GB' }, label: 'Hello', sub: '英国 UK' },
            { e: '🇫🇷', zh: '法国小朋友说', en: 'In France, we say', word: { text: 'Bonjour', lang: 'fr-FR' }, label: 'Bonjour', sub: '法国 France' },
            { e: '🇪🇸', zh: '西班牙小朋友说', en: 'In Spain, we say', word: { text: 'Hola', lang: 'es-ES' }, label: 'Hola', sub: '西班牙 Spain' },
            { e: '🇩🇪', zh: '德国小朋友说', en: 'In Germany, we say', word: { text: 'Hallo', lang: 'de-DE' }, label: 'Hallo', sub: '德国 Germany' },
            { e: '🇯🇵', zh: '日本小朋友说', en: 'In Japan, we say', word: { text: 'こんにちは', lang: 'ja-JP' }, label: 'Konnichiwa', sub: '日本 Japan' },
            { e: '🇰🇷', zh: '韩国小朋友说', en: 'In Korea, we say', word: { text: '안녕하세요', lang: 'ko-KR' }, label: 'Annyeong', sub: '韩国 Korea' },
            { e: '🇮🇹', zh: '意大利小朋友说', en: 'In Italy, we say', word: { text: 'Ciao', lang: 'it-IT' }, label: 'Ciao', sub: '意大利 Italy' },
          ] },
          { id: 'dinos', e: '🦕', zh: '恐龙时代', en: 'Dinosaurs', type: 'story', pages: [
            P('🦕🌴', '很久很久以前，地球上住着恐龙。', 'Long, long ago, dinosaurs lived on Earth.'),
            P('🦖', '霸王龙个子大大，牙齿尖尖。', 'T. rex was big, with sharp teeth.'),
            P('🦕🌳', '长脖子恐龙，伸长脖子吃树叶。', 'Long-neck dinosaurs ate leaves from tall trees.'),
            P('🥚🦕', '恐龙宝宝从蛋里钻出来。', 'Baby dinosaurs hatched from eggs.'),
            P('☄️🌋', '后来，恐龙都不见了。', 'Then, the dinosaurs were gone.'),
            P('🦴🏛️', '现在，我们在博物馆看恐龙化石。', 'Now we can see dinosaur bones in museums.'),
          ] },
          { id: 'human-story', e: '🔥', zh: '人类的故事', en: 'The Story of People', type: 'story', pages: [
            P('🪨🧑', '很久以前，人们住在山洞里。', 'Long ago, people lived in caves.'),
            P('🔥', '人们学会了用火，暖暖的，还能煮东西。', 'People learned to use fire to keep warm and cook.'),
            P('🌾🐄', '人们学会了种地，养动物。', 'People learned to grow food and raise animals.'),
            P('🛞', '发明了轮子，东西可以滚着走。', 'People invented the wheel.'),
            P('✍️📜', '发明了文字，把故事写下来。', 'People invented writing to keep their stories.'),
            P('⛵🌊', '造了大船，去很远很远的地方。', 'People built ships to sail far away.'),
            P('💡', '发明了电灯，晚上也亮亮的。', 'People invented the light bulb.'),
            P('✈️🚀', '飞上了天空，还去了月亮！', 'People flew in the sky, and even went to the moon!'),
            P('💻🤖', '现在，我们有了电脑和机器人。', 'Now we have computers and robots.'),
            P('🧒💡', '下一个发明，可能就是你的哦！', 'The next great invention could be yours!'),
          ] },
        ],
      },

      {
        id: 'thinker', e: '🤖', zh: '小小思考家', en: 'Little Thinker', color: '#D5B8EC',
        lessons: [
          { id: 'feelings', e: '😊', zh: '我的心情', en: 'My Feelings', type: 'cards', items: [
            C('😊', '开心', 'happy', '笑一笑', 'smile'),
            C('😢', '难过', 'sad', '抱一抱就好了', 'a hug helps'),
            C('😠', '生气', 'angry', '深呼吸，慢慢来', 'take a deep breath'),
            C('😨', '害怕', 'scared', '找爸爸妈妈', 'find mommy or daddy'),
            C('😮', '惊讶', 'surprised', '哇！', 'wow!'),
            { ...C('😴', '困了', 'sleepy', '睡觉觉', 'time for bed'), qx: '困' },
          ] },
          { id: 'find-feeling', e: '🥰', zh: '谁很开心', en: 'Find Feelings', type: 'choose', from: ['feelings'], qzh: '谁很{x}？', qen: 'Who is {x}?' },
          { id: 'pattern', e: '🔁', zh: '找规律', en: 'What Comes Next?', type: 'choose', rounds: [
            { q: { zh: '下一个是什么？', en: 'What comes next?' }, show: '🍎🍌🍎🍌❓', options: [{ e: '🍎' }, { e: '🍌' }], a: 0 },
            { q: { zh: '下一个是什么？', en: 'What comes next?' }, show: '🔴🔵🔴🔵❓', options: [{ e: '🔴' }, { e: '🔵' }], a: 0 },
            { q: { zh: '下一个是什么？', en: 'What comes next?' }, show: '🐶🐱🐶🐱❓', options: [{ e: '🐶' }, { e: '🐱' }], a: 0 },
            { q: { zh: '下一个是什么？', en: 'What comes next?' }, show: '☀️🌙☀️🌙❓', options: [{ e: '☀️' }, { e: '🌙' }], a: 0 },
            { q: { zh: '下一个是什么？', en: 'What comes next?' }, show: '🚗🚗🚌🚗🚗❓', options: [{ e: '🚌' }, { e: '🚗' }], a: 0 },
            { q: { zh: '下一个是什么？', en: 'What comes next?' }, show: '⭐❤️⭐❤️❓', options: [{ e: '⭐' }, { e: '❤️' }], a: 0 },
          ] },
          { id: 'odd', e: '🧐', zh: '哪个不一样', en: 'Odd One Out', type: 'choose', rounds: [
            ['🐶', '🐱'], ['🍎', '🚗'], ['🐟', '🐦'], ['🔴', '🔵'], ['⭐', '🍌'], ['🐥', '🐘'],
          ].map(([same, diff]) => ({
            q: { zh: '哪个不一样？', en: 'Which one is different?' },
            options: [{ e: diff }, { e: same }, { e: same }], a: 0,
          })) },
          { id: 'sort-food', e: '🧺', zh: '分一分', en: 'Sort It', type: 'sort',
            q: { zh: '{x}放到哪边？', en: 'Where does the {x} go?' },
            bins: [{ e: '🐾', zh: '动物', en: 'animals' }, { e: '🍽️', zh: '吃的', en: 'food' }],
            items: [
              { e: '🐶', zh: '小狗', en: 'dog', b: 0 }, { e: '🐱', zh: '小猫', en: 'cat', b: 0 },
              { e: '🐷', zh: '小猪', en: 'pig', b: 0 }, { e: '🐰', zh: '小兔', en: 'rabbit', b: 0 },
              { e: '🍎', zh: '苹果', en: 'apple', b: 1 }, { e: '🍌', zh: '香蕉', en: 'banana', b: 1 },
              { e: '🍞', zh: '面包', en: 'bread', b: 1 }, { e: '🥕', zh: '胡萝卜', en: 'carrot', b: 1 },
            ] },
          { id: 'sort-color', e: '🎨', zh: '红色蓝色', en: 'Red or Blue', type: 'sort',
            q: { zh: '{x}放到哪边？', en: 'Where does the {x} go?' },
            bins: [{ e: '🔴', zh: '红色', en: 'red' }, { e: '🔵', zh: '蓝色', en: 'blue' }],
            items: [
              { e: '🍎', zh: '苹果', en: 'apple', b: 0 }, { e: '🍓', zh: '草莓', en: 'strawberry', b: 0 },
              { e: '🚒', zh: '消防车', en: 'fire truck', b: 0 }, { e: '🍒', zh: '樱桃', en: 'cherries', b: 0 },
              { e: '🐳', zh: '鲸鱼', en: 'whale', b: 1 }, { e: '💧', zh: '水滴', en: 'water drop', b: 1 },
              { e: '🫐', zh: '蓝莓', en: 'blueberries', b: 1 }, { e: '👖', zh: '牛仔裤', en: 'jeans', b: 1 },
            ] },
          { id: 'handwash', e: '🧼', zh: '洗小手', en: 'Wash Hands', type: 'story', pages: [
            P('🚰💧', '第一步，打开水龙头，打湿小手。', 'Step one: wet your hands.'),
            P('🧼', '第二步，擦上香香的肥皂。', 'Step two: add some soap.'),
            P('👐🫧', '第三步，搓搓手心，搓搓手背。', 'Step three: rub, rub, rub!'),
            P('💦', '第四步，冲冲干净。', 'Step four: rinse with water.'),
            P('🧻', '第五步，擦干小手。', 'Step five: dry your hands.'),
            P('✨👐', '小手干干净净啦！', 'Clean hands! Hooray!'),
          ] },
          { id: 'teeth', e: '🪥', zh: '刷牙牙', en: 'Brush Teeth', type: 'story', pages: [
            P('🪥', '挤一点点牙膏，像小豆豆那么大。', 'Put a tiny bit of toothpaste on the brush.'),
            P('🦷⬆️⬇️', '上面刷一刷，下面刷一刷。', 'Brush the top, brush the bottom.'),
            P('🦷🔄', '里面刷一刷，外面刷一刷。', 'Brush inside and outside.'),
            P('💦', '漱漱口，咕噜咕噜，吐出来。', 'Rinse and spit!'),
            P('😁✨', '牙齿白白亮亮的！', 'Shiny white teeth!'),
          ] },
          { id: 'safety', e: '🛡️', zh: '安全小卫士', en: 'Stay Safe', type: 'choose', n: 2, rounds: [
            { q: { zh: '摸火，可以吗？', en: 'Touch fire. Is it OK?' }, show: '🔥✋', options: [NO, OK], a: 0, ok: { zh: '火很烫，不能摸！', en: 'Fire is hot. Do not touch!' } },
            { q: { zh: '牵着大人的手过马路，可以吗？', en: 'Hold a grown-up\'s hand to cross the road. Is it OK?' }, show: '🚦🤝', options: [OK, NO], a: 0, ok: { zh: '对，过马路要牵手！', en: 'Yes, always hold hands!' } },
            { q: { zh: '用手指摸插座，可以吗？', en: 'Touch the power socket. Is it OK?' }, show: '🔌👆', options: [NO, OK], a: 0, ok: { zh: '插座有电，很危险！', en: 'Sockets are dangerous!' } },
            { q: { zh: '饭前洗手，可以吗？', en: 'Wash hands before eating. Is it OK?' }, show: '🧼👐', options: [OK, NO], a: 0, ok: { zh: '真是好习惯！', en: 'Good habit!' } },
            { q: { zh: '跟不认识的人走，可以吗？', en: 'Go with a stranger. Is it OK?' }, show: '🧑‍🦱🍬', options: [NO, OK], a: 0, ok: { zh: '不跟陌生人走，要找爸爸妈妈！', en: 'Never go with strangers. Find mommy or daddy!' } },
            { q: { zh: '坐车系好安全带，可以吗？', en: 'Buckle up in the car. Is it OK?' }, show: '🚗💺', options: [OK, NO], a: 0, ok: { zh: '安全第一！', en: 'Safety first!' } },
          ] },
          { id: 'meet-ai', e: '🤖', zh: '认识 AI 朋友', en: 'Meet AI', type: 'story', pages: [
            P('🤖', '这是机器人，它是人们做出来的。', 'This is a robot. People made it.'),
            P('🤖🧹', '机器人可以帮我们扫地，搬东西。', 'Robots can help us clean and carry things.'),
            P('📱🗣️', '有的电脑会听我们说话，还会回答问题，它叫 AI。', 'Some computers can listen and answer questions. We call it AI.'),
            P('🤖📚', 'AI 会学习，就像你一样，学得越多，懂得越多。', 'AI can learn, just like you!'),
            P('🙋❓', '有不懂的事，就问一问"为什么"！', 'When you want to know something, ask "Why?"'),
            P('👨‍👩‍👧🤖', '和爸爸妈妈一起，问问 AI 吧！', 'Ask AI together with mommy or daddy!'),
            P('🧒💖', '最厉害的，还是你爱思考的小脑袋！', 'And the most amazing thing is your thinking brain!'),
          ] },
        ],
      },
    ],
  };
})();
