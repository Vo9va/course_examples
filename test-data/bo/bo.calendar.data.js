import moment from 'moment';

export default {
  getCalendarTaskData() {
    return {
      category: 'sales',
      type: 'scheduled_call',
      remind_date: moment().set({ hour: 5, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD hh:mm:ss'),
      start_date: moment().set({ hour: 22, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD hh:mm:ss'),
      end_date: moment().set({ hour: 23, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD hh:mm:ss'),
      id: null,
      priority: 'medium',
      note: 'Autotest Note API',
      status: 'active',
    };
  },
};
