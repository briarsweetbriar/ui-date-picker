import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/ui-date-range-select';

const {
  computed
} = Ember;


export default Ember.Component.extend({
  layout: layout,

  tagName: 'button',

  classNames: ['ff-date-range-select'],

  classNameBindings: ['active'],

  /**
   * The bound start date value
   *
   * @property startDate
   */
  startDate: null,

  /**
   * The bound end date value
   *
   * @property endDate
   */
  endDate: null,

  active: computed(function() {
    const isStartDate = moment(this.get('startDate') || null).isSame(this.get('rangeStart'), 'day');
    const isEndDate = moment(this.get('endDate') || null).isSame(this.get('rangeEnd'), 'day');

    return isStartDate && isEndDate;
  }),

  click() {
    this.sendAction('action', this.get('rangeStart'), this.get('rangeEnd'));
  }
});
