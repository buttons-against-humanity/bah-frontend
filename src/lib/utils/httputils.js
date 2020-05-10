import settings from '../settings';
import ApiError from '../apierror';

export function getData(path) {
  return sendData(path, undefined, undefined, 'GET');
}

export function postData(path, data, contentType = 'application/json; charset=UTF-8') {
  return sendData(path, data, contentType, 'POST');
}

export function putData(path, data, contentType = 'application/json; charset=UTF-8') {
  return sendData(path, data, contentType, 'PUT');
}

export function deleteData(path, data, contentType = 'application/json; charset=UTF-8') {
  return sendData(path, data, contentType, 'DELETE');
}

async function _parseJsonBody(contentType, response) {
  if (!contentType) return false;
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return false;
}

async function sendData(path, data, contentType, method) {
  const headers = {
    Accept: 'application/vdn.cn.buttonsagainsthumanity.com-v1+json',
    'X-BAH': settings.appName + '/' + settings.version
  };
  /*
  const token = getBearerToken();
  if (token) {
    headers.authorization = 'Bearer ' + token;
  }
  */
  let body;
  if (data) {
    headers['Content-Type'] = contentType;
    if (typeof data !== 'string') {
      body = JSON.stringify(data);
    } else {
      body = data;
    }
  }
  try {
    const response = await fetch(path, {
      credentials: 'include',
      method,
      headers,
      body
    });
    const resContentLength = response.headers.get('content-length');
    const retContentType = response.headers.get('content-type');
    if (response.status >= 500) {
      // Server's fault.. just raise the error
      if (resContentLength > 0) {
        const json = await _parseJsonBody(retContentType, response);
        if (json === false) {
          // generic error
          throw new ApiError(response.status, response.message);
        }
        throw new ApiError(json.reason, response.status);
      }
      throw new ApiError(response.status, response.message);
    }
    if (response.status >= 400) {
      // Our fault..
      // Session expired?
      if (response.status === 401) {
        // Force logout..
        return;
      }
      if (resContentLength > 0) {
        const json = await _parseJsonBody(retContentType, response);
        if (json === false) {
          // generic error
          throw new ApiError(response.status, response.message);
        }
        throw new ApiError(json.reason, response.status);
      }
      throw new ApiError(response.status, response.message);
    }
    const json = await _parseJsonBody(retContentType, response);
    if (json === false) {
      return response.text();
    }
    return json;
  } catch (ex) {
    // Low level error: timeouts
    throw ex;
  }
}
