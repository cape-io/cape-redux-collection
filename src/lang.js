import { entityHasType } from 'redux-graph'
import { matchesProperty, negate } from 'lodash'

import { collectionType, favTitle } from './const'

export const isValidCollection = entityHasType(collectionType)
export const isActionEnded = matchesProperty('actionStatus', 'ended')
// Valid unless ended/removed.
export const isValidListItem = negate(isActionEnded)
// Is the CollectionList the default favorite one?
export const isFavList = matchesProperty('title', favTitle)
