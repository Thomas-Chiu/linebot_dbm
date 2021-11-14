// 修正 UTC+8
const date = new Date(+new Date() + 8 * 3600 * 1000);
const getDate = () => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // console.log(date);
  return `${year}-${month}-${day}`;
};

module.exports = {
  getDate,
};
