import moment from 'moment';
import proxy from '../proxy.helper';
import config from '../../../config';
import reportPortalHelper from '../reportPortal.helper';
import calendarData from '../../../test-data/bo/bo.calendar.data';

export default {
  async createCustomerCalendarEvent(agent, cid, param = {}) {
    return await agent
      .post(`${config.default.boApiURL}/bo/user-tasks/${cid}`)
      .proxy(proxy)
      .send({ ...calendarData.getCalendarTaskData(), ...param })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCalendarHelper.createCustomerCalendarEvent res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCalendarHelper.createCustomerCalendarEvent status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCalendarHelper.createCustomerCalendarEvent error: ${err}`);
      });
  },

  async getCustomerCalendarEventsByRange(agent) {
    let fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD hh:mm:ss');
    let toDate = moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss');
    return await agent
      .get(`${config.default.boApiURL}/bo/user-tasks?calendar_range=${fromDate}%20-%20${toDate}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(
              `boCalendarHelper.getCustomerCalendarEventsByRange res: ${JSON.stringify(res.body)}`
            )
          : reportPortalHelper.logInfo(
              `boCalendarHelper.getCustomerCalendarEventsByRange status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCalendarHelper.getCustomerCalendarEventsByRange error: ${err}`);
      });
  },

  async updateTask(agent, cid, taskData, taskId) {
    return await agent
      .put(`${config.default.boApiURL}/bo/user-tasks/${cid}/${taskId}`)
      .proxy(proxy)
      .send(taskData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCalendarHelper.updateTask res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCalendarHelper.updateTask status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCalendarHelper.updateTask error: ${err}`);
      });
  },

  async updateTaskStatusToCanceled(agent, cid, taskBodyData) {
    let taskId = taskBodyData.task.id;
    let taskData = { ...taskBodyData.task, status: 'canceled' };
    delete taskData.is_overdue;
    delete taskData.updated_at;
    delete taskData.created_at;
    return await this.updateTask(agent, cid, taskData, taskId);
  },
};
