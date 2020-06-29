const {getFormData, getIframeData, generateIframeSrc, parseIframePostResult, LoginError, userAgent} = require('./utils');
const {CourseAPI} = require('./api');

import {request, clearCookies, METHOD} from '../modules/RequestModule'

/**
 * Represents Acorn.
 */
class Acorn {

    /**
     * @param {string} username - Acorn username
     * @param {string} password - Acorn password
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
        // store cookie across all requests.
        /**
         * @type {Registration[]}
         */
        this.registrations = null;

        /**
         * @type {CourseAPI}
         */
        this.course = new CourseAPI(this);
    }

    /**
     * Log in to Acorn, this is an async function, remember to catch exceptions.
     * @return {Promise<Acorn>} Acorn instance
     * @throws {LoginError|Error} LoginError instance or error thrown from request-promise or unknown error
     */
    async login() {
        await clearCookies();
        let url = 'https://acorn.utoronto.ca/sws';
        let response, body, data, action;

        // first step
        response = await request(url, METHOD.GET, null)

        let form = getFormData(response.body);
        data = form.data;
        url = `https://idpz.utorauth.utoronto.ca${form.action}`;

        data.j_username = this.username;
        data.j_password = this.password;
        data._eventId_proceed = '';
        data['$csrfToken.getParameterName()'] = '$csrfToken.getToken()';

        // second step
        response = await request(url, METHOD.POST, data);
        body = response.body;

        if (!body.includes('iframe')) {
            throw new LoginError('Username or password incorrect.');
        }
        const iframeData = getIframeData(body);
        url = 'https://idpz.utorauth.utoronto.ca' + iframeData['data-post-action'];

        const appPart = iframeData['data-sig-request'].split(':')[1];
        url = generateIframeSrc(iframeData['data-host'], iframeData['data-sig-request'].split(':')[0], url);

        // third step (iframe, Duo Security - Two-Factor Authentication)
        response = await request(url, METHOD.GET, null);


        form = getFormData(response.body);
        data = form.data;
        action = form.action;

        // override with real values from a browser
        data.color_depth = 24;
        data.screen_resolution_width = 1920;
        data.screen_resolution_height = 1080;
        data.is_cef_browser = false;
        data.is_ipad_os = false;
        data.referer = data.parent;

        // forth step (post to duo security)
        response = await request(url, METHOD.POST, data);


        data = parseIframePostResult(response.body);
        url = data['js_parent'];

        // fifth step
        response = await request(url, METHOD.POST, {
                _eventId: 'proceed',
                sig_response: data['js_cookie'] + ':' + appPart
            });

        form = getFormData(response.body);
        data = form.data;
        action = form.action;

        // final step
        response = await request(action, METHOD.POST, data);

        if (!response.body.includes('<title>ACORN</title>')) {
            throw Error('Acorn Unavailable/Unknown Error');
        } else {
            await this.loadRegistrations();
            return this;
        }
    };

    /**
     * Load registrations, this is called internally after login.
     * @private
     * @return {Promise<void>}
     */
    async loadRegistrations() {
        this.registrations = JSON.parse(
          (await request('https://acorn.utoronto.ca/sws/rest/enrolment/eligible-registrations', METHOD.GET, null)).body
        );
    };

}

module.exports = {
    Acorn,
};
