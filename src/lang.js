// import { entityHasType } from 'redux-graph'
import {
  ary, conforms, includes, isNumber, isString, matchesProperty,
  negate, overSome, partial, partialRight,
} from 'lodash'
import { eq } from 'lodash/fp'
import { getRef } from '@kaicurry/redux-graph'
import {
  ASC, COLLECTION_TYPE, CONFIRMED, CREATED, DESC, ENDED, FAV_TITLE, LIST_ITEM,
} from './const'

export const validSortOpts = partial(includes, [ ASC, DESC ])
export const isCollectionList = conforms({
  dateCreated: isNumber,
  id: isString,
  itemListOrder: validSortOpts,
  type: eq(COLLECTION_TYPE),
  title: isString,
})
export const validStatusOpts = partial(includes, [ CREATED, CONFIRMED ])
export const isListItem = conforms({
  actionStatus: validStatusOpts,
  startTime: isNumber,
  type: eq(LIST_ITEM),
  position: isNumber,
  dateCreated: isNumber,
  id: isString,
})
export const noItemRef = negate(ary(partialRight(getRef, 'item'), 1))
export const isActionEnded = overSome(
  matchesProperty('actionStatus', ENDED),
  noItemRef
)
// Valid unless ended/removed.
export const isValidListItem = negate(isActionEnded)

// Is the CollectionList the default favorite one?
export const isFavList = matchesProperty('title', FAV_TITLE)
