import { flow, partial, set } from 'lodash'
import { merge } from 'cape-redux'
import { getProps, select, structuredSelector } from 'cape-select'
import { selectUser } from 'cape-redux-auth'

import { collectionType, favTitle, liType } from './const'

export function collectionList(props) {
  return {
    dateCreated: new Date(),
    itemListOrder: 'Ascending',
    type: collectionType,
    ...props,
  }
}
// Gep props.title or return favTitle default.
export const getTitle = select(getProps, 'title', favTitle)
export const listCreatorTitle = {
  creator: selectUser, // User that created the thing.
  title: getTitle, // Title for this CollectionList.
}
// Create a new Favs list for the user. Returns selector.
export function collectionListBuilder(selectorObj = {}) {
  return flow(structuredSelector(merge(listCreatorTitle, selectorObj)), collectionList)
}
export const collectionListBuilderDefault = collectionListBuilder()

// Describe the list.
//   agent,
//   creator,
//   mainEntity, // List of what.
//   title,
// export const createCollectionList = merge(collectionList)

export function collectionItem(props) {
  return {
    actionStatus: 'created',
    startTime: new Date(),
    type: liType,
    position: 100,
    ...props,
  }
}

// agent,
// item, // Thing that the user is adding to the collection.
// position,
const listItemDefaults = {
  agent: selectUser,
}

// Adding an item to a list requires a new triple. Adding a field value to the collection.
// @list: The project/collection this item is being added/attached to.
export function listItemBuilder(listSelector, selectorObj = {}) {
  return {
    // Create the ListItem.
    object: flow(structuredSelector(merge(listItemDefaults, selectorObj)), collectionItem),
    // The item is attached to the list by adding an itemListElement predicate triple.
    subject: listSelector,
    predicate: 'itemListElement',
  }
}
export function endListItem(id) {
  return { id, actionStatus: 'ended', endTime: new Date() }
}
