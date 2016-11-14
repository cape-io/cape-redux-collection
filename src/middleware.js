import { isFunction } from 'lodash'
import { entityPut, entityUpdate } from '@kaicurry/redux-graph'
import { CREATE_LIST, CREATE_ITEM, UPDATE_ITEM } from './actions'

export const dispatcher = {
  [CREATE_LIST]: entityPut,
  [CREATE_ITEM]: entityPut,
  [UPDATE_ITEM]: entityUpdate,
}

export function entityMiddleware() {
  return next => (action) => {
    if (isFunction(dispatcher[action.type])) {
      return next(dispatcher[action.type](action.payload))
    }
    return next(action)
  }
}
