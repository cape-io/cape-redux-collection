import { cond, negate, over, property, stubTrue } from 'lodash'
import { selectorCreate, createTriple, entityUpdate } from 'redux-graph'
import { isAnonymous, selectUser } from 'cape-redux-auth'
import { createAction, thunkSelect } from 'cape-redux'

import { collectionListBuilderDefault, createCollectionItemTriple, endListItem } from './entity'
import { favsListSelector, itemListCreated, userHasCollections } from './select'

export function confirmFavorite(id) {
  return entityUpdate({ id, actionStatus: 'confirmed', dateUpdated: new Date() })
}
export function confirmActive(dispatch, state) {
  const itemToConfirm = itemListCreated(state)
  if (itemToConfirm) dispatch(confirmFavorite(itemToConfirm.id))
}
// Create favs collection for user.
export const userNeedsCollection = negate(thunkSelect(userHasCollections))

// Make sure the user has a favs collection created.
export function ensureUserHasCollection(buildCollectionList = collectionListBuilderDefault) {
  return cond([ [ userNeedsCollection, selectorCreate(buildCollectionList) ] ])
}
// We know user has a favs collection. Create new listItem for favs collection.
export function addItemToFavs(item, user) {
  return (dispatch, getState) => {
    const state = getState()
    const usr = user || selectUser(state)
    const triple = createCollectionItemTriple(favsListSelector(state), item, usr)
    createTriple(dispatch, triple)
  }
}

export const ITEM = 'collection/ITEM'
export const openItem = createAction(ITEM, property('id'))
// Create new list item.
// Anon user. Create new collection & listItem.
// Need to decide if we add to favs or display option to create project.
export function addOrOpen(item) {
  return cond([
    [ thunkSelect(isAnonymous), addItemToFavs(item) ],
    [ stubTrue, dispatch => dispatch(openItem(item)) ],
  ])
}
// Action to dispatch when a user clicks the (+) favorite button.
export function editItemCollections(createFavObj, item) {
  return over(ensureUserHasCollection(createFavObj), addOrOpen(item))
}

export function endFavorite(id) {
  return entityUpdate(endListItem(id))
}

export const CLOSE = 'collection/CLOSE'
export const COLLECTION = 'collection/COLLECTION'
export const LISTITEM = 'collection/LISTITEM'
