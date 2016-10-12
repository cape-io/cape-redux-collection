import test from 'tape'

import {
  collectionListSelector, collections, getItemId, userHasCollections,
} from '../src/select'

import { state, props } from './mock'

test('collectionListSelector', (t) => {
  t.deepEqual(collectionListSelector(state), state.graph.entity)
  t.end()
})
test('collections', (t) => {
  t.end()
})

test('getItemId()', (t) => {
  t.equal(getItemId(state, props), 'bar', 'getItemId')
  t.end()
})
