import Ember from 'ember';
import momentJs from 'moment';
import moment from 'ember-moment/computeds/moment';
import layout from '../templates/components/ui-date-calendar';

const {
  on,
  computed
} = Ember;

const { reads } = computed;

/**
 * @module DateCalendarDay
 *
 * Represents a day, binds computed properties to the date.
 */
const DateCalendarDay = Ember.Object.extend({
  selectedDate: reads('dateCalendar.selectedDate'),
  month: reads('dateCalendar.currentMonth'),

  asDayOfMonth: moment('date', 'D'),

  /**
   * Day is today's date
   *
   * @property isToday
   */
  isToday: computed(function() {
    return this.get('date').isSame(new Date(), 'day');
  }),

  /**
   * Day is the selected day in `dateCalendar`
   *
   * @property isSelected
   */
  isSelected: computed('selectedDate', function() {
    return this.get('date').isSame(this.get('selectedDate') || null, 'day');
  }),

  /**
   * Day is disabled
   *
   * @property isDisabled
   */
  isDisabled: computed('minDate', 'maxDate', function() {
    const date = this.get('date');
    // Reading via computeds wouldn't pass tests, accessing directly
    const minDate = this.get('dateCalendar.minDate') || null;
    const maxDate = this.get('dateCalendar.maxDate') || null;

    return date.isAfter(maxDate) || date.isBefore(minDate);
  }),
  /**
  * Day is not in the current month
  *
  * @property isNotInMonth
  */

  isNotInMonth: computed('selectedDate', 'month', function() {
    return !this.get('date').isSame(this.get('month'), 'month');
  })
});

/**
 * @module UiDateCalendar
 *
 * Date calendar component
 */
export default Ember.Component.extend({
  layout: layout,
  classNames: ['ff-date-calendar'],

  formattedCurrentMonth: moment('currentMonth', 'MMMM YYYY'),

  /**
   * The class used to represent individual days. This is defined
   * here so that it is overloadable, allowing `UiDateRangeCalendar` to
   * define it's own `dayClass` with more specialized behavior.
   *
   * @property value
   */
  dayClass: DateCalendarDay,

  date: computed({
    get() {
      return null;
    },

    set(key, value) {
      this.set('selectedDate', momentJs(value));

      return value;
    }
  }),

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
    const currentDay = momentJs().startOf('week');

    for (let iDay = 0; iDay < 7; iDay++) {
      week.push(currentDay.clone().toDate());
      currentDay.add(1, 'day');
    }

    return Ember.A(week.map(function (day) {
      return momentJs(day).format('dd').substr(0, 1);
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
          dateCalendar: this,
          date: currentDay.clone()
        }));
        currentDay.add(1, 'day');
      }

      weeks.push(week);
    }

    return weeks;
  }),

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
        this.set('currentMonth', momentJs(value).startOf('month'));
      }
    },

    /**
     * Selects a date
     *
     * @method selectDate
     * @param [date] The date to select
     */
    selectDate(date, isDisabled) {
      if (isDisabled) { return; }

      // debugger
      this.set('selectedDate', date);
      this.send('onChange', date);
    },

    onChange(date) {
      if (!date.isSame(this.get('date'), 'day')) {
        this.sendAction('on-change', date.toDate());
      }
    }
  }
});
