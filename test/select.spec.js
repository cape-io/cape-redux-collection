import test from 'tape'
import { isEmpty, isPlainObject } from 'lodash'
import {
  collectionListSelector, collections, getItemId, userCollections, userHasCollections,
} from '../src/select'

import { store, props } from './mock'

const state = store.getState()
test('collectionListSelector', (t) => {
  t.deepEqual(collectionListSelector(state), state.graph.entity)
  t.end()
})
test('collections', (t) => {
  t.deepEqual(collections(state), state.graph.entity)
  t.end()
})

test('getItemId()', (t) => {
  t.equal(getItemId(state, props), 'bar', 'getItemId')
  t.end()
})
test('userCollections', (t) => {
  const res = userCollections(state)
  t.true(isEmpty(res), 'isEmpty')
  t.true(isPlainObject(res), 'no collections by default')
  t.end()
})
test('userHasCollections', (t) => {
  t.equal(userHasCollections(state), false, 'no collections')
  t.end()
})
