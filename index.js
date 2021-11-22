const linebot = require("linebot");
const dotenv = require("dotenv");
const init = require("./model/init.js");
dotenv.config();
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});
let turnOn = false;

// event 包含了收到訊息時的類型、文字等
bot.on("message", async (event) => {
  let text = event.message.text;
  let textArr = text.split(" ");
  let order = { name: "", item: "", price: "", note: "" };
  let message = "";
  let oneSpace = true;

  textArr.forEach(async (value, index, array) => {
    if (value === "" || isNaN(array[2]) || array.length > 4) oneSpace = false;
  });

  if (text.includes("訂便當") || text.includes("定便當")) {
    turnOn = true;
    message = `啟動訂便當小幫手 👋\n\n點餐請用空格分開\n金額不用加 $ 字號\n備註請打在 () 裡面\n如：王小明 雞腿飯 80 (飯少)`;
    await event.reply(message);
  }
  // console.log(`turnOn: ${turnOn}`);

  // 未啟動 or 不訂餐
  if (turnOn !== true || text.includes("不訂") || text.includes("不定")) return;

  // 點餐 --------------------------------------------------
  if (textArr.length >= 3) {
    let tempNote;
    // 檢查空格 or 金額 or 長度
    if (!oneSpace) {
      message = `格式有誤 🧐 點餐只需用一格空格分開`;
      await event.reply(message);
      return;
    }
    // 檢查有無備註，修正全形括號
    text.includes("(") ||
    text.includes(")") ||
    text.includes("（") ||
    text.includes("）")
      ? (tempNote = true)
      : (tempNote = "");
    tempNote && textArr.length > 3 ? (tempNote = textArr[3]) : (tempNote = "");
    tempNote !== ""
      ? (message = `點餐成功 👌\n${textArr.join(", ")}`)
      : (message = `點餐成功 👌\n${textArr[0]}, ${textArr[1]}, ${textArr[2]}`);
    // 整理全形括號
    if (tempNote.includes("（") || tempNote.includes("）")) {
      let tempNoteRearrange = tempNote.split("");
      tempNoteRearrange.shift();
      tempNoteRearrange.pop();
      tempNote = `(${tempNoteRearrange.join("")})`;
      message = `點餐成功 👌\n${textArr[0]}, ${textArr[1]}, ${textArr[2]}, ${tempNote}`;
    }

    order.name = textArr[0];
    order.item = textArr[1];
    order.price = textArr[2];
    order.note = tempNote;
    // console.log(order);

    await init.controller("add", order);
    await event.reply(message);
  }

  // 結單 -------------------------------------------------
  if (text.includes("結單")) {
    let count = 0;
    let totalPrice = 0;
    let result = [];
    // await 處理非同步問題
    await init.controller("read");
    result = await init.result();

    for (let item of result) {
      count++;
      totalPrice += parseInt(item.price);
      message += `${count}. ${item.name}: ${item.item} $${item.price} ${item.note} \n`;
    }

    result.length !== 0
      ? (message = `${result[0].date}\n\n${message}\n以上結單 🍱 共 ${totalPrice} 元\n輸入「訂便當」重新啟動小幫手`)
      : (message = `今天還沒有任何點餐 😮`);
    await event.reply(message);
    turnOn = false;
  }

  // 棄單 -------------------------------------------------
  if (text.includes("棄單")) {
    message = `已刪除今日訂單 👍\n輸入「訂便當」重新啟動小幫手`;
    await init.controller("delete");
    await event.reply(message);
    turnOn = false;
  }

  message = `點餐請用空格分開 😋\n金額不用加 $ 字號\n備註請打在 () 裡面\n如：王小明 雞腿飯 80 (飯少)`;
  await event.reply(message);
});

bot.listen("/", process.env.PORT, () => {
  console.log("網頁伺服器 3000 on");
});
