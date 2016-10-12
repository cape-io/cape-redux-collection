import test from 'tape'

import {
  collectionListSelector, collections, getItemId, userHasCollections,
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
