import { handleEntityPut } from 'cape-firebase'

import { CREATE_LIST, CREATE_ITEM, UPDATE_ITEM } from './actions'
import { createItem, updateItem } from './entityUpdate'

export const reduxFireDispatcher = {
  [CREATE_LIST]: handleEntityPut,
  [CREATE_ITEM]: createItem,
  [UPDATE_ITEM]: updateItem,
}
