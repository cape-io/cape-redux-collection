import {
  curry, identity, flow, has, mapValues, negate, over,
  pick, property, rearg, spread,
} from 'lodash'
import { find, groupBy, keyBy, map, omitBy, pickBy } from 'lodash/fp'
import { createSelector, createStructuredSelector } from 'reselect'
import { boolSelector, getProps, getSelect, select, simpleSelector } from 'cape-select'
import { set } from 'cape-redux'
import { selectUser } from 'cape-redux-auth'
import {
  allChildrenSelector, entityMatch, entityTypeSelector, getKey, getRef, predicateFilter,
} from 'redux-graph'
// import { getDataFeed, getWebApp } from '../select'
// import { itemsFilled } from '../select/items'

import { findActionCreated } from './helpers'
import { getItemRef, isActionEnded, isFavList, isValidListItem } from './lang'
import { COLLECTION_TYPE, LIST_ITEM, PREDICATE } from './const'

export const fpGetRef = curry(rearg(getRef, [1, 0]), 2)
export const getPropsItem = select(getProps, 'item')
export const propsItemKey = simpleSelector(getPropsItem, getKey)

// Redux Collection State
export const getCollectionState = property('collection')
export const getActiveItem = select(getCollectionState, 'item')
export const getActiveCollection = select(getCollectionState, 'collection')
export const getActiveListItem = select(getCollectionState, 'listItem')

// COLLECTIONS

// Select all CollectionList entities from the database.
export const collectionListSelector = entityTypeSelector(COLLECTION_TYPE)
// export const collections = rebuildEntitiesSelector(collectionListSelector)

// LIST ITEM

// Select all ListItem entities.
export const listItemSelector = entityTypeSelector(LIST_ITEM)
// Gets currently active ListItem.
export const activeListItem = createSelector(listItemSelector, findActionCreated)
// export const activeListItemList = flow(
//   activeListItem, property('rangeIncludes')
// )
export const activeListItemFull = allChildrenSelector(activeListItem)

export const activeListItems = createSelector(listItemSelector, pickBy(isValidListItem))
export const listItemsByItem = createSelector(
  activeListItems,
  groupBy(listItem => getKey(getItemRef(listItem)))
)
export const itemCollections = getSelect(listItemsByItem, propsItemKey)
export const getListCollectionId = flow(
  property([ 'rangeIncludes', PREDICATE ]), find(identity), property('id')
)
export const itemCollectionsHash = createSelector(itemCollections, keyBy(getListCollectionId))

// USER COLLECTIONS - No props needed.
// Find user collections. Returns empty object when nothing found.
export const userCollections = createSelector(
  selectUser, collectionListSelector, predicateFilter('creator')
)
// Add field to collections if the item is in it.
export const userCollectionsItem = createSelector(
  userCollections, itemCollectionsHash,
  (collections, itemHash) =>
    mapValues(collections, (collection, id) =>
      set('itemListId', collection, (has(itemHash, id) && itemHash[id].id) || null)
    )
)

export const userHasCollections = boolSelector(userCollections)
export const userNeedsCollection = negate(userHasCollections)
// Find (first) user favs project from list entities.
export const favsListSelector = createSelector(userCollections, find(isFavList))
// CollectionList id of user favs.
// export const favListId = select(favsListSelector, 'id')
// ListItems attached to the user favs collection via PREDICATE field/triple predicate.
// Returns object keyed with listItem id.
export const favListFull = allChildrenSelector(favsListSelector)
export const createdActions = flow(property(PREDICATE), omitBy(isActionEnded))
export const favListElements = createSelector(favListFull, createdActions)
export const favItems = createSelector(favListElements, map('item'))
export function findItemInListItems(items, item) {
  return find({ item: pick(item, 'id', 'type') })(items)
}
export const userHasFavorites = boolSelector(favListElements)
// Items is expected to come props style findItemInFavs(state, { item })
export const findItemInFavs = createSelector(favListElements, getPropsItem, findItemInListItems)
// Used by React selector where item is in props arg.
export const itemInFavs = boolSelector(findItemInFavs)

// Is the component item the same as the one used in the most recent `open` action?
export const itemIsActive = flow(over(getPropsItem, getActiveItem), spread(entityMatch))
// Is the component item the same as the one used to create the most recent ListItem?
export const itemActiveListItem = (state, { item }) => {
  const createdListItem = activeListItemFull(state)
  // console.log(item, activeListItem)
  if (entityMatch(item, createdListItem.item)) return createdListItem
  return null
}
// export const itemListItems
// ITEM CONTAINER
// Used in the ItemFav container.
export const mapStateToProps = createStructuredSelector({
  itemActiveListItem, // Single listItem entity.
  collections: userCollectionsItem,
  // inCollections: itemInCollections,
  itemIsActive,
})
