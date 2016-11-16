import test from 'tape'
import {
  find, isArray, isFunction, isNumber,
} from 'lodash'
// import { eq } from 'lodash/fp'
import { login, logout, userNew } from 'cape-redux-auth'
import { COLLECTION_TYPE, CONFIRMED, ENDED, LIST_ITEM } from '../src/const'
import { CLOSE, CREATE_ITEM, CREATE_LIST, OPEN, UPDATE_ITEM } from '../src/actions'
// import { isCollectionList, isListItem } from '../src/lang'
// import { listItemSelector } from '../src/select'
import {
  close, createItem, createList, createListThunk, confirmItem,
  confirmActivePayload, userCollections, createItemThunk, confirmActive,
  endItem, findItemInFavs,
  confirmActiveThunk, activeListItem, userNeedsCollection,
  open, toggle, toggleActionPrep, toggleActionAnon, addOrOpen,
} from '../src'
import { configStore, listItem, TIME, kai, sailboat, user } from './mock'

const { dispatch, getState } = configStore()

test('createList', (t) => {
  // t.plan(2)
  const actionSelector = createList()
  t.ok(isFunction(actionSelector), 'isFunction')
  const action = actionSelector(getState())
  t.equal(action.type, CREATE_LIST)
  t.equal(action.payload.type, 'CollectionList')
  t.end()
})
test('createListThunk', (t) => {
  function disp(act) {
    t.equal(act.type, CREATE_LIST)
    t.equal(act.payload.type, 'CollectionList')
    return act
  }
  const action = createListThunk()(disp, getState)
  t.equal(action.type, CREATE_LIST)
  t.equal(action.payload.type, 'CollectionList')
  t.end()
})
test('createItem', (t) => {
  const mainEntity = dispatch(createListThunk()).payload
  const action = createItem({ item: sailboat, mainEntity })(getState())
  t.equal(action.payload.mainEntity, mainEntity)
  t.equal(action.payload.item, sailboat)
  t.equal(action.type, CREATE_ITEM)
  // console.log(action)
  t.end()
})

test('confirmItem', (t) => {
  const action = confirmItem(listItem)
  t.equal(action.type, UPDATE_ITEM)
  t.equal(action.meta.action, 'CONFIRM_ITEM')
  t.equal(action.payload.id, listItem.id)
  t.equal(action.payload.type, listItem.type)
  t.ok(action.payload.dateUpdated > TIME)
  t.false(action.payload.extra)
  t.end()
})
test('endItem', (t) => {
  const action = endItem(listItem)
  t.equal(action.type, UPDATE_ITEM)
  t.equal(action.payload.actionStatus, ENDED)
  t.equal(action.meta.action, 'END_ITEM')
  t.end()
})
test('confirmActivePayload', (t) => {
  createListThunk()(dispatch, getState)
  const mainEntity = find(userCollections(getState()))
  const item = createItemThunk({ mainEntity, item: sailboat })(dispatch, getState).payload
  const payload = confirmActivePayload(getState())
  t.equal(payload.id, item.id)
  t.equal(payload.type, LIST_ITEM)
  t.equal(payload.actionStatus, CONFIRMED)
  t.ok(isNumber(payload.dateUpdated))
  t.end()
})
test('confirmActive', (t) => {
  const action = confirmActive(getState())
  t.equal(action.type, UPDATE_ITEM)
  t.equal(action.meta.action, 'CONFIRM_ACTIVE')
  t.equal(action.payload.actionStatus, CONFIRMED)
  t.end()
})
test('confirmActiveThunk', (t) => {
  const thunk = confirmActiveThunk()
  t.ok(isFunction(thunk))
  const action = thunk(dispatch, getState)
  t.ok(action.type)
  t.ok(action.payload, 'has payload')
  t.equal(action.payload.actionStatus, CONFIRMED)
  t.end()
})
const item = { type: 'Foo', id: 'a1bc', blah: true }
test('open', (t) => {
  const act = open(item)
  t.deepEqual(act, { type: OPEN, payload: { type: 'Foo', id: 'a1bc' } })
  t.end()
})
test('close', (t) => {
  const act = close('blah')
  t.deepEqual(act, { type: CLOSE })
  t.end()
})
test('toggleActionPrep', (t) => {
  const ste1 = getState()
  // User has collection and no items need confirming.
  t.false(activeListItem(ste1))
  t.false(userNeedsCollection(ste1))
  const res = toggleActionPrep(ste1)
  t.ok(isArray(res), 'isArray')
  t.equal(res.length, 0, 'len')
  // Switch users.
  dispatch(userNew(user))
  const ste2 = getState()
  t.false(activeListItem(ste2), 'no active item')
  t.true(userNeedsCollection(ste2), 'new user needs new list')
  const act1 = toggleActionPrep(ste2)
  t.equal(act1.length, 1, 'act1 length')
  t.equal(act1[0].type, CREATE_LIST, 'CREATE_LIST')
  t.equal(act1[0].payload.editor, user, 'editor')
  t.equal(act1[0].payload.title, 'Favorites', 'new list favs title')
  // Create list and item.
  const mainEntity = dispatch(act1[0]).payload
  t.equal(mainEntity.type, COLLECTION_TYPE, 'collection type')
  createItemThunk({ mainEntity, item: sailboat })(dispatch, getState)
  const ste3 = getState()
  t.true(activeListItem(ste3), 'now there is active list item.')
  t.false(userNeedsCollection(ste3), 'user has collection')
  // Now check for activeListItem
  const act2 = toggleActionPrep(ste3)
  t.equal(act2.length, 1, 'action length')
  t.equal(act2[0].type, UPDATE_ITEM, 'UPDATE_ITEM')
  t.equal(act2[0].payload.type, LIST_ITEM, 'payload LIST_ITEM')
  t.equal(act2[0].meta.action, 'CONFIRM_ACTIVE', 'meta.action')
  t.end()
})
test('toggleActionAnon', (t) => {
  const list = findItemInFavs(getState(), sailboat)
  t.equal(list.type, LIST_ITEM, 'list found')
  const act1 = toggleActionAnon(getState(), sailboat)
  t.equal(act1.type, UPDATE_ITEM)
  t.equal(act1.payload.actionStatus, ENDED)
  t.equal(act1.meta.action, 'END_ITEM')
  dispatch(act1)
  t.equal(findItemInFavs(getState(), sailboat))
  const act2 = toggleActionAnon(getState(), sailboat)
  t.equal(act2.type, CREATE_ITEM)
  t.equal(act2.payload.mainEntity.type, 'CollectionList')
  t.equal(act2.payload.item, sailboat)
  t.end()
})
test('addOrOpen', (t) => {
  const act1 = addOrOpen(getState(), sailboat)
  t.equal(act1.type, CREATE_ITEM)
  t.equal(act1.payload.mainEntity.type, 'CollectionList')
  t.equal(act1.payload.item, sailboat)
  dispatch(login(user))
  const act2 = addOrOpen(getState(), sailboat)
  t.equal(act2.type, OPEN)
  t.equal(act2.payload.id, sailboat.id)
  t.end()
})
test('toggle', (t) => {
  const thunk = toggle(sailboat)
  t.plan(6)
  t.ok(isFunction(thunk))
  const disp1 = (act) => {
    t.equal(act.type, OPEN)
    t.equal(act.payload.id, sailboat.id)
  }
  thunk(disp1, getState)
  dispatch(logout())
  const disp2 = (act) => {
    t.equal(act.meta.action, 'END_ITEM')
  }
  thunk(disp2, getState)
  dispatch(userNew(kai))
  const checks = [
    (act) => { t.equal(act.type, CREATE_LIST) },
    (act) => { t.equal(act.type, CREATE_ITEM) },
  ]
  const disp3 = act => checks.shift()(act)
  thunk(disp3, getState)
  t.end()
})
