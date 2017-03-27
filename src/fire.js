import { CREATE_LIST, CREATE_ITEM, UPDATE_ITEM } from './actions'
import { createItem, updateItem, createList } from './entityUpdate'

export const reduxFireDispatcher = {
  [CREATE_LIST]: createList,
  [CREATE_ITEM]: createItem,
  [UPDATE_ITEM]: updateItem,
}
