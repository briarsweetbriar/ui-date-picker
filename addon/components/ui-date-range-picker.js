import Ember from 'ember';
import moment from 'moment';
import DatePicker from './ui-date-picker';
import layout from '../templates/components/ui-date-range-picker';

const {
  get,
  set,
  computed,
  observer
} = Ember;

const {
  alias,
  reads,
  or
} = computed;

/**
 * @module DateRangePickerDay
 *
 * Represents a day, binds computed properties to the date.
 */
const DateRangePickerDay = Ember.Object.extend({
  startDate: reads('datePicker.startDate'),
  endDate:   reads('datePicker.endDate'),
  month:     reads('datePicker.currentMonth'),

  /**
   * Day is today's date
   *
   * @property isToday
   */
  isToday: computed(function() {
    return this.get('date').isSame(new Date(), 'day');
  }),

  /**
   * Day is the selected start date in `datePicker`
   *
   * @property isStartDate
   */
  isStartDate: computed('startDate', function() {
    return this.get('date').isSame(this.get('startDate') || null, 'day');
  }),

  /**
   * Day is the selected end date in `datePicker`
   *
   * @property isEndDate
   */
  isEndDate: computed('endDate', function() {
    return this.get('date').isSame(this.get('endDate') || null, 'day');
  }),

  /**
   * Day is either select start or end date in `datePicker`
   *
   * @property isSelected
   */
  isSelected: or('isStartDate', 'isEndDate'),

  /**
   * Day is in the selected range in `datePicker`
   *
   * @property isStartDate
   */
  isInRange: computed('value', 'startDate', 'endDate', function() {
    const value = this.get('date');
    const startDate = this.get('startDate') || null;
    const endDate = this.get('endDate') || null;

    return this.get('isSelected') || value.isAfter(startDate) && value.isBefore(endDate);
  }),

  /**
   * Day is disabled
   *
   * @property isDisabled
   */
  isDisabled: computed('minDate', 'maxDate', function() {
    // Reading via computeds wouldn't pass tests, accessing directly
    const date = this.get('date');
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

export default DatePicker.extend({
  layout: layout,

  dayClass: DateRangePickerDay,

  actions: {
    /**
     * Sets a date depending on the state of the DateRangePicker.
     *
     * If the DateRangePicker is in range selection mode and a single date
     * is selected (`startDate` is the same as `endDate`) then a second date
     * is to be selected. Either `startDate` or `endDate` is assigned the
     * value of `date`, depending on its relation to the currently selected
     * date.
     *
     * If the DateRangePicker is in range selection mode and two dates are
     * already selected, both `startDate` and `endDate` are assigned the value
     * of `date` and a single date is chosen.
     *
     * If the DateRangePicker is not in range selection mode, both `startDate`
     * and `endDate` are assigned the value of `date` and the date selection
     * dropdown is closed.
     *
     * @method selectDate
     * @param [date] {Date} The date to set
     * @param [dropdown] {UiDropdown} Dropdown popover to optionally close
     */
    selectDate(date, dropdown, isDisabled) {
      if (isDisabled) { return; }

      const startDate = get(this, 'startDate');
      date = date.toDate();

      if (this.get('range')) {
        if (!startDate || !get(this, 'isSingleDate')) {
          set(this, 'startDate', date);
          set(this, 'endDate', date);
        } else {
          if (moment(date).isBefore(startDate)) {
            this.set('startDate', date);
          } else {
            set(this, 'endDate', date);
          }
        }
      } else {
        this.set('startDate', date);
        this.set('endDate', date);

        dropdown.deactivate();
      }
    },

    /**
     * Sets the range to the specified range values. Possible values are:
     *
     * ```
     * today
     * yesterday
     *
     * startOfThisWeek
     * startOfLastWeek
     * endOfLastWeek
     *
     * startOfThisMonth
     * startOfLastMonth
     * endOfLastMonth
     *
     * startOfThisQuarter
     * startOfLastQuarter
     * endOfLastQuarter
     *
     * startOfThisYear
     * startOfLastYear
     * endOfLastYear
     * ```
     *
     * @method selectRange
     * @param [start] {String} The start of the range
     * @param [end] {String} The end of the range
     */
    selectRange(start, end) {
      this.set('startDate', this.get(start));
      this.set('endDate', this.get(end));
    },

    /**
     * Selects the next period based on the currently selected period (range)
     *
     * @method selectNextPeriod
     */
    nextPeriod() {
      const { periodCount, periodType } = this.get('period');

      const startDate = moment(this.get('startDate'));
      const endDate = moment(this.get('endDate'));

      this.set('startDate', startDate.add(periodCount, periodType));
      this.set('endDate', endDate.add(periodCount, periodType).endOf(periodType));
    },

    /**
     * Selects the previous period based on the currently selected period (range)
     *
     * @method selectPreviousPeriod
     */
    previousPeriod() {
      const { periodCount, periodType } = this.get('period');

      const startDate = moment(this.get('startDate'));
      const endDate = moment(this.get('endDate'));

      this.set('startDate', startDate.subtract(periodCount, periodType));
      this.set('endDate', endDate.subtract(periodCount, periodType).endOf(periodType));
    }
  },

  /**
   * Alias for value to extend `UiDatePicker`'s functionality
   *
   * @property startDate
   */
  startDate: alias('value'),

  /**
   * The bound end date value
   *
   * @property endDate
   */
  endDate: null,

  /**
   * Whether or not the date range picker is in range mode. When not
   * in range mode the date picker will act as a normal date picker,
   * and set both `startDate` and `endDate` to the same selected date.
   * If `rangeOptions` is true then this property should be true, as
   * you cannot turn `range` off in a full date picker.
   *
   * @property range
   */
  range: reads('rangeOptions'),

  /**
   * Determines whether or not the extra range options should be shown.
   * This will show the range selection buttons on the right and the
   * range inputs below the date picker calendar.
   *
   * @property rangeOptions
   */
  rangeOptions: false,

  /**
   * The text to display next to the `range` toggle checkbox
   *
   * @property rangeToggleText
   */
  rangeToggleText: 'Select an end date',

  /**
   * Observes range and resets `endDate` to `startDate` if range mode
   * is turned off.
   *
   * @method clearRange
   */
  clearRange: observer('range', function() {
    if (!this.get('range')) {
      this.set('endDate', this.get('startDate'));
    }
  }),

  /**
   * The value bound to the start date text input in the full range picker.
   * Sets `startDate` if the user alters the value.
   *
   * @property startDateInputValue
   */
  startDateInputValue: computed('startDate', function(key, value) {
    let startDate = get(this, 'startDate');

    if (value) {
      if (value.match(/\d\d\/\d\d\/\d\d\d\d/)) {
        startDate = moment(value).toDate();

        set(this, 'startDate', startDate);
      }
    }

    return startDate ? moment(startDate).format('MM/DD/YYYY') : null;
  }),

  /**
   * The value bound to the end date text input in the full range picker.
   * Sets `endDate` if the user alters the value.
   *
   * @property startDateInputValue
   */
  endDateInputValue: computed('endDate', function(key, value) {
    let endDate = get(this, 'endDate');

    if (value) {
      if (value.match(/\d\d\/\d\d\/\d\d\d\d/)) {
        endDate = moment(value).toDate();

        set(this, 'endDate', endDate);
      }
    }

    return endDate ? moment(endDate).format('MM/DD/YYYY') : null;
  }),

  /**
   * if `startDate` is the same as `endDate`
   *
   * @property isSingleDate
   */
  isSingleDate: computed('startDate', 'endDate', function() {
    const startDate = get(this, 'startDate');
    const endDate = get(this, 'endDate');

    return (!this.get('range')) || moment(startDate).isSame(endDate, 'day');
  }),

  /**
   * if `startDate` is the same month as `endDate`
   *
   * @property isSingleMonth
   */
  isSingleMonth: computed('startDate', 'endDate', function() {
    const startDate = get(this, 'startDate');
    const endDate = get(this, 'endDate');

    return (!this.get('range')) || (this.get('rangeIsInMonths') && moment(startDate).isSame(endDate, 'month'));
  }),

  /**
   * if `startDate` is the same day or month as `endDate`
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
  rangeIsInMonths: computed('startDate', 'endDate', function() {
    const startDate = moment(this.get('startDate') || null);
    const endDate = moment(this.get('endDate') || null);

    return startDate.date() === 1 && endDate.month() !== endDate.add(1, 'days').month();
  }),

  /**
   * Returns the currently selected period in months or days, for changing periods
   * directly.
   *
   * @property period
   */
  period: computed('startDate', 'endDate', function() {
    const startDate = moment(this.get('startDate') || null);
    const endDate = moment(this.get('endDate') || null);

    const periodType = this.get('rangeIsInMonths') ? 'months' : 'days';

    const periodCount = Math.abs(startDate.diff(endDate, periodType)) + 1;

    return { periodCount, periodType };
  }),

  today: computed(function() {
    return moment().toDate();
  }),

  yesterday: computed(function() {
    return moment().subtract(1, 'days').toDate();
  }),

  startOfThisWeek: computed(function() {
    return moment().startOf('week').toDate();
  }),

  endOfThisWeek: computed(function() {
    return moment().endOf('week').toDate();
  }),

  startOfLastWeek: computed(function() {
    return moment().subtract(1, 'weeks').startOf('week').toDate();
  }),

  endOfLastWeek: computed(function() {
    return moment().subtract(1, 'weeks').endOf('week').toDate();
  }),

  startOfThisMonth: computed(function() {
    return moment().startOf('month').toDate();
  }),

  endOfThisMonth: computed(function() {
    return moment().endOf('month').toDate();
  }),

  startOfLastMonth: computed(function() {
    return moment().subtract(1, 'months').startOf('month').toDate();
  }),

  endOfLastMonth: computed(function() {
    return moment().subtract(1, 'months').endOf('month').toDate();
  }),

  startOfThisQuarter: computed(function() {
    return moment().startOf('quarter').toDate();
  }),

  endOfThisQuarter: computed(function() {
    return moment().endOf('quarter').toDate();
  }),

  startOfLastQuarter: computed(function() {
    return moment().subtract(1, 'quarters').startOf('quarter').toDate();
  }),

  endOfLastQuarter: computed(function() {
    return moment().subtract(1, 'quarters').endOf('quarter').toDate();
  }),

  startOfThisYear: computed(function() {
    return moment().startOf('year').toDate();
  }),

  endOfThisYear: computed(function() {
    return moment().endOf('year').toDate();
  }),

  startOfLastYear: computed(function() {
    return moment().subtract(1, 'years').startOf('year').toDate();
  }),

  endOfLastYear: computed(function() {
    return moment().subtract(1, 'years').endOf('year').toDate();
  }),

  /**
   * Boolean properties for whether or not the currently selected range
   * is the stated range.
   *
   * @property rangeIs*
   */
  rangeIsToday: rangeIs('today', 'today'),
  rangeIsYesterday: rangeIs('yesterday', 'yesterday'),
  rangeIsThisWeek: rangeIs('startOfThisWeek', 'endOfThisWeek'),
  rangeIsLastWeek: rangeIs('startOfLastWeek', 'endOfLastWeek'),
  rangeIsThisMonth: rangeIs('startOfThisMonth', 'endOfThisMonth'),
  rangeIsLastMonth: rangeIs('startOfLastMonth', 'endOfLastMonth'),
  rangeIsThisQuarter: rangeIs('startOfThisQuarter', 'endOfThisQuarter'),
  rangeIsLastQuarter: rangeIs('startOfLastQuarter', 'endOfLastQuarter'),
  rangeIsThisYear: rangeIs('startOfThisYear', 'endOfThisYear'),
  rangeIsLastYear: rangeIs('startOfLastYear', 'endOfLastYear')
});

function rangeIs(start, end) {
  return computed('startDate', 'endDate', function() {
    const isStartDate = moment(this.get('startDate') || null).isSame(this.get(start), 'day');
    const isEndDate = moment(this.get('endDate') || null).isSame(this.get(end), 'day');

    return isStartDate && isEndDate;
  });
}
