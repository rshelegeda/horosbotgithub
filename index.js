const express = require('express');
const app = express();
const port = 8080;

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, collectionGroup } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAVou9ObOaVQyIgJi4k0gpL1BKyhXXNttQ",
  authDomain: "for-goros-bot.firebaseapp.com",
  projectId: "for-goros-bot",
  storageBucket: "for-goros-bot.appspot.com",
  messagingSenderId: "428623907815",
  appId: "1:428623907815:web:394903f1fda0a5f8838b42"
};
const fbapp = initializeApp(firebaseConfig);
const db = getFirestore(fbapp);


const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const horos = require('./horoscope');
const cards = require('./cards');


var days = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота'
];

app.get('/horos', (req, res) => {
  res.send(horos);
});

app.get('/taro', (req, res) => {
  res.send(cards);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// function markdownEscape(text) {
//   return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, (match) => `\\${match}`);
// };


// const markup = Markup.inlineKeyboard({ text: "ОВЕН", callback_data: "oven" }, { text: "ТЕЛЕЦ", callback_data: "telec" }, { text: "БЛИЗНЕЦЫ", callback_data: "blizneci" }, { text: "РАК", callback_data: "rak" })
const bot = new Telegraf(process.env.BOT_TOKEN) //сюда помещается токен, который дал botFather

// Подсчет и вывод времени потраченного на обработку
// bot.use((ctx, next) => {
//   const start = new Date()
//   return next().then(() => {
//     const ms = new Date() - start
//     console.log('response time %sms', ms)
//   })
// });


// START
bot.start(async (ctx) => {
  // console.log("________ ANSWER: " + await getUser(ctx));  
  const user = '';
  const firstName = ctx.from.first_name || " ";
  const lastName = ctx.from.last_name || " ";
  const username = ctx.from.username || " ";
  const userId = ctx.from.id || " ";
  const language = ctx.from.language_code || " ";
  const date = new Date();

  // console.log(ctx.from);

  try {
    const textDate = date.getHours() + ':' + date.getMinutes() + '  ' + date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
    // const textUser = firstName + " " + lastName + " " + username + " " + userId + " " + language;
    if (textDate && userId) {
      const user = {        
        firstName: firstName,
        lastName: lastName,
        username: username,
        id: userId,
        language: language,
        isChecked: process.env.FIREBASE_CHECK,
        date: textDate
      };
      const tmpId = Math.random().toString(36).substring(4);
      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef, tmpId), user);
    }


    // await setDoc(doc(usersRef, "users"), {
    //   name: username,      
    //   date: Date.now
    // });
  } catch (error) {
    console.log(error);
  }

  try {
    // const escapedUsername = markdownEscape(username);
  let hello = 'Здравствуйте'
  if (firstName) {
    hello = 'Здравствуйте, ' + firstName;
  };

  await ctx.replyWithPhoto(
    { url: process.env.BOT_LOGO },
    {
      caption: hello + '. Я готова предоставить Вам гороскоп и другие предсказания.',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('ГОРОСКОП НА СЕГОДНЯ', 'goro')],
        [Markup.button.callback('ГАДАНИЕ НА КАРТАХ ТАРО', 'taro')]
      ])
    }
  )
  } catch (error) {
    console.log(error);
  }  
});


// IF GOROSCOP
bot.action('goro', async (ctx) => {
  // console.log(ctx.update.callback_query.data);
  await ctx.replyWithPhoto(
    { url: process.env.BOT_LOGO },
    {
      caption: 'Выберите Ваш знак Зодиака.',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('ОВЕН', 'oven'), Markup.button.callback('ТЕЛЕЦ', 'telec'), Markup.button.callback('БЛИЗНЕЦЫ', 'blizneci')],
        [Markup.button.callback('РАК', 'rak'), Markup.button.callback('ЛЕВ', 'lev'), Markup.button.callback('ДЕВА', 'deva')],
        [Markup.button.callback('ВЕСЫ', 'vesi'), Markup.button.callback('СКОРПИОН', 'scorpion'), Markup.button.callback('СТРЕЛЕЦ', 'strelec')],
        [Markup.button.callback('КОЗЕРОГ', 'kozerog'), Markup.button.callback('ВОДОЛЕЙ', 'vodoley'), Markup.button.callback('РЫБЫ', 'ribi')],
        [Markup.button.callback('ЗАКОНЧИТЬ', 'end')]
      ])
    }
  )
});


// IF TARO
bot.action('taro', async (ctx) => {
  // console.log(ctx.update.callback_query.data);   
  await ctx.replyWithPhoto(
    { url: process.env.BOT_LOGO },
    {
      caption: 'В колоде 78 карт... Опишите словами или мысленно свой вопрос или проблему... Выберите три карты.',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('ВЫБРАТЬ КАРТЫ', 'select')],
        [Markup.button.callback('ЗАКОНЧИТЬ', 'end')]
      ])
    }
  )
});


// SHOW CARDS
bot.action('select', async (ctx) => {
  // console.log(ctx.update.callback_query.data);
  // console.log('SELECT');
  let numbs = [];
  let isReady = false;

  try {
    while (isReady === false) {
      let numb = Math.floor(Math.random() * 77) + 1;
      // console.log(numb);
      if (!numbs.includes(numb)) numbs.push(numb);
      if (numbs.length === 3) {
        isReady = true;
        // console.log(numbs);
      };
    };
    // console.log(cards[numbs[0]]);

    await ctx.replyWithPhoto(
      { url: cards[numbs[0]].image } ,
      {
        caption: `${cards[numbs[0]].arkana}\n${cards[numbs[0]].name}\n\n${'Краткое толкование карты:'}\n\n${cards[numbs[0]].discr.general}\n\n${cards[numbs[0]].discr.health}\n\n${cards[numbs[0]].discr.success}\n\n${cards[numbs[0]].discr.finances}\n\n${cards[numbs[0]].discr.love}\n\n`,
        parse_mode: 'Markdown'        
      }
    );

    await ctx.replyWithPhoto(
      { url: cards[numbs[1]].image } ,
      {
        caption: `${cards[numbs[1]].arkana}\n${cards[numbs[1]].name}\n\n${'Краткое толкование карты:'}\n\n${cards[numbs[1]].discr.general}\\nn${cards[numbs[1]].discr.health}\n\n${cards[numbs[1]].discr.success}\n\n${cards[numbs[1]].discr.finances}\n${cards[numbs[1]].discr.love}\n\n`,
        parse_mode: 'Markdown'
      }
    );

    await ctx.replyWithPhoto(
      { url: cards[numbs[2]].image } ,
      {
        caption: `${cards[numbs[2]].arkana}\n${cards[numbs[2]].name}\n\n${'Краткое толкование карты:'}\n\n${cards[numbs[2]].discr.general}\n\n${cards[numbs[2]].discr.health}\n\n${cards[numbs[2]].discr.success}\n\n${cards[numbs[2]].discr.finances}\n\n${cards[numbs[2]].discr.love}\n\n`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('ЗАКОНЧИТЬ', 'end')]
        ])
      }
    );


  } catch (error) {
    console.log(error);
  };
});


// IF END
bot.action('end', async (ctx) => {
  const firstName = ctx.from.first_name;
  const lastName = ctx.from.last_name;
  const username = ctx.from.username;
  // const escapedUsername = markdownEscape(username);

  let hello = 'Здравствуйте'
  if (firstName) {
    hello = 'Здравствуйте, ' + firstName;
  }; 

  ctx.replyWithPhoto(
    { url: process.env.BOT_LOGO },
    {
      caption: hello + '. Я готова предоставить Вам гороскоп и другие предсказания.',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('ГОРОСКОП НА СЕГОДНЯ', 'goro')],
        [Markup.button.callback('ГАДАНИЕ НА КАРТАХ ТАРО', 'taro')]
      ])
    }
  )
});


// SHOW HOROSCOPE
// Общая функция для обработки действия по знаку зодиака
const handleZodiacSign = async (ctx, zodiacSign) => {
  try {
    const firstName = ctx.from.first_name;
    const date = new Date();
    // console.log(date.getHours());
    const array = horos.find(obj => obj.date === date.getDate());
    const arrayGoros = array.goros;
    const signData = arrayGoros.find(obj => obj.id === zodiacSign);

    // const signData = signs.find(obj => obj.goros.id === zodiacSign);
    // const signData = horos.find(obj => obj.id === zodiacSign);
    // console.log(signData);
    var month = new Date().getMonth() + 1;

    if (signData) {
      ctx.replyWithPhoto(
        { url: process.env.BOT_LOGO },
        {
          caption: ' Вот гороскоп на ' + days[date.getDay()] + ' ' + date.getDate() + '.' + month + '.' + date.getFullYear()  +  ' для знака ' + signData.name + '.\n' + 
          `\n${' ' + signData.prediction.love + ' ' + signData.prediction.finance + ' ' + signData.prediction.health + ' ' + signData.prediction.world}`,
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('ЗАКОНЧИТЬ', 'end')]
          ])
        }
      )

      // await ctx.reply(`${signData.name}\n${days[date.getDay()] + ' '}${date.getDate()}${'.'}${date.getMonth()}${'.'}${date.getFullYear()}\n\n${signData.prediction.love + ' ' + signData.prediction.finance + ' ' + signData.prediction.health + ' ' + signData.prediction.world}`);
    } else {
      ctx.replyWithPhoto(
        { url: process.env.BOT_LOGO },
        {
          caption: 'Информация о знаке зодиака не найдена.',          
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('ЗАКОНЧИТЬ', 'end')]
          ])
        }
      )
    }
  } catch (error) {
    console.log(error);
  }
  // console.log(ctx.update.callback_query.data);

};

// Регистрация обработчиков для каждого знака зодиака
const zodiacSigns = ['oven', 'telec', 'blizneci', 'rak', 'lev', 'deva', 'vesi', 'scorpion', 'strelec', 'kozerog', 'vodoley', 'ribi'];

zodiacSigns.forEach(sign => {
  bot.action(sign, async (ctx) => {
    await handleZodiacSign(ctx, sign);
  });
});

bot.on(message('text'), (ctx) => ctx.reply('Воспользуйтесь кнопками, пожалуйста'));


bot.launch(); // запуск бота

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));




