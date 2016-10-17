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
  t.deepEqual(reducer(undefined, {}), initState)
  const res = reducer(undefined, open({ id: 'a1b', thing: 'blah' }))
  t.equal(res.item, 'a1b', 'open item id')
  const res2 = reducer(res, open({ id: 'a2b', thing: 'blah' }))
  t.equal(res2.item, 'a2b', 'open item when other open')
  t.deepEqual(reducer(res2, close()), initState)
  t.end()
})
