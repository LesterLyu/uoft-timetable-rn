const {DOMParser} = require('react-native-html-parser');

/**
 * An Error usually represents username or password error.
 */
class LoginError extends Error {
  constructor(...args) {
    super(...args);
  }
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';

module.exports = {
  LoginError,
  userAgent,
  /**
   * Extract all form data from an html document.
   * @param {string} body - An html document
   * @return {{data: {}, action: string}}
   */
  getFormData: body => {
    const root = new DOMParser().parseFromString(body, 'text/html');
    const inputs = root.querySelect('form input');
    const data = {};
    inputs.forEach(input => {
      data[input.getAttribute('name')] = input.getAttribute('value');
    });
    const action = root.querySelect('form')[0].getAttribute('action');
    return {data, action};
  },

  /**
   *
   * @param body
   * @returns {{'data-host', 'data-sig-request', 'data-post-action'}}
   */
  getIframeData: body => {
    const root = new DOMParser().parseFromString(body, 'text/html');
    const iframe = root.querySelect('iframe')[0];
    const required = ['data-host', 'data-sig-request', 'data-post-action'];
    const result = {};
    for (const item of required)
      result[item] = iframe.getAttribute(item);
    return result;
  },

  parseIframePostResult: body => {
    const root = new DOMParser().parseFromString(body, 'text/html');
    const inputs = root.querySelect('input');
    const data = {};
    inputs.forEach(input => {
      data[input.getAttribute('name')] = input.getAttribute('value');
    });
    return data;
  },

  /**
   * Generate the URL that goes to the Duo Prompt.
   * Note: From 3rd party Duo-Web-v2.js
   */
  generateIframeSrc: (host, duoSig, currHref) => {
    return [
      'https://', host, '/frame/web/v1/auth?tx=', duoSig,
      '&parent=', encodeURIComponent(currHref),
      '&v=2.3'
    ].join('');
  },

  /**
   * Parse login error on the login page.
   * i.e. https://idpz.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO?execution=e1s1
   * @param {string} body - An html document
   * @return {LoginError} An Error
   */
  parseAcornLoginError: body => {
    const root = parse(body);
    const p = root.querySelector('p.form-error');
    return new LoginError(p.innerHTML);
  },
};
