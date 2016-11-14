import test from 'tape'

import reducer, { defaultState } from '../src/reducer'
import { close, open } from '../src/'

const initState = {
  item: null,
  collection: null,
  listItem: null,
}
test('defaultState', (t) => {
  t.deepEqual(defaultState, initState)
  t.end()
})
test('reducer', (t) => {
  const item = { id: 'a1bc', type: 'Blah' }
  t.deepEqual(reducer(undefined, {}), initState)
  const res = reducer(undefined, open(item))
  t.deepEqual(res.item, item, 'open item id')
  const item2 = { id: 'a2bc', type: 'Blah' }
  const res2 = reducer(res, open(item2))
  t.deepEqual(res2.item, item2, 'open diff item when other open')
  t.deepEqual(reducer(res2, close()), initState)
  t.end()
})
