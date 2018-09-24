import test from 'tape';
import $ from 'jquery';
import game from './../src/modules/game';

test('test element', (assert) => {
  const sample = game.element();
  const $window = $(window);
  const width = $window.width();
  const height = $window.height();
  sample.setPos(0, 1);
  sample.setVelo(4);
  sample.setDir(0);
  assert.deepEqual(sample.getPos(), [0, 1], 'pos get/set');
  assert.deepEqual(sample.getVelo(), 4, 'velo get/set');
  assert.deepEqual(sample.getDir(), 0, 'dir get/set');
  sample.move();
  assert.deepEqual(sample.getPos(), [4, 1], 'move');
  sample.setDir(-(2 * Math.PI) + (Math.PI / 2));
  assert.deepEqual(sample.getDir(), Math.PI / 2, 'dir adjust');
  sample.rotate((2 * Math.PI) + (Math.PI / 4)); // shift by 45 deg
  assert.ok(Math.abs(sample.getDir() - ((3 / 4) * Math.PI)) < 0.01, 'rotate'); // 135 deg
  sample.rotate(-8 * Math.PI);
  assert.ok(Math.abs(sample.getDir() - ((3 / 4) * Math.PI)) < 0.01, 'rotate'); // 135 deg
  sample.move(); // move left by 2sqrt2 units, up by 2sqrt2 unit (rounds to [3, 3])
  assert.deepEqual(sample.getPos(), [1, 4], 'move #2');
  sample.setPos(width + game.BUFFER, height + game.BUFFER);
  sample.setVelo(5);
  sample.setDir(Math.PI / 4);
  sample.move();
  const pos = sample.getPos();
  assert.ok(pos[0] < width && pos[1] < height, 'right/top overflow');
  sample.rotate(-Math.PI);
  sample.move();
  assert.ok(pos[0] > 0 && pos[1] > 0, 'left/bottom overflow');
  sample.accelerate(1);
  assert.equal(sample.getVelo(), 6, 'accelerate');
  try {
    sample.setVelo(game.MAX_VELO + 1);
  } catch (Error) {
    assert.true('velo above max velo');
  }
  try {
    sample.setVelo(-1);
  } catch (Error) {
    assert.true('velo below 0');
  }
  assert.notEqual(sample.getVelo(), game.MAX_VELO + 1, 'velo not accepted');
  assert.end();
});

window.close();
