import { entityHasType } from 'redux-graph'
import {
  conforms, eq, includes, isDate, isNumber, isString, matchesProperty, negate, partial,
} from 'lodash'

import { COLLECTION_TYPE, FAV_TITLE, LIST_ITEM } from './const'

export const validSortOpts = partial(includes, [ 'Ascending', 'Descending' ])
export const isCollectionList = conforms({
  dateCreated: isDate,
  id: isString,
  itemListOrder: validSortOpts,
  type: eq(COLLECTION_TYPE),
  title: isString,
})
export const validStatusOpts = partial(includes, [ 'created', 'confirmed' ])
export const isListItem = conforms({
  actionStatus: validStatusOpts,
  startTime: isDate,
  type: eq(LIST_ITEM),
  position: isNumber,
  dateCreated: isDate,
  id: isString,
})
export const isActionEnded = matchesProperty('actionStatus', 'ended')
// Valid unless ended/removed.
export const isValidListItem = negate(isActionEnded)

// Is the CollectionList the default favorite one?
export const isFavList = matchesProperty('title', FAV_TITLE)
