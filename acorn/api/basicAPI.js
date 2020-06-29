import {request} from '../../modules/RequestModule'

/**
 * Basic API.
 */
class BasicAPI {
  constructor(acorn) {
    this.acorn = acorn;
    this.studentRegistrationInfo = null;
  }

  async getStudentBasicInfo() {
    const url = 'https://acorn.utoronto.ca/sws/rest/profile/studentBasicInfo';
    return await request(url, {json: true});
  }

  async getNotifications() {
    const url = 'https://acorn.utoronto.ca/sws/rest/notification?priority=HIGH&priority=SEVERE&priority=MEDIUM';
    return await request(url, {json: true});
  }

  /**
   * Is today peak load?
   * @returns {Promise<boolean>}
   */
  async getIsPeakMode() {
    const url = 'https://acorn.utoronto.ca/sws/rest/acorn-config/is-today-peak-load';
    return (await request(url, {json: true})).peakMode;
  }

  async getCurrentDate() {
    const url = 'https://acorn.utoronto.ca/sws/rest/dashboard/eventCalendar/getCurrentDate/yyyy-MM-dd';
    return (await request(url, {json: true})).currentDate;
  }

  async getToday() {
    const url = 'https://acorn.utoronto.ca/sws/rest/dashboard/eventCalendar/getDashboardEvents/TODAY';
    return (await request(url, {json: true}));
  }

  async getStartTimes() {
    const url = 'https://acorn.utoronto.ca/sws/rest/enrolment/course/start-times';
    return (await request(url, {json: true}));
  }

  async getGlobalMessage() {
    const url = 'https://acorn.utoronto.ca/sws/rest/acorn-config/global-message';
    return (await request(url, {json: true}));
  }

  /**
   * @returns {Promise<string>}
   */
  async getAccountBalance() {
    const url = 'https://acorn.utoronto.ca/sws/rest/profile/studentRegistrationInfo';
    this.studentRegistrationInfo = await request(url, {json: true});
    return this.studentRegistrationInfo.accountBalance;
  }

  /**
   * @returns {Promise<ProgramProgress>}
   */
  async getProgramProgress() {
    const url = 'https://acorn.utoronto.ca/sws/rest/dashboard/programProgress';
    return await request(url, {json: true});
  }

}

module.exports = {BasicAPI};
