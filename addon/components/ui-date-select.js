import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/ui-date-select';

const {
  computed
} = Ember;


export default Ember.Component.extend({
  layout: layout,

  tagName: 'button',

  classNames: ['ff-date-select'],

  classNameBindings: ['active'],

  /**
   * The bound date value
   *
   * @property date
   */
  date: null,

  active: computed(function() {
    const selectedDate = moment(this.get('date') || null).isSame(this.get('selectedDate'), 'day');

    return selectedDate;
  }),

  click() {
    this.sendAction('action', this.get('selectedDate'));
  }
});
