import test from 'tape'

import { getTitle } from '../src/entity'

import { state, props } from './mock'

test('getTitle', (t) => {
  t.equal(getTitle(state, props), 'strawberry', 'getTitle with prop')
  t.equal(getTitle(state), 'Favorites', 'no props')
  t.end()
})
