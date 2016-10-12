import test from 'tape'
import { isString, matches } from 'lodash'
import { ensureUserHasCollection, userNeedsCollection } from '../src/actions'
import { collectionListEntity, store } from './mock'

const state = store.getState()

test('userNeedsCollection', (t) => {
  t.equal(userNeedsCollection(null, store.getState), true)
  t.end()
})
test('ensureUserHasCollection', (t) => {
  const res = ensureUserHasCollection()(store.dispatch, store.getState)
  t.equal(res.type, 'CollectionList', 'type')
  t.true(isString(res.id), 'id')
  t.true(matches(collectionListEntity)(res))
  const res2 = ensureUserHasCollection()(store.dispatch, store.getState)
  t.equal(res2, undefined, 'undefined when has collection')
  t.end()
})
