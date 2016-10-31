import { flow, isFunction } from 'lodash'
import { merge } from 'cape-redux'
import { getProps, select, structuredSelector } from 'cape-select'
import { selectUser } from 'cape-redux-auth'

import { COLLECTION_TYPE, FAV_TITLE, LIST_ITEM, PREDICATE } from './const'

export function collectionList(props) {
  return {
    dateCreated: new Date(),
    itemListOrder: 'Ascending',
    type: COLLECTION_TYPE,
    ...props,
  }
}
// Gep props.title or return FAV_TITLE default.
export const getTitle = select(getProps, 'title', FAV_TITLE)
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

export function collectionItem(props) {
  return {
    actionStatus: 'created',
    startTime: new Date(),
    type: LIST_ITEM,
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
// @listSelector: The project/collection this item is being added/attached to.
// @return: function selector builds triple with object entity object.
export function listItemBuilder(listOrSelector, selectorObj = {}) {
  // if (!isFunction(listOrSelector)) throw new Error('listSelector must be a function.')
  return structuredSelector({
    // Create the ListItem.
    object: structuredSelector(collectionItem(merge(listItemDefaults, selectorObj))),
    // The item is attached to the list by adding an itemListElement predicate triple.
    subject: listOrSelector,
    predicate: PREDICATE,
  })
}
export function endListItem({ id, type }) {
  if (type !== LIST_ITEM) throw new Error('Type prop mus match.')
  return { actionStatus: 'ended', endTime: new Date(), id, type }
}
