import { val0 } from '@kaicurry/redux-graph'
import { mapValues } from 'lodash'
import { find, keyBy, orderBy } from 'lodash/fp'

import { CREATED, PREDICATE } from './const'

// Returns first found item that is created.
export const findActionCreated = find({ actionStatus: CREATED })


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
