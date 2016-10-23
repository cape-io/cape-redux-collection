import { entityHasType } from 'redux-graph'
import { matchesProperty, negate } from 'lodash'

import { COLLECTION_TYPE, FAV_TITLE } from './const'

export const isValidCollection = entityHasType(COLLECTION_TYPE)
export const isActionEnded = matchesProperty('actionStatus', 'ended')
// Valid unless ended/removed.
export const isValidListItem = negate(isActionEnded)
// Is the CollectionList the default favorite one?
export const isFavList = matchesProperty('title', FAV_TITLE)
