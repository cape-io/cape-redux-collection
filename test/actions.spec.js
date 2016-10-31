import test from 'tape'
import {
  conforms, find, flow, isDate, isFunction, isString, matches, overEvery, property,
} from 'lodash'
import { eq } from 'lodash/fp'
import { login, logout } from 'cape-redux-auth'
import { entityPut, isTriple, ENTITY_UPDATE } from 'redux-graph'
import { collectionListEntity, configStore, sailboat, sail2 } from './mock'
import { LIST_ITEM, PREDICATE } from '../src/const'
import { isListItem } from '../src/helpers'
import { listItemSelector } from '../src/select'
import {
  addOrOpen, addItemToFavs, addItemToCollection, close, CLOSE, confirmFavorite,
  endAction, endFavAction, endFavorite, ensureUserHasCollection, isAnon,
  open, shouldEndItem, userNeedsCollection,
} from '../src/actions'

const { dispatch, getState } = configStore()

dispatch(entityPut(sailboat))

test('userNeedsCollection', (t) => {
  t.equal(userNeedsCollection(null, getState), true)
  t.end()
})
const validConfirm = conforms({
  actionStatus: eq('confirmed'),
  dateUpdated: isDate,
  id: isString,
  type: eq(LIST_ITEM),
})
test('confirmFavorite', (t) => {
  const res = confirmFavorite({ id: 'foo1', type: LIST_ITEM })
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
  let listItem = null
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
    t.equal(act.payload.predicate, PREDICATE)
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
test('addItemToCollection', (t) => {
  const actThunk = addItemToCollection(favCollection, sail2)
  t.ok(isFunction(actThunk))
  const act = actThunk({})
  t.ok(isFunction(act))
  const [ triple, closeAction ] = act(dispatch, getState)
  t.equal(closeAction.type, CLOSE)
  t.equal(triple.subject, favCollection)
  t.equal(triple.predicate, PREDICATE)
  t.equal(triple.object.type, LIST_ITEM)
  // console.log(triple)
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
test('shouldEndItem', (t) => {
  t.false(shouldEndItem(sailboat)(t.end, getState))
  addItemToFavs(sailboat)(dispatch, getState)
  t.true(shouldEndItem(sailboat)(null, getState))
  t.end()
})
function validEndAct(t, act) {
  t.equal(act.type, 'graph/entity/UPDATE', 'type')
  t.equal(act.payload.actionStatus, 'ended', 'actionStatus')
  t.ok(isDate(act.payload.endTime))
  t.ok(isString(act.payload.id))
  t.equal(act.payload.type, LIST_ITEM)
}
test('endAction', (t) => {
  const getAct = endAction(find)
  t.ok(isFunction(getAct))
  const listItem = listItemSelector(getState())
  const act = getAct(listItem)
  t.equal(act.type, ENTITY_UPDATE)
  t.equal(act.payload.type, LIST_ITEM)
  t.end()
})
test('endFavAction', (t) => {
  const act = endFavAction(getState(), { item: sailboat })
  validEndAct(t, act)
  t.end()
})
test('endFavorite', (t) => {
  const act = endFavorite(sailboat)(dispatch, getState)
  validEndAct(t, act)
  t.false(shouldEndItem(sailboat)(t.end, getState))
  t.end()
})
test('addOrOpen', (t) => {
  const act = addOrOpen(sailboat)
  t.ok(isFunction(act))
  t.end()
})
