import { constant } from 'lodash'
import { createReducer } from 'cape-redux'
import { set } from 'cape-lodash'
import { CLOSE, COLLECTION, LISTITEM, OPEN } from './actions'

export const defaultState = {
  item: null,
  collection: null,
  listItem: null,
}

export const reducers = {
  [CLOSE]: constant(defaultState),
  [COLLECTION]: set('collection'),
  [LISTITEM]: set('listItem'),
  [OPEN]: set('item'),
}
const reducer = createReducer(reducers, defaultState)
export default reducer
