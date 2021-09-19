import linebot from "linebot";
import dotenv from "dotenv";

dotenv.config();

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

// 當收到訊息時，event 包含了訊息的類型、文字等
bot.on("message", (event) => {
  // event.message.text 為使用者傳送的文字
  let text = event.message.text;
  if (text.split().indexOf(text) !== -1) event.reply(event.message.text);
  // event.reply 為回覆訊息
});

bot.listen("/", process.env.PORT, () => {
  console.log("網頁伺服器 3000 on");
});
