import {
  constant, flow, noop, now, nthArg, over, spread,
} from 'lodash'
import { pick } from 'lodash/fp'
import { createObj } from 'cape-lodash'
import { createAction, selectorAction, thunkAction } from 'cape-redux'
import { isAnonymous } from 'cape-redux-auth'
import { requireIdType } from '@kaicurry/redux-graph'
import { collectionListBuilder, listItemBuilder } from './entity'
import {
  activeListItem, favsListSelector, itemFavItem, userNeedsCollection,
} from './select'
import { CONFIRMED, ENDED, LIST_ITEM } from './const'

export const CLOSE = 'collection/CLOSE'
// Close edit dialog.
export const close = createAction(CLOSE, noop)

const meta = flow(createObj('action'), constant)
export const UPDATE_ITEM = 'collection/UPDATE_ITEM'

// Create an action that will update a ListItem as confirmed.
export function confirmItemPayload(props) {
  requireIdType(props, LIST_ITEM)
  return { ...props, actionStatus: CONFIRMED, dateUpdated: now() }
}
export const confirmItem = createAction(UPDATE_ITEM, confirmItemPayload, meta('CONFIRM_ITEM'))

export const CREATE_ITEM = 'collection/CREATE_ITEM'
// When user is adding to a specific collection. Create new ListItem entity.
export const createItem = selectorAction(CREATE_ITEM, listItemBuilder)

export const CREATE_LIST = 'collection/CREATE_LIST'
export const createList = selectorAction(CREATE_LIST, collectionListBuilder)

export function endItemPayload(props) {
  requireIdType(props, LIST_ITEM)
  return { ...props, actionStatus: ENDED, endTime: now() }
}
export const endItem = createAction(UPDATE_ITEM, endItemPayload, meta('END_ITEM'))

// Find created/open item and close it via confirmFavorite action.
export const confirmActivePayload = flow(activeListItem, requireIdType, confirmItemPayload)
export const confirmActive = createAction(UPDATE_ITEM, confirmActivePayload, meta('CONFIRM_ACTIVE'))

export const OPEN = 'collection/OPEN'
// Open edit dialog. Send it an item object that has an id property.
export const open = createAction(OPEN, requireIdType)

// TOGGLE
function actionPrepActions([ activeLI, needsList, listProps ]) {
  const actions = []
  if (activeLI) actions.push(confirmActive())
  // Make sure the user has a favs collection created. Returns created entity or undefined.
  if (needsList) actions.push(createList(listProps))
  return actions
}
const actionPrep = flow(over(activeListItem, userNeedsCollection, nthArg(1)), actionPrepActions)

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
  actionPrep,
  addOrOpen,
  (actions, toggleAction) => actions.concat(toggleAction),
)
