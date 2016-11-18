import test from 'tape'
import {
  each, every, find, get, isArray, isEmpty, isEqual, isObject, keys, overEvery, size,
} from 'lodash'
import { getRef, getRefs, selectGraph } from '@kaicurry/redux-graph'
import {
  activeListItem, collectionListSelector, confirmActiveThunk, COLLECTION_TYPE,
  createListThunk, isCollectionList, createItemThunk,
  favListFull, favListElements, findItemInListItems, findItemInFavs,
  LIST_ITEM, isListItem, itemIsActive, userCollections, userHasCollections,
  getActiveItem, itemCollectionsHash, activeListItems, listItemsByItem, propsItemKey,
  getListCollectionId, userCollectionsItem,
} from '../src'

import {
  listItemSelector,
} from '../src/select'
import { configStore, list, sailboat, user } from './mock'

const { dispatch, getState } = configStore()
const state = getState()

test('collectionListSelector', (t) => {
  t.equal(collectionListSelector(state), selectGraph(state)[COLLECTION_TYPE])
  t.end()
})
test('listItemSelector', (t) => {
  t.equal(listItemSelector(state), selectGraph(state)[LIST_ITEM])
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
  const res1 = favListFull(getState())
  t.equal(res, res1, 'Confirm selector is working correctly.')
  t.equal(res.type, COLLECTION_TYPE)
  t.ok(res.creator)
  t.ok(res.editor)
  t.equal(find(res.itemListElement).type, LIST_ITEM)
  t.end()
})
test('favListElements', (t) => {
  const favEls = favListElements(getState())
  t.equal(size(favEls), 1)
  const listItem = find(favEls)
  t.ok(isListItem(listItem), 'isListItem')
  t.ok(isObject(listItem.editor), 'editor')
  t.ok(isObject(listItem.item), 'item')
  // console.log(favEls)
  t.end()
})
test('findItemInListItems', (t) => {
  const listItems = { Foo_ab1234: { type: 'Thing', id: 'id4thing', item: sailboat } }
  t.equal(findItemInListItems(listItems, sailboat).id, 'id4thing')
  t.end()
})
test('findItemInFavs', (t) => {
  const res = findItemInFavs(getState(), sailboat)
  t.equal(res.item.id, sailboat.id)
  t.end()
})
test('getActiveItem', (t) => {
  t.equal(getActiveItem({ collection: { item: 'foo' } }), 'foo')
  const ste = { collection: { item: { id: 'saga43', type: 'Sailboat' } } }
  t.deepEqual(getActiveItem(ste), { id: 'saga43', type: 'Sailboat' })
  t.end()
})
test('itemIsActive', (t) => {
  const ste = { collection: { item: { id: 'saga43', type: 'Sailboat' } } }
  t.true(itemIsActive(ste, { item: sailboat }))
  t.false(itemIsActive(ste, null), 'null')
  const ste1 = { collection: { item: null } }
  t.false(itemIsActive(ste1, { item: sailboat }))
  const ste2 = { collection: { item: { id: 'foo1', type: 'Sailboat' } } }
  t.false(itemIsActive(ste2, { item: sailboat }))
  t.false(itemIsActive(ste2, null), 'null ste2')
  t.end()
})
test('activeListItems', (t) => {
  const res = activeListItems(getState())
  t.equal(size(res), 1)
  t.equal(find(res).type, LIST_ITEM)
  t.end()
})
test('listItemsByItem', (t) => {
  const res = listItemsByItem(getState())
  t.true(res && isArray(res.Sailboat_saga43))
  t.equal(res.Sailboat_saga43[0].type, LIST_ITEM)
  t.end()
})
test('propsItemKey', (t) => {
  t.equal(propsItemKey({}, { item: sailboat }), 'Sailboat_saga43')
  t.end()
})
test('getListCollectionId', (t) => {
  const listItem = {
    type: 'ListItem',
    rangeIncludes: {},
    _ref: {
      creator: user,
      editor: user,
      mainEntity: list,
      item: sailboat,
    },
    _refs: {},
    actionStatus: 'Confirmed',
    startTime: 1479448467397,
    position: 100,
    dateCreated: 1479448467398,
    id: 'ng7qgpdj',
    dateModified: 1479448467406,
  }
  const res = getListCollectionId(listItem)
  t.equal(res, list.id)
  t.end()
})
test('itemCollectionsHash', (t) => {
  const res = itemCollectionsHash(getState(), { item: sailboat })
  const firstKey = keys(res)[0]
  t.equal(res[firstKey].type, LIST_ITEM)
  t.equal(getRef(res[firstKey], 'mainEntity').id, firstKey)
  t.equal(getRef(res[firstKey], 'item').id, sailboat.id)
  t.end()
})
test('userCollectionsItem', (t) => {
  // t.plan(2)
  const res = userCollectionsItem(getState(), { item: sailboat })
  t.equal(size(res), 2)
  // each(res, (collection) => {
  //   console.log(collection)
  //   t.equal(
  //     collection.itemInCollection,
  //     isEqual(get(getRefs(collection, 'itemListElement'), 'id'), sailboat.id)
  //   )
  // })
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

// test('getCollectionState', (t) => {
//   t.equal(getCollectionState({ collection: 'foo' }), 'foo')
//   const collection = {}
//   t.equal(getCollectionState({ collection }), collection)
//   t.end()
// })
