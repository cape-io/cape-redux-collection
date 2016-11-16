import test from 'tape'
import { every, find, isEmpty, isObject, overEvery, size } from 'lodash'

import {
  activeListItem, collectionListSelector, confirmActiveThunk, COLLECTION_TYPE,
  createListThunk, isCollectionList, createItemThunk,
  favsListSelector, favListFull,
  LIST_ITEM, isListItem, userCollections, userHasCollections,
} from '../src'

import {
  listItemSelector,
} from '../src/select'
import { configStore, props, sailboat } from './mock'

const { dispatch, getState } = configStore()
const state = getState()

test('collectionListSelector', (t) => {
  t.equal(collectionListSelector(state), state.graph[COLLECTION_TYPE])
  t.end()
})
test('listItemSelector', (t) => {
  t.equal(listItemSelector(state), state.graph[LIST_ITEM])
  t.end()
})
test('userHasCollections', (t) => {
  t.true(overEvery(isObject, isEmpty)(userCollections(getState())), 'isEmpty')
  t.equal(userHasCollections(state), false, 'no collections')
  createListThunk()(dispatch, getState)
  t.equal(userHasCollections(state), false, 'no collections')
  t.end()
})
test('userCollections', (t) => {
  t.equal(size(userCollections(getState())), 1)
  createListThunk()(dispatch, getState)
  const mine = userCollections(getState())
  t.equal(size(mine), 2)
  t.ok(every(mine, isCollectionList))
  t.end()
})
// test('userCollections', (t) => {
//   const res = userCollections(state)
//   t.true(isPlainObject(res), 'no collections by default')
//   t.end()
// })
test('activeListItem', (t) => {
  const listItem0 = activeListItem(getState())
  t.equal(listItem0, undefined)
  const mainEntity = find(userCollections(getState()))
  const listItem1 = createItemThunk({ mainEntity, item: sailboat })(dispatch, getState).payload
  t.ok(isListItem(listItem1), 'isListItem')
  const listItem3 = activeListItem(getState())
  t.ok(isListItem(listItem3), 'isListItem')
  t.deepEqual(listItem1, listItem3)
  confirmActiveThunk()(dispatch, getState)
  t.equal(activeListItem(getState()), undefined)
  t.end()
})
test('favListFull', (t) => {
  const res = favListFull(getState())
  console.log(res)
  t.end()
})
// test('collections', (t) => {
//   t.deepEqual(collections(state), { foo: { id: 'foo', type: 'CollectionList' } })
//   t.end()
// })
//
// test('getItemId()', (t) => {
//   t.equal(getItemId(state, props), 'bar', 'getItemId')
//   t.equal(getItemId(state, { item: sailboat }), 'saga43')
//   t.end()
// })
//
//
// test('favListElements', (t) => {
//   const favEls = favListElements(getState())
//   t.equal(size(favEls), 1)
//   const listItem = find(favEls)
//   t.ok(isListItem(listItem), 'isListItem')
//   t.ok(isPlainObject(listItem.agent), 'agent')
//   t.ok(isPlainObject(listItem.item), 'item')
//   t.end()
// })
// test('getCollectionState', (t) => {
//   t.equal(getCollectionState({ collection: 'foo' }), 'foo')
//   const collection = {}
//   t.equal(getCollectionState({ collection }), collection)
//   t.end()
// })
// test('getActiveItem', (t) => {
//   t.equal(getActiveItem({ collection: { item: 'foo' } }), 'foo')
//   t.end()
// })
// test('itemIsActive', (t) => {
//   t.true(itemIsActive({ collection: { item: 'saga43' } }, { item: sailboat }))
//   t.false(itemIsActive({ collection: { item: 'foo' } }, { item: sailboat }))
//   t.end()
// })
