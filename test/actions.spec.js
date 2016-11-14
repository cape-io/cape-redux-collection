import test from 'tape'
import {
  isFunction,
} from 'lodash'
// import { eq } from 'lodash/fp'
// import { login, logout } from 'cape-redux-auth'
import { entityPut } from 'redux-graph'
import { configStore, sailboat } from './mock'
// import { ENDED, LIST_ITEM, PREDICATE } from '../src/const'
// import { isCollectionList, isListItem } from '../src/lang'
// import { listItemSelector } from '../src/select'
import {
  close, CLOSE, createList, CREATE_LIST, open, OPEN, toggle, toggleActionPrep,
} from '../src/actions'

const { dispatch, getState } = configStore()

dispatch(entityPut(sailboat))

const item = { type: 'Foo', id: 'a1bc', blah: true }
test('createList', (t) => {
  // t.plan(2)
  const thunk = createList()
  t.ok(isFunction(thunk), 'isFunction')
  // Should be a thunk action.
  // function disp(act) {
  //   console.log('act', act)
  //   t.equal(act.type, CREATE_LIST)
  // }
  // const res = thunk(disp, getState)
  // console.log('res', res)
  t.end()
})
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
