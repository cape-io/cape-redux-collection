import test from 'tape'
import {
  find, isFunction, isNumber,
} from 'lodash'
// import { eq } from 'lodash/fp'
// import { login, logout } from 'cape-redux-auth'
import { configStore, listItem, TIME, sailboat } from './mock'
// import { ENDED, LIST_ITEM, PREDICATE } from '../src/const'
// import { isCollectionList, isListItem } from '../src/lang'
// import { listItemSelector } from '../src/select'
import {
  close, CLOSE, createItem, CREATE_ITEM, createList, createListThunk, CREATE_LIST, confirmItem,
  confirmActivePayload, userCollections, createItemThunk, LIST_ITEM, CONFIRMED, confirmActive,
  confirmActiveThunk,
  open, OPEN, toggle, toggleActionPrep, UPDATE_ITEM,
} from '../src'

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
  t.end()
})
test('confirmActiveThunk', (t) => {
  const thunk = confirmActiveThunk()
  t.ok(isFunction(thunk))
  const action = thunk(dispatch, getState)
  t.ok(action.type)
  t.ok(action.payload)
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
  // const res = toggleActionPrep(item)
  // console.log(res)
  t.end()
})
test('toggle', (t) => {
  t.end()
})
