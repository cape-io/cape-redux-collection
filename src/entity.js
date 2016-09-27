import { collectionType, liType } from './const'

// Describe the list.
export function createCollectionList(agent, creator, mainEntity, title) {
  return {
    additionalType: 'ProjectDelanyLong',
    agent,
    creator, // User that created the thing.
    itemListOrder: 'Ascending',
    mainEntity, // List of what.
    title,
    type: collectionType,
  }
}

export function createCollectionItem(item, agent, position = 100) {
  return {
    actionStatus: 'created',
    agent,
    item, // Thing that the user is adding to the collection.
    position,
    startTime: new Date(),
    type: liType,
  }
}
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
