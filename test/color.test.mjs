import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contrast, deriveAccent, parseHex } from '../src/utils/color.js';

test('parseHex accepts 3 and 6 digit hex, with or without #', () => {
  assert.deepEqual(parseHex('#E11D48'), [225, 29, 72]);
  assert.deepEqual(parseHex('e11d48'), [225, 29, 72]);
  assert.deepEqual(parseHex('#0af'), [0, 170, 255]);
});

test('parseHex rejects anything else instead of returning NaN', () => {
  for (const bad of ['', '#', '#12', '#12345', '#1234567', 'red', '#gggggg', 'rgb(1,2,3)', null, undefined, 42, {}, '#12 456', 'url(x)']) {
    assert.equal(parseHex(bad), null, `should reject ${String(bad)}`);
  }
});

test('contrast: black on white is 21, identical colours are 1', () => {
  assert.equal(Math.round(contrast([0, 0, 0], [255, 255, 255])), 21);
  assert.equal(contrast([10, 20, 30], [10, 20, 30]), 1);
});

test('deriveAccent picks a readable foreground for light and dark accents', () => {
  const light = deriveAccent('#22D3EE', true);         // bright cyan: needs dark text
  const dark = deriveAccent('#4F46E5', true);          // indigo: needs white text
  assert.ok(contrast(light.accent, light.accentFg) >= 4.5);
  assert.ok(contrast(dark.accent, dark.accentFg) >= 4.5);
  assert.notDeepEqual(light.accentFg, dark.accentFg);
});

test('deriveAccent lightens text on dark themes and darkens it on light ones', () => {
  const onDark = deriveAccent('#7C3AED', true).accentText;
  const onLight = deriveAccent('#7C3AED', false).accentText;
  assert.ok(onDark[0] > 124 && onLight[0] < 124);
  assert.equal(deriveAccent('nope', true), null);
});
