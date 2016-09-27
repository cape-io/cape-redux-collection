import { create, createTriple, entityUpdate } from 'redux-graph'
import { isAnonymous } from 'cape-redux-auth'

import { getUser } from '../select/user'
import { createCollectionItemTriple, endListItem } from './entity'
import {
  buildCollectionList, favsListSelector, itemListCreated, userHasCollections,
} from './select'

export function confirmFavorite(id) {
  return entityUpdate({ id, actionStatus: 'confirmed', dateUpdated: new Date() })
}
export function confirmActive(state, dispatch) {
  const itemToConfirm = itemListCreated(state)
  if (itemToConfirm) dispatch(confirmFavorite(itemToConfirm.id))
}
// Create favs collection for user.
export function createUserFavCollection(dispatch, getState) {
  return create(dispatch, buildCollectionList(getState()))
}
// Make sure the user has a favs collection created.
export function ensureUserHasCollection(dispatch, getState) {
  return !userHasCollections(getState()) && createUserFavCollection(dispatch, getState)
}
// We know user is anon and has a favs collection. Create new listItem for favs collection.
export function addItemToFavs(item) {
  return (dispatch, getState) => {
    const state = getState()
    const triple = createCollectionItemTriple(favsListSelector(state), item, getUser(state))
    createTriple(dispatch, triple)
  }
}
// Create new list item.
// Anon user. Create new collection & listItem.

// Action to dispatch when a user clicks the (+) favorite button.
export function editItemCollections(item) {
  return (dispatch, getState) => {
    ensureUserHasCollection(dispatch, getState)
    const state = getState()
    // Need to decide if we add to favs or display option to create project.
    if (isAnonymous(state)) {
      addItemToFavs(item)(dispatch, getState)
    }
  }
}

export function endFavorite(id) {
  return entityUpdate(endListItem(id))
}

export const CLOSE = 'collection/CLOSE'
export const COLLECTION = 'collection/COLLECTION'
export const ITEM = 'collection/ITEM'
export const LISTITEM = 'collection/LISTITEM'
