import { moduleForComponent, test } from 'ember-qunit';
import moment from 'moment';

moduleForComponent('ui-date-calendar', 'component:ui-date-calendar', {});

const previousMonthButton = '.ff-date-calendar-previous';
const nextMonthButton = '.ff-date-calendar-next';
const currentCalendarMonthHeader = 'header .ff-date-calendar-current';
const calendarDayFifteen = '.ff-date-calendar-month tbody tr td:contains(15)';

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();

  assert.equal(component._state, 'preRender');

  this.render();

  assert.equal(component._state, 'inDOM');
});

test('calendar allows a user to view the previous month on calendar', function(assert) {
  assert.expect(1);

  var component = this.subject();

  this.render();

  component.$(previousMonthButton).click();

  assert.equal(component.$(currentCalendarMonthHeader).text(), 'May 2015', 'the previous month functions correctly');
});

test('calendar allows a user to view the next month on calendar', function(assert) {
  assert.expect(1);

  var component = this.subject();

  this.render();

  component.$(nextMonthButton).click();

  assert.equal(component.$(currentCalendarMonthHeader).text(), 'July 2015', 'the next month functions correctly');
});

test('calendar renders the current month as default', function(assert) {
  assert.expect(1);

  var component = this.subject();

  this.render();

  assert.equal(component.$(currentCalendarMonthHeader).text(), 'June 2015', 'the current month renders correctly');
});

test('calendar allows a user to select a date', function(assert) {
  assert.expect(1);

  var component = this.subject();

  this.render();

  component.$(calendarDayFifteen).click();

  assert.ok(component.$(calendarDayFifteen).hasClass('selected'), 'the date input updates to selected date');
});
