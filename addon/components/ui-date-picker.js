import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/ui-date-picker';

const {
  on,
  computed,
  generateGuid
} = Ember;

const { reads } = computed;

/**
 * @module DatePickerDay
 *
 * Represents a day, binds computed properties to the date.
 */
const DatePickerDay = Ember.Object.extend({
  value: reads('datePicker.value'),
  month: reads('datePicker.currentMonth'),

  /**
   * Day is today's date
   *
   * @property isToday
   */
  isToday: computed(function() {
    return this.get('date').isSame(new Date(), 'day');
  }),

  /**
   * Day is the selected day in `datePicker`
   *
   * @property isSelected
   */
  isSelected: computed('value', function() {
    return this.get('date').isSame(this.get('value') || null, 'day');
  }),

  /**
   * Day is disabled
   *
   * @property isDisabled
   */
  isDisabled: computed('minDate', 'maxDate', function() {
    const date = this.get('date');
    // Reading via computeds wouldn't pass tests, accessing directly
    const minDate = this.get('datePicker.minDate') || null;
    const maxDate = this.get('datePicker.maxDate') || null;

    return date.isAfter(maxDate) || date.isBefore(minDate);
  }),
  /**
  * Day is not in the current month
  *
  * @property isNotInMonth
  */

  isNotInMonth: computed('value', 'month', function() {
    return !this.get('date').isSame(this.get('month'), 'month');
  })
});

/**
 * @module UiDatePicker
 *
 * Date picker component
 */
export default Ember.Component.extend({
  layout: layout,
  classNames: ['tf-date-picker'],
  classNameBindings: ['inline:tf-date-picker--inline'],

  on: 'click focus',

  flow: 'align-left',


  /**
   * Class applied to the date picker button
   *
   * @property btnClass
   */
  btnClass: 'tf-btn--default',

  datePickerId: computed(function () {
    return generateGuid();
  }),

  /**
   * The bound date value
   *
   * @property value
   */
  value: null,

  /**
   * The class used to represent individual days. This is defined
   * here so that it is overloadable, allowing `UiDateRangePicker` to
   * define it's own `dayClass` with more specialized behavior.
   *
   * @property value
   */
  dayClass: DatePickerDay,

  actions: {
    /**
     * Sets the current month to the previous month
     *
     * @method previousMonth
     */
    previousMonth() {
      this.get('currentMonth').subtract(1, 'month').startOf('month');
      // Since `subtract` mutates the moment object directly, no need to set it
      this.propertyDidChange('currentMonth');
    },

    /**
     * Sets the current month to the next month
     *
     * @method nextMonth
     */
    nextMonth() {
      this.get('currentMonth').add(1, 'month').startOf('month');
      // Since `subtract` mutates the moment object directly, no need to set it
      this.propertyDidChange('currentMonth');
    },

    /**
     * Sets the current month to the currently selected date, or the passed
     * in date. This ensure that the user will always have context when opening
     * the calendar.
     *
     * @method previousMonth
     * @param [value] The date to set currentMonth to
     */
    setCurrentMonth(value) {
      value = value || this.get('value');

      if (value) {
        this.set('currentMonth', moment(value).startOf('month'));
      }
    },

    /**
     * Selects a date and closes the dropdown menu.
     *
     * @method selectDate
     * @param [date] The date to select
     * @param [dropdown] Reference to the dropdown to close it
     */
    selectDate(date, dropdown, isDisabled) {
      if (isDisabled) { return; }

      dropdown.deactivate();

      this.set('value', date.toDate());
    }
  },

  /**
   * Initializes the calendar to the current month
   *
   * @method initializeMonth
   */
  initializeMonth: on('init', function() {
    this.send('setCurrentMonth', new Date());
  }),

  /**
   * The first letter of each day of the week.
   *
   * @property dayNames
   */
  dayNames: computed(function() {
    const week = Ember.A();
    const currentDay = moment().startOf('week');

    for (let iDay = 0; iDay < 7; iDay++) {
      week.push(currentDay.clone().toDate());
      currentDay.add(1, 'day');
    }

    return Ember.A(week.map(function (day) {
      return moment(day).format('dd').substr(0, 1);
    }));
  }),

  /**
   * The weeks of the current month. This instantiates a `dayClass`
   * for each day, and then pushes the day onto a week.
   *
   * @property weeks
   */
  weeks: computed('currentMonth', function() {
    const currentMonth = this.get('currentMonth');

    const endOfMonth = currentMonth.clone().endOf('month');
    const currentDay = currentMonth.clone().startOf('week');
    const weeks = Ember.A();

    while (currentDay.isBefore(endOfMonth)) {
      let week = Ember.A();

      for (let iDay = 0; iDay < 7; iDay++) {
        week.push(this.get('dayClass').create({
          datePicker: this,
          date: currentDay.clone()
        }));
        currentDay.add(1, 'day');
      }

      weeks.push(week);
    }

    return weeks;
  })
});
