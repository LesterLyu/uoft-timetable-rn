import { NativeModules } from 'react-native';

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
 * @param url {string} Request URL
 * @param {int} [method=0] HTTP Method, default to GET
 * @param {{}} [body] Request Body, this can only be a one-level object
 * @return Promise<RNResponse>
 */
export async function request(url, method, body) {
  if (arguments.length === 1) {
    return await requestModule(url, METHOD.GET, null);
  } else if (arguments.length === 2) {
    return await requestModule(url, method, null);
  } else {
    return await requestModule(...arguments);
  }
}
