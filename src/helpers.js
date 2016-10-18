import { key0, val0 } from 'redux-graph'
import {
  conforms, get, isDate, isNumber, isString, keyBy, mapValues, orderBy, reduce, set,
} from 'lodash'
import { eq, find } from 'lodash/fp'

import { isValidListItem } from './lang'

export const findActionCreated = find({ actionStatus: 'created' })

// Reducer to replace the items with filled versions. Filters out the invalids.
export function fixListItem(items) {
  return (res, listItem, key) => {
    if (!isValidListItem(listItem)) return res
    // Use first object key to get filled entity.
    const item = get(listItem.item, key0(items))
    return set(res, key, listItem.set('item', item))
  }
}
// listItems is an object.
export function fixListItems(listItems, items) {
  if (!listItems) return listItems
  return reduce(listItems, fixListItem(items), {})
}
export function listItemIndex(listItems) { return keyBy(listItems, 'item.id') }
export function orderListItems(listItems) {
  return orderBy(listItems, [ 'position', 'id' ])
}
export function getLiCollection(listItem) {
  return val0(listItem.domainIncludes.itemListElement)
}
export function setLiCollection(listItem) {
  return listItem.set('collection', getLiCollection(listItem)).without('domainIncludes')
}
// Move domainIncludes.itemListElement to collection.
export function setListItemsCollection(listItems) {
  return mapValues(listItems, setLiCollection)
}
export function invertLiCollection(res, { collection, ...listItem }) {
  return set(res, collection.id, collection.set('itemListElement', listItem))
}
// Invert from list -> collection to collection -> list
export function invertListItems(lists) {
  return lists ? reduce(lists, invertLiCollection, {}) : null
}
export const isListItem = conforms({
  actionStatus: eq('created'),
  startTime: isDate,
  type: eq('ListItem'),
  position: isNumber,
  dateCreated: isDate,
  id: isString,
})
