import { key0, val0 } from 'redux-graph'
import { get, mapValues, reduce, set } from 'lodash'
import { find, keyBy, orderBy } from 'lodash/fp'

import { CREATED, PREDICATE } from './const'
import { isValidListItem } from './lang'

// Returns first found item that is created.
export const findActionCreated = find({ actionStatus: CREATED })

// Reducer to replace the items with filled versions. Filters out the invalids.
export function fixListItem(items) {
  return (res, listItem, key) => {
    if (!isValidListItem(listItem)) return res
    // Use first object key to get filled entity.
    const itemId = key0(listItem.item)
    const item = get(items, itemId, listItem.item[itemId])
    return set(res, key, listItem.set('item', item))
  }
}
// listItems is an object.
export function fixListItems(listItems, items) {
  if (!listItems) return listItems
  return reduce(listItems, fixListItem(items), {})
}
export const listItemIndex = keyBy('item.id')
export const orderListItems = orderBy([ 'position', 'item.id' ], 'asc')

export function getLiCollection(listItem) {
  return val0(listItem.domainIncludes[PREDICATE])
}
export function setLiCollection(listItem) {
  return listItem.set('collection', getLiCollection(listItem)).without('domainIncludes')
}
// Move domainIncludes.PREDICATE to collection.
export function setListItemsCollection(listItems) {
  return mapValues(listItems, setLiCollection)
}
export function invertLiCollection(res, { collection, ...listItem }) {
  return set(res, collection.id, collection.set(PREDICATE, listItem))
}
// Invert from list -> collection to collection -> list
export function invertListItems(lists) {
  return lists ? reduce(lists, invertLiCollection, {}) : null
}
