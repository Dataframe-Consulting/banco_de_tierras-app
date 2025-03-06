const formatdateTime = (date: string) => {
  const auxDate = new Date(date);
  const timeNow = new Date();
  auxDate.setHours(
    timeNow.getHours(),
    timeNow.getMinutes(),
    timeNow.getSeconds(),
    timeNow.getMilliseconds()
  );
  return auxDate;
};

export default formatdateTime;
