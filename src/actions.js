import {
  cond, constant, find, flow, negate, noop, over, partial, partialRight, property, size, stubTrue,
} from 'lodash'
import { eq } from 'lodash/fp'
import { selectorCreate, entityUpdate } from 'redux-graph'
import { isAnonymous } from 'cape-redux-auth'
import { createAction, thunkSelect } from 'cape-redux'

import { collectionListBuilder, listItemBuilder, endListItem } from './entity'
import { activeListItem, favsListSelector, itemLists, userHasCollections } from './select'

// Create an action that will update a ListItem as confirmed.
export function confirmFavorite({ id, type }) {
  // Including type for good practice.
  return entityUpdate({ id, actionStatus: 'confirmed', dateUpdated: new Date(), type })
}
// Find open item and close it via confirmFavorite action.
export function confirmActive(dispatch, getState) {
  const itemToConfirm = activeListItem(getState())
  if (itemToConfirm) dispatch(confirmFavorite(itemToConfirm))
}
// Create favs collection for user.
export const userNeedsCollection = negate(thunkSelect(userHasCollections))

export const createCollectionList = flow(collectionListBuilder, selectorCreate)

// Make sure the user has a favs collection created. Returns created entity or undefined.
export function ensureUserHasCollection(buildCollectionList = {}) {
  return cond([
    [ userNeedsCollection, createCollectionList(buildCollectionList) ],
  ])
}
export function shouldEndItem(item) {
  return flow(thunkSelect(itemLists, { item }), size, eq(1))
}

export const endAction = partialRight(flow, endListItem, entityUpdate)
export const bindEndAction = partial(flow, endAction())
export const endFavAction = endAction(itemLists, find)
export function endFavorite(item) {
  return (dispatch, getState) => flow(endFavAction, dispatch)(getState(), { item })
}
// We know user has a favs collection. Create new listItem for favs collection.
export function addItemToFavs(item, position = 100) {
  return cond([
    [ shouldEndItem(item), endFavorite(item) ],
    [ stubTrue, selectorCreate(listItemBuilder(favsListSelector, { item, position })) ],
  ])
}

export const CLOSE = 'collection/CLOSE'
export const close = createAction(CLOSE, noop)

// When user is adding to a specific collection.
export function addItemToCollection(collection, item) {
  return constant(over(
    selectorCreate(listItemBuilder(collection, { item })),
    dispatch => dispatch(close())
  ))
}

// REDUCER ACTIONS

export const ITEM = 'collection/ITEM'
// Send it an item object that has an id property.
export const open = createAction(ITEM, property('id'))
export const isAnon = thunkSelect(isAnonymous)

// Create new list item.
// Anon user. Create new collection & listItem.
// Need to decide if we add to favs or display option to create project.
export function addOrOpen(item) {
  return cond([
    [ isAnon, addItemToFavs(item) ],
    [ stubTrue, dispatch => dispatch(open(item)) ],
  ])
}

// Action to dispatch when a user clicks the (+) favorite button.
// Requires thunk middleware.
export function editItemCollections(createFavObj, item) {
  return over(confirmActive, ensureUserHasCollection(createFavObj), addOrOpen(item))
}

export const COLLECTION = 'collection/COLLECTION'
export const LISTITEM = 'collection/LISTITEM'
