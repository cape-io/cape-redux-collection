import curry from 'lodash/curry'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import set from 'lodash/set'

export const predicateValueIdMatches = curry((entity, predicateValues) =>
  get(predicateValues, [ entity.id, 'id' ]) === entity.id
)
export function collectionReduceFilter(predicate, entity) {
  return (res, item, key) =>
    predicateValueIdMatches(entity, item[predicate]) && set(res, key, item) || res
}
export const predicateValueContains = curry((predicate, collection, entity) =>
  reduce(collection, collectionReduceFilter(predicate, entity), {})
)
