const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./credential.json");

/*
Sheet 的 docID 和 sheetID 請參照以下網址規則：
https://docs.google.com/spreadsheets/d/<docID>/edit#gid=<sheetID>
*/

const getData = async () => {
  const doc = new GoogleSpreadsheet(
    "1oDl5zEGq_MWOP203AgfBQsBSTd4TrFU_yyhn2-PsnQM"
  );
  await doc.useServiceAccountAuth(creds);

  // loads document properties and worksheets
  await doc.loadInfo();
  console.log(doc.title);

  // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const sheet = doc.sheetsByIndex[0];
  console.log(sheet.title);
  console.log(sheet.rowCount);

  // can pass in { limit, offset
  const rows = await sheet.getRows();
  console.log(rows);

  // append rows
  const larryRow = await sheet.addRow({
    日期: 456,
    姓名: "Thomas",
    品項: "雞腿飯",
    金額: 80,
    備註: "",
  });
};

module.exports = {
  getData,
};
