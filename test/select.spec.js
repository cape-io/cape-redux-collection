import test from 'tape'
import { find, isEmpty, isPlainObject, matches, pickBy, size } from 'lodash'

import { addItemToFavs, confirmActive, ensureUserHasCollection } from '../src/actions'
import { isCollectionList, isListItem } from '../src/helpers'
import {
  activeListItem, collectionListSelector, collections, getItemId, favListElements,
  listItemSelector, userCollections, userHasCollections,
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
test('listItemSelector', (t) => {
  // When nothing is found.
  t.equal(listItemSelector(getState()), undefined)
  const collection = ensureUserHasCollection()(dispatch, getState)
  t.ok(isCollectionList(collection))
  const listItemTriple = addItemToFavs(sailboat)(dispatch, getState)
  t.equal(listItemTriple.subject.id, collection.id, 'collection is subject')
  const listItem = listItemTriple.object
  t.ok(isListItem(listItem), 'isListItem')
  const listItems = listItemSelector(getState())
  t.equal(size(listItems), 1)
  t.deepEqual(listItems[listItem.id], listItem)
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
