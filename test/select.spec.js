import test from 'tape'
import { isEmpty, isPlainObject, matches, pickBy } from 'lodash'
import {
  collectionListSelector, collections, getItemId, userCollections, userHasCollections,
} from '../src/select'
import { configStore, props } from './mock'

const store = configStore()

const state = store.getState()
test('collectionListSelector', (t) => {
  t.deepEqual(
    collectionListSelector(state),
    pickBy(state.graph.entity, matches({ type: 'CollectionList' })))
  t.end()
})
test('collections', (t) => {
  t.deepEqual(collections(state), { foo: { id: 'foo', type: 'CollectionList' } })
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
