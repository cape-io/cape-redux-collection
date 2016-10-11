import { merge } from 'cape-redux'
import { collectionType, liType } from './const'

export const collectionList = {
  additionalType: 'ProjectDelanyLong',
  itemListOrder: 'Ascending',
  type: collectionType,
}

// Describe the list.
//   agent,
//   creator, // User that created the thing.
//   mainEntity, // List of what.
//   title,
export const createCollectionList = merge(collectionList)

export const collectionItem = {
  actionStatus: 'created',
  startTime: new Date(),
  type: liType,
  position: 100,
}

// agent,
// item, // Thing that the user is adding to the collection.
// position,
export const createCollectionItem = merge(collectionItem)

// Adding an item to a list requires a new triple. Adding a field value to the collection.
// @list: The project/collection this item is being added/attached to.
export function createCollectionItemTriple(list, item, agent, position) {
  // Create the ListItem.
  const object = createCollectionItem(item, agent, position)
  // The item is attached to the list by adding an itemListElement predicate triple.
  return { subject: list, predicate: 'itemListElement', object }
}
export function endListItem(id) {
  return { id, actionStatus: 'ended', endTime: new Date() }
}
