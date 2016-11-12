// import { entityHasType } from 'redux-graph'
import {
  conforms, includes, isDate, isNumber, isString, matchesProperty, negate, partial,
} from 'lodash'
import { eq } from 'lodash/fp'
import {
  ASC, COLLECTION_TYPE, CONFIRMED, CREATED, DESC, ENDED, FAV_TITLE, LIST_ITEM,
} from './const'

export const validSortOpts = partial(includes, [ ASC, DESC ])
export const isCollectionList = conforms({
  dateCreated: isDate,
  id: isString,
  itemListOrder: validSortOpts,
  type: eq(COLLECTION_TYPE),
  title: isString,
})
export const validStatusOpts = partial(includes, [ CREATED, CONFIRMED ])
export const isListItem = conforms({
  actionStatus: validStatusOpts,
  startTime: isDate,
  type: eq(LIST_ITEM),
  position: isNumber,
  dateCreated: isDate,
  id: isString,
})
export const isActionEnded = matchesProperty('actionStatus', ENDED)
// Valid unless ended/removed.
export const isValidListItem = negate(isActionEnded)

// Is the CollectionList the default favorite one?
export const isFavList = matchesProperty('title', FAV_TITLE)
