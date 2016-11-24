// import { entityHasType } from 'redux-graph'
import {
  ary, conforms, includes, isNumber, isString, matchesProperty,
  negate, overEvery, partial, partialRight,
} from 'lodash'
import { eq } from 'lodash/fp'
import { getRef } from 'redux-graph'
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

export const isActionEnded = matchesProperty('actionStatus', ENDED)

export const getItemRef = ary(partialRight(getRef, 'item'), 1)
// Valid unless ended/removed.
export const isValidListItem = overEvery(
  negate(isActionEnded),
  getItemRef
)
// Is the CollectionList the default favorite one?
export const isFavList = matchesProperty('title', FAV_TITLE)
