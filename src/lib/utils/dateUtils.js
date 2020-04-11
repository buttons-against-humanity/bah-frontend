export const getHumanTime = function(time) {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 0 ? `${hours} h` : ''} ${minutes > 0 ? `${minutes}'` : ''}`;
};

export const getURLDate = function(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};
