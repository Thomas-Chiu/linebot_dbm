const linebot = require("linebot");
const dotenv = require("dotenv");
const init = require("./model/init.js");

dotenv.config();

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

// event 包含了收到訊息時的類型、文字等
bot.on("message", (event) => {
  // event.message.text 為使用者傳送的文字
  let text = event.message.text;
  let 
  // event.reply 為回覆訊息
  if (text.split().indexOf("$nbsp") === -1) {
    event.reply(`請按以下格式填寫喔 😋\n王小明 雞腿飯 80 (飯少)`);
    return;
  }

  console.log(text.split(" "));
  // init.controller("add");
});

bot.listen("/", process.env.PORT, () => {
  console.log("網頁伺服器 3000 on");
});
