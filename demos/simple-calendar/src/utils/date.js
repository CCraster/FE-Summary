export const formatDate = (date) => {
  return date.valueOf();
};

export const getDateCHN = (dateValue) => {
  let date = new Date(dateValue);
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
};
