import test from 'tape'
import {
  conforms, find, flow, isDate, isFunction, isString, overEvery, property,
} from 'lodash'
import { eq } from 'lodash/fp'
// import { login, logout } from 'cape-redux-auth'
import { requireIdType } from '@kaicurry/redux-graph'
import { entityPut } from 'redux-graph'
import { configStore, sailboat } from './mock'
// import { ENDED, LIST_ITEM, PREDICATE } from '../src/const'
import { isCollectionList, isListItem } from '../src/lang'
import { listItemSelector } from '../src/select'
import {
  close, CLOSE, open, OPEN, toggle,
} from '../src/actions'

const { dispatch, getState } = configStore()

dispatch(entityPut(sailboat))

test('open', (t) => {
  const item = { type: 'Foo', id: 'a1bc', blah: true }
  const act = open(item)
  t.deepEqual(act, { type: OPEN, payload: { type: 'Foo', id: 'a1bc' } })
  t.end()
})
test('close', (t) => {
  const act = close('blah')
  t.deepEqual(act, { type: CLOSE })
  t.end()
})
