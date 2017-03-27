import {
  constant, flow, isUndefined, noop, now,
} from 'lodash'
import { omitBy } from 'lodash/fp'
import { createObj } from 'cape-lodash'
import { createAction } from 'cape-redux'
import { structuredSelector } from 'cape-select'
import { isAnonymous } from 'cape-redux-auth'
import { requireIdType } from 'redux-graph'
import { collectionListBuilder, listItemBuilder } from './entity'
import {
  activeListItem, favsListSelector, findItemInFavs, userNeedsCollection,
} from './select'
import { CONFIRMED, ENDED, LIST_ITEM } from './const'

const meta = flow(createObj('action'), constant)
export function payloadSelectorAction(type, payloadSelector) {
  return (...args) => flow(structuredSelector({
    type,
    payload: payloadSelector(...args),
  }), omitBy(isUndefined))
}
export function thunkify(actionSelector) {
  return (dispatch, getState) => dispatch(actionSelector(getState()))
}

// Close edit dialog.
export const CLOSE = 'collection/CLOSE'
export const close = createAction(CLOSE, noop)
// Open edit list.
export const COLLECTION = 'collection/COLLECTION'
export const editCollection = createAction(COLLECTION)
// Open edit list item.
export const LISTITEM = 'collection/LISTITEM'
export const editListItem = createAction(LISTITEM)

export const UPDATE_ITEM = 'collection/UPDATE_ITEM'

// Create an action that will update a ListItem as confirmed.
export function confirmItemPayload(props) {
  return { ...requireIdType(props, LIST_ITEM), actionStatus: CONFIRMED, dateModified: now() }
}
export const confirmItem = createAction(UPDATE_ITEM, confirmItemPayload, meta('CONFIRM_ITEM'))

export const CREATE_ITEM = 'collection/CREATE_ITEM'
// When user is adding to a specific collection. Create new ListItem entity.
export const createItem = payloadSelectorAction(CREATE_ITEM, listItemBuilder)
export const createItemThunk = flow(createItem, thunkify)

// Calling with no args will create a Favs list. Returns thunk because we need a getState().
export const CREATE_LIST = 'collection/CREATE_LIST'
export const createList = payloadSelectorAction(CREATE_LIST, collectionListBuilder)
export const createListThunk = flow(createList, thunkify)

export function endItemPayload({ id }) {
  return { actionStatus: ENDED, endTime: now(), id, type: LIST_ITEM }
}
export const endItem = createAction(UPDATE_ITEM, endItemPayload, meta('END_ITEM'))

// Find created/open item and close it via confirmFavorite action.
export const confirmActivePayload = flow(activeListItem, confirmItemPayload)
export const confirmActive = structuredSelector({
  type: UPDATE_ITEM,
  payload: confirmActivePayload,
  meta: { action: 'CONFIRM_ACTIVE' },
})
export const confirmActiveThunk = constant(thunkify(confirmActive))

export const OPEN = 'collection/OPEN'
// Open edit dialog. Send it an item object that has an id property.
export const open = createAction(OPEN, requireIdType)

// TOGGLE
export function toggleActionPrep(state) {
  // Make sure the user has a favs collection created. Returns created entity or undefined.
  if (userNeedsCollection(state)) return createList()(state)
  if (activeListItem(state)) return confirmActive(state)
  return null
}
// If in favs remove it. Otherwise add it.
export function toggleActionAnon(state, item) {
  // Is the item in the favs collection?\
  const list = findItemInFavs(state, { item })
  if (list) return endItem(list)
  return createItem({ item, mainEntity: favsListSelector })(state)
}
// Anon user. Create new collection & listItem.
// Need to decide if we add to favs or display option to create project.
export function addOrOpen(state, item) {
  // We know user has a favs collection. Create new listItem or remove from favs collection.
  if (isAnonymous(state)) return toggleActionAnon(state, item)
  return open(item)
}

// Decides what to do when a user clicks the (+) favorite button on item that can be in list.
// toggle(listProps, item) - state is added as first arg by thunkAction()
export function toggle(item) {
  return (dispatch, getState) => {
    const prepAction = toggleActionPrep(getState())
    if (prepAction) dispatch(prepAction)
    const addOpenItem = addOrOpen(getState(), item)
    console.log(item)
    return dispatch(addOpenItem)
  }
}
