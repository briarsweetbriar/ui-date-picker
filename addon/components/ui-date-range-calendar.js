import Ember from 'ember';
import momentJs from 'moment';
import { moment } from 'ember-moment/computed';
import DateCalendar from './ui-date-calendar';
import layout from '../templates/components/ui-date-calendar';

const {
  computed
} = Ember;

const {
  reads,
  or
} = computed;

/**
 * @module DateRangeCalendarDay
 *
 * Represents a day, binds computed properties to the date.
 */
const DateRangeCalendarDay = Ember.Object.extend({
  selectedStartDate: reads('dateCalendar.selectedStartDate'),
  selectedEndDate:   reads('dateCalendar.selectedEndDate'),
  month:     reads('dateCalendar.currentMonth'),

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
   * Day is the selected start date in `dateCalendar`
   *
   * @property isStartDate
   */
  isStartDate: computed('selectedStartDate', function() {
    return this.get('date').isSame(this.get('selectedStartDate') || null, 'day');
  }),

  /**
   * Day is the selected end date in `dateCalendar`
   *
   * @property isEndDate
   */
  isEndDate: computed('selectedEndDate', function() {
    return this.get('date').isSame(this.get('selectedEndDate') || null, 'day');
  }),

  /**
   * Day is either select start or end date in `dateCalendar`
   *
   * @property isSelected
   */
  isSelected: or('isStartDate', 'isEndDate'),

  /**
   * Day is in the selected range in `dateCalendar`
   *
   * @property isStartDate
   */
  isInRange: computed('value', 'selectedStartDate', 'selectedEndDate', function() {
    const value = this.get('date');
    const selectedStartDate = this.get('selectedStartDate') || null;
    const selectedEndDate = this.get('selectedEndDate') || null;

    return this.get('isSelected') || value.isAfter(selectedStartDate) && value.isBefore(selectedEndDate);
  }),

  /**
   * Day is disabled
   *
   * @property isDisabled
   */
  isDisabled: computed('minDate', 'maxDate', function() {
    // Reading via computeds wouldn't pass tests, accessing directly
    const date = this.get('date');
    const minDate = this.get('dateCalendar.minDate') || null;
    const maxDate = this.get('dateCalendar.maxDate') || null;

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

export default DateCalendar.extend({
  layout: layout,

  dayClass: DateRangeCalendarDay,

  classNames: ['ff-date-range-calendar'],

  /**
   * Alias for value to extend `UiDateCalendar`'s functionality
   *
   * @property selectedStartDate
   */
  selectedStartDate: null,

  /**
   * The bound end date value
   *
   * @property selectedEndDate
   */
  selectedEndDate: null,

  startDate: computed({
    get() {
      return null;
    },

    set(key, date) {
      this.set('selectedStartDate', momentJs(date || null));

      return date;
    }
  }),

  endDate: computed({
    get() {
      return null;
    },

    set(key, date) {
      this.set('selectedEndDate', momentJs(date || null));

      return date;
    }
  }),

  /**
   * if `selectedStartDate` is the same as `selectedEndDate`
   *
   * @property isSingleDate
   */
  isSingleDate: computed('selectedStartDate', 'selectedEndDate', function() {
    const selectedStartDate = this.get('selectedStartDate');
    const selectedEndDate = this.get('selectedEndDate');

    return momentJs(selectedStartDate).isSame(momentJs(selectedEndDate), 'day');
  }),

  /**
   * if `selectedStartDate` is the same month as `selectedEndDate`
   *
   * @property isSingleMonth
   */
  isSingleMonth: computed('selectedStartDate', 'selectedEndDate', function() {
    const selectedStartDate = this.get('selectedStartDate');
    const selectedEndDate = this.get('selectedEndDate');

    return this.get('rangeIsInMonths') && selectedStartDate.isSame(selectedEndDate, 'month');
  }),

  /**
   * if `selectedStartDate` is the same day or month as `selectedEndDate`
   *
   * @property isSingleDateOrMonth
   */
  isSingleDateOrMonth: or('isSingleDate', 'isSingleMonth'),

  /**
   * Determines if the selected range begins at the start of a month and ends at the
   * end of a month. Used for period selection and later month display.
   *
   * @property rangeIsInMonths
   */
  rangeIsInMonths: computed('selectedStartDate', 'selectedEndDate', function() {
    const selectedStartDate = this.get('selectedStartDate');
    const selectedEndDate = this.get('selectedEndDate');

    return selectedStartDate.date() === 1 && (selectedEndDate.month() !== selectedEndDate.add(1, 'days').month());
  }),

  actions: {
    /**
     * Sets a date depending on the state of the DateRangeCalendarDay.
     *
     * If the DateRangeCalendarDay is in range selection mode and a single date
     * is selected (`selectedStartDate` is the same as `selectedEndDate`) then a second date
     * is to be selected. Either `selectedStartDate` or `selectedEndDate` is assigned the
     * value of `date`, depending on its relation to the currently selected
     * date.
     *
     * If the DateRangeCalendarDay is in range selection mode and two dates are
     * already selected, both `selectedStartDate` and `selectedEndDate` are assigned the value
     * of `date` and a single date is chosen.
     *
     * If the DateRangeCalendarDay is not in range selection mode, both `selectedStartDate`
     * and `selectedEndDate` are assigned the value of `date` and the date selection
     * dropdown is closed.
     *
     * @method selectDate
     * @param [date] {Date} The date to set
     * @param [dropdown] {UiDropdown} Dropdown popover to optionally close
     */
    selectDate(date, isDisabled) {
      if (isDisabled) { return; }

      const selectedStartDate = this.get('selectedStartDate');

      if (!selectedStartDate || !this.get('isSingleDate')) {
        this.set('selectedStartDate', date);
        this.set('selectedEndDate', date);
      } else {
        if (momentJs(date).isBefore(selectedStartDate)) {
          this.set('selectedStartDate', date);
        } else {
          this.set('selectedEndDate', date);
        }
      }

      this.send('onChange');
    },

    onChange() {
      const selectedStartDate = this.get('selectedStartDate');
      const selectedEndDate = this.get('selectedEndDate');
      const startDate = this.get('startDate');
      const endDate = this.get('endDate');

      if (selectedStartDate.isSame(startDate) && selectedEndDate.isSame(endDate), 'day') {
        this.sendAction('on-change', selectedStartDate.toDate(), selectedEndDate.toDate());
      }
    },

    /**
     * Selects the next period based on the currently selected period (range)
     *
     * @method selectNextPeriod
     */
    nextPeriod() {
      const { periodCount, periodType } = this.get('period');

      const selectedStartDate = this.get('selectedStartDate');
      const selectedEndDate = this.get('selectedEndDate');

      this.set('selectedStartDate', selectedStartDate.add(periodCount, periodType));
      this.set('selectedEndDate', selectedEndDate.add(periodCount, periodType).endOf(periodType));
    },

    /**
     * Selects the previous period based on the currently selected period (range)
     *
     * @method selectPreviousPeriod
     */
    previousPeriod() {
      const { periodCount, periodType } = this.get('period');

      const selectedStartDate = this.get('selectedStartDate');
      const selectedEndDate = this.get('selectedEndDate');

      this.set('selectedStartDate', selectedStartDate.subtract(periodCount, periodType));
      this.set('selectedEndDate', selectedEndDate.subtract(periodCount, periodType).endOf(periodType));
    }
  }
});
