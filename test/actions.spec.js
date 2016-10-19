import test from 'tape'
import { conforms, flow, isDate, isString, matches, overEvery, property } from 'lodash'
import { eq } from 'lodash/fp'
import { login, logout } from 'cape-redux-auth'
import { entityPut, isTriple } from 'redux-graph'
import { collectionListEntity, configStore } from './mock'
import { isListItem } from '../src/helpers'
// import { userCollections } from '../src/select'
import {
  addItemToFavs, close, confirmFavorite, ensureUserHasCollection, isAnon, open, userNeedsCollection,
} from '../src/actions'

const { dispatch, getState } = configStore()
const sailboat = { id: 'saga43', type: 'Sailboat', name: 'Free Spirit' }
dispatch(entityPut(sailboat))

test('userNeedsCollection', (t) => {
  t.equal(userNeedsCollection(null, getState), true)
  t.end()
})
const validConfirm = conforms({
  actionStatus: eq('confirmed'),
  dateUpdated: isDate,
  id: isString,
})
test('confirmFavorite', (t) => {
  const res = confirmFavorite({ id: 'foo1' })
  t.equal(res.type, 'graph/entity/UPDATE')
  t.equal(res.payload.id, 'foo1')
  t.ok(validConfirm(res.payload))
  t.end()
})
let favCollection = null
// Make sure the user has a collection.
test('ensureUserHasCollection', (t) => {
  const res = ensureUserHasCollection()(dispatch, getState)
  t.equal(res.type, 'CollectionList', 'type')
  t.true(isString(res.id), 'id')
  t.true(matches(collectionListEntity)(res))
  favCollection = res
  const res2 = ensureUserHasCollection()(dispatch, getState)
  t.equal(res2, undefined, 'undefined when has collection')
  t.end()
})

test('addItemToFavs', (t) => {
  let listItem = null // { id: 'abc', type: 'ListItem' }
  const validAction1 = overEvery(
    flow(property('type'), eq('graph/entity/PUT')),
    flow(property('payload'), isListItem)
  )
  function act1(act) {
    t.ok(validAction1(act))
    listItem = act.payload
  }
  function act2(act) {
    t.ok(isTriple(act.payload))
    t.equal(act.type, 'graph/triple/PUT')
    t.equal(act.payload.predicate, 'agent')
    t.equal(act.payload.subject.id, listItem.id)
    t.equal(act.payload.object.id, 'anonUser')
  }
  function act3(act) {
    t.ok(isTriple(act.payload))
    t.equal(act.type, 'graph/triple/PUT')
    t.equal(act.payload.predicate, 'item')
    t.equal(act.payload.subject.id, listItem.id)
    t.equal(act.payload.object.id, sailboat.id)
  }
  // Attach the ListItem to the CollectionList.
  function act4(act) {
    t.ok(isTriple(act.payload))
    t.equal(act.type, 'graph/triple/PUT')
    t.equal(act.payload.predicate, 'itemListElement')
    t.equal(act.payload.subject.type, 'CollectionList')
    t.equal(act.payload.subject.id, favCollection.id)
    t.equal(act.payload.object.id, listItem.id)
  }
  const actions = [ act1, act2, act3, act4 ]
  function fakeDispatch(action) {
    actions.shift()(action)
  }
  addItemToFavs(sailboat)(fakeDispatch, getState)
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
