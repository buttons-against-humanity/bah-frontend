import settings from '../settings';

export function getConfirmation(message) {
  return new Promise((resolve, reject) => {
    const ret = window.confirm(message);
    if (ret) {
      resolve(ret);
    } else {
      reject(new Error('Reject'));
    }
  });
}

export function setTitle(title) {
  document.title = `${title} - ${settings.appDescription}/${settings.version}`;
}
