import test from 'tape'
import { isDate, matches, property } from 'lodash'
import { ensureUserHasCollection, userNeedsCollection } from '../src/actions'

import { store } from './mock'

const state = store.getState()

test('userNeedsCollection', (t) => {
  t.equal(userNeedsCollection(null, store.getState), true)
  t.end()
})
test('ensureUserHasCollection', (t) => {
  const res = ensureUserHasCollection()(store.dispatch, store.getState)
  console.log(res)
  t.end()
})
