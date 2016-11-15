import {
  constant, flow, isUndefined, noop, now, nthArg, over, spread,
} from 'lodash'
import { omitBy } from 'lodash/fp'
import { createObj } from 'cape-lodash'
import { createAction, selectorAction, thunkAction } from 'cape-redux'
import { structuredSelector } from 'cape-select'
import { isAnonymous } from 'cape-redux-auth'
import { requireIdType } from '@kaicurry/redux-graph'
import { collectionListBuilder, listItemBuilder } from './entity'
import {
  activeListItem, favsListSelector, itemFavItem, userNeedsCollection,
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

export const CLOSE = 'collection/CLOSE'
// Close edit dialog.
export const close = createAction(CLOSE, noop)

export const UPDATE_ITEM = 'collection/UPDATE_ITEM'

// Create an action that will update a ListItem as confirmed.
export function confirmItemPayload(props) {
  return { ...requireIdType(props, LIST_ITEM), actionStatus: CONFIRMED, dateUpdated: now() }
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

export function endItemPayload(props) {
  requireIdType(props, LIST_ITEM)
  return { ...props, actionStatus: ENDED, endTime: now() }
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
  const actions = []
  if (activeListItem(state)) actions.push(confirmActive(state))
  // Make sure the user has a favs collection created. Returns created entity or undefined.
  if (userNeedsCollection(state)) actions.push(createList()(state))
  return actions
}
export function toggleActionAnon(state, item) {
  // Is the item in the favs collection?
}
// Anon user. Create new collection & listItem.
// Need to decide if we add to favs or display option to create project.
function addOrOpenAction([ isAnon, favItem, item ]) {
  if (isAnon) {
    // We know user has a favs collection. Create new listItem or remove from favs collection.
    return favItem ? endItem(favItem) : createItem({ item, mainEntity: favsListSelector })
  }
  return open(item)
}
const addOrOpen = flow(over(
  isAnonymous,
  flow(over(nthArg(0), flow(nthArg(2), createObj('item')), spread(itemFavItem))), // itemInFavs
  flow(nthArg(2), requireIdType), // Get item.
), addOrOpenAction)

// Decides what to do when a user clicks the (+) favorite button on item that can be in list.
// toggle(listProps, item) - state is added as first arg by thunkAction()
export const toggle = thunkAction(
  toggleActionPrep,
  addOrOpen,
  (actions, toggleAction) => actions.concat(toggleAction),
)
