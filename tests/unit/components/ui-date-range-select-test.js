import { moduleForComponent, test } from 'ember-qunit';
import moment from 'moment';

moduleForComponent('ui-date-range-select', 'component:ui-date-range-select', {});

const startDate = moment().startOf('week');
const endDate = moment().endOf('week');
const todayDate = moment();
const startOfWeek = moment().startOf('week');
const endOfWeek = moment().endOf('week');
const componentButton = 'button';

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  
  assert.equal(component._state, 'preRender');

  this.render();

  assert.equal(component._state, 'inDOM');
});

test('it renders the correct title for the date range select button', function(assert) {
  assert.expect(1);

  var component = this.subject({
    title: "This Week",
    date: startDate,
    selectedDate: todayDate
  });

  this.render();

  assert.equal(component.$().text().trim(), 'This Week', ' button name is correct');
});

test('it selects the correct dates on the calendar', function(assert) {
  assert.expect(1);

  var component = this.subject({
    title: "This Week",
    startDate: startDate,
    endDate: endDate,
    rangeStart: startOfWeek,
    rangeEnd: endOfWeek,
    action: "updateDates"
  });

  this.render();

  component.$().click();

  assert.ok(component.get('startDate').toDate(), startOfWeek.toDate(), 'correct days are selected');
});
