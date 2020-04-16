export const copyToClipboard = (str, next) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  next && next(true);
};

export const handleOnKeyDown = (e, f) => {
  if (e.key === 'Enter') {
    f();
  }
};

export const getReadableFileSizeString = function(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

export const getPlayersNumber = (rounds, questions, answers) => {
  const playersByQuestions = questions / rounds;
  const playersByAnswers = answers / (9 + rounds); // actually answers / (10 + rounds - 1)
  const players = Math.max(playersByAnswers, playersByQuestions);
  return Math.floor(players);
};
