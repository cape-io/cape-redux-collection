import test from 'tape'
import { isString, matches } from 'lodash'
import { login, logout } from 'cape-redux-auth'
import { collectionListEntity, store } from './mock'
import {
  close, ensureUserHasCollection, isAnon, open, userNeedsCollection,
} from '../src/actions'

test('userNeedsCollection', (t) => {
  t.equal(userNeedsCollection(null, store.getState), true)
  t.end()
})
// Make sure the user has a collection.
test('ensureUserHasCollection', (t) => {
  const res = ensureUserHasCollection()(store.dispatch, store.getState)
  t.equal(res.type, 'CollectionList', 'type')
  t.true(isString(res.id), 'id')
  t.true(matches(collectionListEntity)(res))
  const res2 = ensureUserHasCollection()(store.dispatch, store.getState)
  t.equal(res2, undefined, 'undefined when has collection')
  t.end()
})
test('isAnon', (t) => {
  t.true(isAnon(store.dispatch, store.getState))
  store.dispatch(login({ id: 'testUser' }))
  t.false(isAnon(store.dispatch, store.getState))
  store.dispatch(logout())
  t.true(isAnon(store.dispatch, store.getState))
  t.end()
})
test('open', (t) => {
  const act = open({ type: 'Foo', id: 'a1b', blah: true })
  t.deepEqual(act, { type: 'collection/ITEM', payload: 'a1b' })
  t.end()
})
test('close', (t) => {
  const act = close('blah')
  t.deepEqual(act, { type: 'collection/CLOSE' })
  t.end()
})
