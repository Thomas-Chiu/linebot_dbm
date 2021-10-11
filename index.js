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
  let textArr = text.split(" ");
  let order = {
    name: "",
    item: "",
    price: "",
    note: "",
  };
  // event.reply 為回覆訊息
  if (textArr.length >= 3) {
    // 檢查有無備註
    let tempNote;
    textArr[3].includes("(") || textArr[3].includes(")")
      ? (tempNote = textArr[3])
      : (tempNote = "");

    order.name = textArr[0];
    order.item = textArr[1];
    order.price = textArr[2];
    order.note = tempNote;
    init.controller("add", order);
    event.reply(`點餐成功\n${textArr.join(", ")}`);
  } else {
    event.reply(`點餐請用空格分開喔 😋\n王小明 雞腿飯 80 (飯少)`);
  }
});

bot.listen("/", process.env.PORT, () => {
  console.log("網頁伺服器 3000 on");
});
