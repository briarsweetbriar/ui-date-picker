import { moduleForComponent, test } from 'ember-qunit';
import moment from 'moment';

moduleForComponent('ui-date-input', 'component:ui-date-input', {});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();

  assert.equal(component._state, 'preRender');

  this.render();

  assert.equal(component._state, 'inDOM');
});

test('it updates the current date', function(assert) {
  assert.expect(1);

  var component = this.subject();

  this.render();

  component.$().val('12/13/15');

  assert.ok(component.get('date'), '12/13/15', 'date is rendered correctly');
});
