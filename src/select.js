import {
  curry, flow, has, mapValues, negate, over,
  pick, property, rearg, spread,
} from 'lodash'
import { find, groupBy, keyBy, map, omitBy, pickBy } from 'lodash/fp'
import { createSelector, createStructuredSelector } from 'reselect'
import { boolSelector, getProps, getSelect, select, simpleSelector } from 'cape-select'
import { set } from 'cape-redux'
import { selectUser } from 'cape-redux-auth'
import {
  allChildrenSelector, entityMatch, entityTypeSelector, getKey, getRef, predicateFilter,
} from '@kaicurry/redux-graph'
// import { getDataFeed, getWebApp } from '../select'
// import { itemsFilled } from '../select/items'

import { findActionCreated } from './helpers'
import { getItemRef, isActionEnded, isFavList, isValidListItem } from './lang'
import { COLLECTION_TYPE, LIST_ITEM, PREDICATE } from './const'

export const fpGetRef = curry(rearg(getRef, [ 1, 0 ]), 2)
export const getPropsItem = select(getProps, 'item')
export const propsItemKey = simpleSelector(getPropsItem, getKey)
// COLLECTIONS

// Select all CollectionList entities from the database.
export const collectionListSelector = entityTypeSelector(COLLECTION_TYPE)
// export const collections = rebuildEntitiesSelector(collectionListSelector)

// LIST ITEM

// Select all ListItem entities.
export const listItemSelector = entityTypeSelector(LIST_ITEM)
// Gets currently active ListItem.
export const activeListItem = createSelector(listItemSelector, findActionCreated)
export const activeListItemFull = allChildrenSelector(activeListItem)

export const activeListItems = createSelector(listItemSelector, pickBy(isValidListItem))
export const listItemsByItem = createSelector(
  activeListItems,
  groupBy(listItem => getKey(getItemRef(listItem)))
)
export const itemCollections = getSelect(listItemsByItem, propsItemKey)
export const getListCollectionId = flow(fpGetRef('mainEntity'), property('id'))
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
// export const userCollectionsItem = over(userCollections, itemCollectionsHash)
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
// export function itemsSelectors(selectItems) {
  // const listItems = createSelector(favListElements, selectItems, fixListItems)
  // const listItemsSorted = createSelector(listItems, orderListItems)
  // const favsItemIndex = createSelector(listItems, listItemIndex)
  // return { listItems, listItemsSorted, favsItemIndex }
// }

// ITEM LISTS & COLLECTIONS. Uses item prop.

// Need to ListItems this textile shows up on.
// export const itemParents = entityDomainIncludes(getItemId)
// export const itemListItems = select(itemParents, 'domainIncludes.item')
// Reduce to only valid/active listItemElements
// export const itemActiveListItems = createSelector(itemListItems, pickBy(isValidListItem))
// Move domainIncludes.PREDICATE to collection.
// export const itemLists = createSelector(itemActiveListItems, setListItemsCollection)

// Reorder list -> collection to collection -> listItemElement. Returns object or null if no list.
// export const itemInCollections = boolSelector(itemCollections)
// Is the item in a favs list?
// export const itemFavCollection = createSelector(itemCollections, find(isFavList))

// Need to know if we should display a confirm window or a projectEdit window.
// Find fav or active collection under edit.
// export const getActiveCollection = simpleSelector(favCollection, firstValArg)
// export const favId = select('PREDICATE.id', favCollection)
// export const itemIcon = createSelector(itemCollections, getItemIcon)

export const getCollectionState = property('collection')
export const getActiveItem = select(getCollectionState, 'item')
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
  collections: userCollections,
  // inCollections: itemInCollections,
  itemIsActive,
  userCollections,
})
