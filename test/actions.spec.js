import test from 'tape'
import {
  isFunction,
} from 'lodash'
// import { eq } from 'lodash/fp'
// import { login, logout } from 'cape-redux-auth'
import { entityPut } from 'redux-graph'
import { configStore, list, sailboat, TIME } from './mock'
// import { ENDED, LIST_ITEM, PREDICATE } from '../src/const'
// import { isCollectionList, isListItem } from '../src/lang'
// import { listItemSelector } from '../src/select'
import {
  close, CLOSE, createList, CREATE_LIST, confirmItem, open, OPEN,
  toggle, toggleActionPrep, UPDATE_ITEM,
} from '../src/actions'

const { dispatch, getState } = configStore()

dispatch(entityPut(sailboat))

test('createList', (t) => {
  // t.plan(2)
  const actionSelector = createList()
  t.ok(isFunction(actionSelector), 'isFunction')
  const action = actionSelector(getState())
  t.equal(action.type, CREATE_LIST)
  t.equal(action.payload.type, 'CollectionList')
  t.end()
})
test('confirmItem', (t) => {
  const action = confirmItem(list)
  t.equal(action.type, UPDATE_ITEM)
  t.equal(action.meta.action, 'CONFIRM_ITEM')
  t.equal(action.payload.id, list.id)
  t.equal(action.payload.type, list.type)
  t.ok(action.payload.dateUpdated > TIME)
  t.false(action.payload.extra)
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
