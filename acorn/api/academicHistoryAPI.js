import {request, clearCookies, METHOD} from '../../modules/RequestModule'

class AcademicHistoryAPI {

  async getRecentHistory() {
    const url = 'https://acorn.utoronto.ca/sws/rest/history/academic/recent';
    return await request(url, {json: true});
  }

  async getFullHistory() {
    const url = 'https://acorn.utoronto.ca/sws/rest/history/academic/complete';
    return await request(url, {json: true});
  }

}

module.exports = {AcademicHistoryAPI}
