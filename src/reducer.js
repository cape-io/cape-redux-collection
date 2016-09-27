import { constant } from 'lodash'
import { createReducer, set } from 'cape-redux'
import { CLOSE, COLLECTION, ITEM, LISTITEM } from './actions'

export const defaultState = {
  item: null,
  collection: null,
  listItem: null,
}

export const reducers = {
  [CLOSE]: constant(defaultState),
  [COLLECTION]: set('collection'),
  [ITEM]: set('item'),
  [LISTITEM]: set('listItem'),
}
const reducer = createReducer(reducers, defaultState)
export default reducer
