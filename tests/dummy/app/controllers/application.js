import Ember from 'ember';
import moment from 'moment';

const {
  computed
} = Ember;

export default Ember.Controller.extend({
  maxDate: computed(function() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(tomorrow);
  }),
  minDate: computed(function() {
    var pastMonth = new Date();
    pastMonth.setMonth(pastMonth.getMonth() - 1);
    return new Date(pastMonth);
  }),
  todayDate: computed(function() {
    return moment();
  }),
  yesterdayDate: computed(function() {
    return moment().subtract(1, 'days');
  }),
  startOfMonth: computed(function() {
    return moment().startOf('month');
  }),
  endOfMonth: computed(function() {
    return moment().endOf('month');
  }),
  startOfWeek: computed(function() {
    return moment().startOf('week');
  }),
  endOfWeek: computed(function() {
    return moment().endOf('week');
  }),
  startOfYear: computed(function() {
    return moment().startOf('year');
  }),
  endOfYear: computed(function() {
    return moment().endOf('year');
  }),
  startOfQuarter: computed(function() {
    return moment().startOf('quarter');
  }),
  endOfQuarter: computed(function() {
    return moment().endOf('quarter');
  }),

  actions: {
    updateDates(startDate, endDate) {
      this.send('updateStartDate', startDate);
      this.send('updateEndDate', endDate);
    },
    updateDate(selectedDate) {
      this.set('date', selectedDate);
    },
    updateStartDate(newDate) {
      this.set('startDate', newDate);
    },
    updateEndDate(newDate) {
      this.set('endDate', newDate);
    },
    toggleRange() {
      this.toggleProperty('range');
    }
  }
});
