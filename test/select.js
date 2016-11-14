import test from 'tape'
import { find, isEmpty, isPlainObject, matches, pickBy, size } from 'lodash'

import { confirmActive } from '../src/actions'
import { isListItem } from '../src/lang'
import {
  activeListItem, collectionListSelector, collections, getItemId, favListElements,
  getActiveItem, getCollectionState, itemIsActive,
  userCollections, userHasCollections,
} from '../src/select'
import { configStore, props, sailboat } from './mock'

const { dispatch, getState } = configStore()
const state = getState()
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
  t.equal(getItemId(state, { item: sailboat }), 'saga43')
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

test('activeListItem', (t) => {
  const listItem = activeListItem(getState())
  t.ok(isListItem(listItem), 'isListItem')
  confirmActive(dispatch, getState)
  const listItem2 = activeListItem(getState())
  t.equal(listItem2, undefined)
  t.end()
})
test('favListElements', (t) => {
  const favEls = favListElements(getState())
  t.equal(size(favEls), 1)
  const listItem = find(favEls)
  t.ok(isListItem(listItem), 'isListItem')
  t.ok(isPlainObject(listItem.agent), 'agent')
  t.ok(isPlainObject(listItem.item), 'item')
  t.end()
})
test('getCollectionState', (t) => {
  t.equal(getCollectionState({ collection: 'foo' }), 'foo')
  const collection = {}
  t.equal(getCollectionState({ collection }), collection)
  t.end()
})
test('getActiveItem', (t) => {
  t.equal(getActiveItem({ collection: { item: 'foo' } }), 'foo')
  t.end()
})
test('itemIsActive', (t) => {
  t.true(itemIsActive({ collection: { item: 'saga43' } }, { item: sailboat }))
  t.false(itemIsActive({ collection: { item: 'foo' } }, { item: sailboat }))
  t.end()
})
