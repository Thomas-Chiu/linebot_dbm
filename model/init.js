const getDate = require("./getDate.js");

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
  // 載入工作表
  const sheet = await doc.sheetsByIndex[0];
  // CRUD
  if (action === "read") {
    console.log(await sheet.getRows());
  }
  if (action === "add") {
    await doc.updateProperties({ title: getDate.getDate() });
    await sheet.addRow({
      日期: getDate.getDate(),
      姓名: data.name,
      品項: data.item,
      金額: data.price,
      備註: data.note,
    });
  }
};

// getRows() 可傳入參數 { limit, offset }
// const rows = await sheet.getRows();
// console.log(rows);

module.exports = {
  controller,
};
