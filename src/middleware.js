import { isFunction, omit } from 'lodash'
import { entityPut, entityUpdate, triplePut } from 'redux-graph'
import { CREATE_LIST, CREATE_ITEM, UPDATE_ITEM } from './actions'
import { PREDICATE } from './const'

export const dispatcher = {
  [CREATE_LIST]: entityPut,
  // [CREATE_ITEM]: entityPut,
  [UPDATE_ITEM]: entityUpdate,
}

export function entityMiddleware() {
  return next => (action) => {
    if (isFunction(dispatcher[action.type])) {
      return next(dispatcher[action.type](action.payload))
    }
    if (action.type === CREATE_ITEM) {
      const item = next(entityPut(omit(action.payload, 'mainEntity')))
      next(triplePut({
        subject: action.payload.mainEntity, predicate: PREDICATE, object: item.payload,
      }))
      return item
    }
    return next(action)
  }
}
