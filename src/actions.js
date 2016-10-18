import { cond, negate, noop, over, property, stubTrue } from 'lodash'
import { selectorCreate, entityUpdate } from 'redux-graph'
import { isAnonymous } from 'cape-redux-auth'
import { createAction, thunkSelect } from 'cape-redux'

import { collectionListBuilder, listItemBuilder, endListItem } from './entity'
import { favsListSelector, itemListCreated, userHasCollections } from './select'

// Create an action that will update a ListItem as confirmed.
export function confirmFavorite(id) {
  return entityUpdate({ id, actionStatus: 'confirmed', dateUpdated: new Date() })
}
export function confirmActive(dispatch, getState) {
  const itemToConfirm = itemListCreated(getState())
  if (itemToConfirm) dispatch(confirmFavorite(itemToConfirm.id))
}
// Create favs collection for user.
export const userNeedsCollection = negate(thunkSelect(userHasCollections))

// Make sure the user has a favs collection created. Returns created entity or undefined.
export function ensureUserHasCollection(buildCollectionList = {}) {
  const entitySelector = collectionListBuilder(buildCollectionList)
  return cond([
    [ userNeedsCollection, selectorCreate(entitySelector) ],
  ])
}

// We know user has a favs collection. Create new listItem for favs collection.
export function addItemToFavs(item) {
  return selectorCreate(listItemBuilder(favsListSelector, { item }))
}

export function endFavorite(id) {
  return entityUpdate(endListItem(id))
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
export function editItemCollections(createFavObj, item) {
  return over(ensureUserHasCollection(createFavObj), addOrOpen(item))
}

export const CLOSE = 'collection/CLOSE'
export const close = createAction(CLOSE, noop)
export const COLLECTION = 'collection/COLLECTION'
export const LISTITEM = 'collection/LISTITEM'
