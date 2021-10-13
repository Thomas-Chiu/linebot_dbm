const getDate = require("./getDate.js");
const today = getDate.getDate();
let resultArr = [];

const controller = async (action, data) => {
  /* https://docs.google.com/spreadsheets/d/<docID>/edit#gid=<sheetID> */
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  const creds = require("../creds.json");
  const doc = new GoogleSpreadsheet(
    "1oDl5zEGq_MWOP203AgfBQsBSTd4TrFU_yyhn2-PsnQM"
  );

  // 載入文件
  await doc.useServiceAccountAuth(creds);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  await doc.loadInfo();
  await doc.updateProperties({ title: "linebot_dbm" });

  // 載入工作表
  let sheet = await doc.sheetsByIndex[0];
  /* 載入資料列
   getRows() 可傳入參數 { limit, offset } */
  let rows = await sheet.getRows();

  // CRUD
  if (action === "read") {
    resultArr = [];
    for (let item of rows) {
      // 讀取當天資料
      if (item.date !== today) continue;
      if (item.note === undefined) item.note = "";
      resultArr.push({
        date: item.date,
        name: item.name,
        item: item.item,
        price: item.price,
        note: item.note,
        rawData: item._rawData,
      });
    }
  }
  if (action === "add") {
    data["date"] = today;
    await sheet.addRow(data);
  }
  if (action === "delete") {
    // 刪除工作表
    await doc.addSheet({
      headerValues: ["date", "name", "item", "price", "note"],
    });
    await sheet.delete();
  }
};

const result = () => {
  return resultArr;
};

module.exports = {
  controller,
  result,
};
