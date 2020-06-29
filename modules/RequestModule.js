import {NativeModules} from 'react-native';

const RequestModule = NativeModules.RequestModule;

/**
 * HTTP methods used by `request()`.
 */
export const METHOD = {
  GET: 0,
  POST: 1,
  PUT: 2,
  DELETE: 3,
  HEAD: 4,
  OPTIONS: 5,
  TRACE: 6,
  PATCH: 7
}

/**
 * Clear all cookies created by calling request.
 * @return Promise<boolean>
 */
export const clearCookies = RequestModule.clearCookies;

const requestModule = RequestModule.request;

/**
 * Make an http request.
 * Equivalent to
 * `fetch(url, {method, body, credentials='include'})`
 *
 * Notes: React native has trouble to store cookies by fetch,
 * this is why the method is created.
 *
 * @param {string} url Request URL
 * @param {RNRequestOptions} options
 * @return Promise<RNResponse>
 */
export async function request(url, options = {}) {
  let {method = METHOD.GET, body = null, qs, headers, json} = options;
  if (qs) {
    qs = Object.entries(qs).map(([key, val]) => `${key}=${val}`).join("&");
    url = `${url}?${qs}`;
  }
  const response = await requestModule(url, method, body);

  // make it like a fetch API
  response.json = async () => JSON.parse(response.body)
  response.text = async () => response.body;

  if (json)
    return JSON.parse(response.body);
  return response;
}
