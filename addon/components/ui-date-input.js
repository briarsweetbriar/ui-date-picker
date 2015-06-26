import Ember from 'ember';
import moment from 'moment';

const {
  computed
} = Ember;

export default Ember.TextField.extend({
  date: computed('formattedDate', {
    get() {
      return moment(this.get('formattedDate')).toDate();
    },
    set(key, date) {
      const formattedDate = date ? moment(date).format('MM/DD/YYYY') : '';
      this.set('formattedDate', formattedDate);

      return date;
    }
  }),

  value: computed('formattedDate', {
    get() {
      return this.get('formattedDate');
    },

    set(key, formattedDate) {
      if (formattedDate.match(/\d\d\/\d\d\/\d\d\d\d/)) {
        const date = moment(formattedDate, 'MM/DD/YYYY');

        if (!date.isSame(this.get('date'), 'day')) {
          this.sendAction('on-change', date.toDate());
        }
      }

      return formattedDate;
    }
  })
});
