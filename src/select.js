import {
  flow, isMatch, isObject, negate, nthArg, over,
  overEvery, pick, property, spread,
} from 'lodash'
import { find, groupBy, keyBy, map, omitBy, pickBy } from 'lodash/fp'
import { createSelector, createStructuredSelector } from 'reselect'
import { boolSelector, getProps, getSelect, select, simpleSelector } from 'cape-select'
import { selectUser } from 'cape-redux-auth'
import {
  allChildrenSelector, entityTypeSelector, getKey, getRef, predicateFilter,
} from '@kaicurry/redux-graph'
// import { getDataFeed, getWebApp } from '../select'
// import { itemsFilled } from '../select/items'

import {
  findActionCreated,
} from './helpers'
import { isActionEnded, isFavList, isValidListItem } from './lang'
import { COLLECTION_TYPE, LIST_ITEM, PREDICATE } from './const'

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
export const activeListItems = createSelector(listItemSelector, pickBy(isValidListItem))
export const listItemsByItem = createSelector(
  activeListItems,
  groupBy(listItem => getKey(getRef(listItem, 'item')))
)
export const itemCollections = getSelect(listItemsByItem, propsItemKey)
export const getListCollection = listItem => find(listItem.rangeIncludes[PREDICATE]).id
export const itemCollectionsHash = createSelector(itemCollections, keyBy(getListCollection))
// USER COLLECTIONS - No props needed.

// Find user collections. Returns empty object when nothing found.
export const userCollections = createSelector(
  selectUser, collectionListSelector, predicateFilter('creator')
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
export const findItemInFavs = createSelector(favListElements, nthArg(1), findItemInListItems)
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
// Same as activeListItem?
// export const itemListCreated = createSelector(itemLists, findActionCreated)

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
export const itemIsActive = overEvery(
  flow(getActiveItem, isObject),
  flow(over(getPropsItem, getActiveItem), spread(isMatch)),
)
// export const itemListItems
// ITEM CONTAINER
// Used in the ItemFav container.
export const mapStateToProps = createStructuredSelector({
  // activeListItem: itemListCreated, // Single listItem entity.
  collections: userCollections,
  // inCollections: itemInCollections,
  itemIsActive,
  userCollections,
})
