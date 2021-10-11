const getDate = require("./getDate.js");
let resultArr = [];

const controller = async (action, data) => {
  /* https://docs.google.com/spreadsheets/d/<docID>/edit#gid=<sheetID> */
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  const creds = require("../credential.json");
  const doc = new GoogleSpreadsheet(
    "1oDl5zEGq_MWOP203AgfBQsBSTd4TrFU_yyhn2-PsnQM"
  );

  // 載入文件
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  await doc.updateProperties({ title: "linebot_dbm" });

  // 載入工作表
  const sheet = await doc.sheetsByIndex[0];

  /* 載入資料列
   getRows() 可傳入參數 { limit, offset } */
  const rows = await sheet.getRows();

  // CRUD
  if (action === "read") {
    resultArr = [];
    for (let item of rows) {
      item.note === undefined ? (item.note = "") : (item.note = item.note);
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
    data["date"] = getDate.getDate();
    await sheet.addRow(data);
  }
};

const result = () => {
  return resultArr;
};

module.exports = {
  controller,
  result,
};
