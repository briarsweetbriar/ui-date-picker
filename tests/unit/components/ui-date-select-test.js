import { moduleForComponent, test } from 'ember-qunit';
import moment from 'moment';

moduleForComponent('ui-date-select', 'component:ui-date-select', {});

const startDate = moment().startOf('week');
const todayDate = moment();
const todayButton = 'button';

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  
  assert.equal(component._state, 'preRender');

  this.render();

  assert.equal(component._state, 'inDOM');
});

test('it renders the correct title for the date select button', function(assert) {
  assert.expect(1);

  var component = this.subject({
    title: "Today",
  });

  this.render();

  assert.equal(component.$().text().trim(), 'Today', ' button name is correct');
});

test('it selects the correct date on the calendar', function(assert) {
  assert.expect(1);

  var component = this.subject({
    title: "Today",
    date: startDate,
    selectedDate: todayDate,
    action: "updateDate"
  });

  this.render();

  component.$().click();

  assert.ok(component.get('date').toDate(), todayDate.toDate(), 'correct day has been selected');
});
