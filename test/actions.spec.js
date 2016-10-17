import test from 'tape'
import { isString, matches } from 'lodash'
import { login, logout } from 'cape-redux-auth'
import { entityPut } from 'redux-graph'
import { collectionListEntity, configStore } from './mock'
import { userCollections } from '../src/select'
import {
  addItemToFavs, close, ensureUserHasCollection, isAnon, open, userNeedsCollection,
} from '../src/actions'

const { dispatch, getState } = configStore()
const sailboat = { id: 'saga43', type: 'Sailboat', name: 'Free Spirit' }
dispatch(entityPut(sailboat))

test('userNeedsCollection', (t) => {
  t.equal(userNeedsCollection(null, getState), true)
  t.end()
})
// Make sure the user has a collection.
test('ensureUserHasCollection', (t) => {
  const res = ensureUserHasCollection()(dispatch, getState)
  t.equal(res.type, 'CollectionList', 'type')
  t.true(isString(res.id), 'id')
  t.true(matches(collectionListEntity)(res))
  const res2 = ensureUserHasCollection()(dispatch, getState)
  t.equal(res2, undefined, 'undefined when has collection')
  t.end()
})
test('addItemToFavs', (t) => {
  addItemToFavs(sailboat)(dispatch, getState)
  console.log(userCollections(getState()))
  t.end()
})
test('isAnon', (t) => {
  t.true(isAnon(dispatch, getState))
  dispatch(login({ id: 'testUser' }))
  t.false(isAnon(dispatch, getState))
  dispatch(logout())
  t.true(isAnon(dispatch, getState))
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
