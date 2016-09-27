import test from 'tape'

import { getItemId, getTitle } from '../../src/redux/project/select'

import { state, props } from '../mock'

test('getItemId()', t => {
  t.equal(getItemId(state, props), 'bar', 'getItemId')
  t.end()
})

test('getTitle', t => {
  t.equal(getTitle(state, props), 'strawberry', 'getTitle with prop')
  t.equal(getTitle(state), 'Favorites', 'no props')
  t.end()
})
