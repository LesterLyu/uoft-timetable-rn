import {request, clearCookies, METHOD} from '../../modules/RequestModule'

class FinanceAPI {

  async getInvoice(sessionCode = '') {
    const url = 'https://acorn.utoronto.ca/sws/rest/invoice?sessionCode=' + sessionCode;
    return await request(url, {json: true});
  }

}

module.exports = {FinanceAPI}
