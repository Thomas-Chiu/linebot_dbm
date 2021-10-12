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
bot.on("message", async (event) => {
  // event.message.text 為使用者傳送的文字
  let text = event.message.text;
  let textArr = text.split(" ");
  let order = { name: "", item: "", price: "", note: "" };
  let message = "";

  // 點餐 --------------------------------------------------
  if (textArr.length >= 3) {
    let tempNote;
    // 檢查有無備註
    text.includes("(") || text.includes(")")
      ? (tempNote = true)
      : (tempNote = "");
    tempNote && textArr.length > 3 ? (tempNote = textArr[3]) : (tempNote = "");
    tempNote !== ""
      ? (message = `點餐成功\n${textArr.join(", ")}`)
      : (message = `點餐成功\n${textArr[0]}, ${textArr[1]}, ${textArr[2]}`);

    order.name = textArr[0];
    order.item = textArr[1];
    order.price = textArr[2];
    order.note = tempNote;

    await init.controller("add", order);
    await event.reply(message);
  }

  // 結單 -------------------------------------------------
  if (text.includes("結單")) {
    let count = 0;
    let result = [];
    // await 處理非同步問題
    await init.controller("read");
    result = await init.result();

    for (let item of result) {
      count++;
      message += `${count}. ${item.name}: ${item.item} $${item.price} ${item.note} \n`;
    }
    await event.reply(`${result[0].date}\n\n${message}\n以上結單 🍱`);
  }

  // 棄單 -------------------------------------------------
  if (text.includes("棄單")) {
    message = `棄單成功，請重新點餐 👍`;
    await init.controller("delete");
    await event.reply(message);
  } else {
    message = `點餐請用空格分開喔 😋\n王小明 雞腿飯 80 (飯少)`;
    event.reply(message);
  }
});

bot.listen("/", process.env.PORT, () => {
  console.log("網頁伺服器 3000 on");
});
