import {
  entityDomainIncludes, entityTypeSelector, rebuildEntitiesSelector,
} from 'redux-graph'
import { createSelector, createStructuredSelector } from 'reselect'
import find from 'lodash/fp/find'
import pickBy from 'lodash/fp/pickBy'
import { boolSelector, getProps, select } from 'cape-select'
import { selectUser } from 'cape-redux-auth'

// import { getDataFeed, getWebApp } from '../select'
// import { itemsFilled } from '../select/items'

import {
  findActionCreated, fixListItems, listItemIndex, orderListItems, invertListItems,
  setListItemsCollection,
} from './helpers'
import { isFavList, isValidListItem } from './lang'
import { predicateValueContains } from './util'
import { collectionType, liType } from './const'

// COLLECTIONS

// Select all CollectionList entities from the database.
export const collectionListSelector = entityTypeSelector(collectionType)
export const collections = rebuildEntitiesSelector(collectionListSelector)

// LIST ITEM

// Select all ListItem entities.
export const listItemSelector = entityTypeSelector(liType)

// USER COLLECTIONS - No props needed.

// Find user collections. Returns empty object when nothing found.
export const userCollections = createSelector(
  collections, selectUser, predicateValueContains('creator')
)
export const userHasCollections = boolSelector(userCollections)
// Find (first) user favs project from list entities.
export const favsListSelector = createSelector(userCollections, find(isFavList))
// ListItems attached to the user favs collection via itemListElement field/triple predicate.
// Returns object keyed with listItem id.
export const favListElements = select(favsListSelector, 'itemListElement')
export const userHasFavorites = boolSelector(favListElements)

export function itemsSelectors(selectItems) {
  const listItems = createSelector(favListElements, selectItems, fixListItems)
  const listItemsSorted = createSelector(listItems, orderListItems)
  const favsItemIndex = createSelector(listItems, listItemIndex)
  return { listItems, listItemsSorted, favsItemIndex }
}

// Gets currently active ListItem.
export const activeListItem = createSelector(listItemSelector, findActionCreated)

// ITEM LISTS & COLLECTIONS. Uses item prop.

// Select props.item.id from (state, props)
export const getItemId = select(getProps, 'item.id')
// Need to ListItems this textile shows up on.
export const itemParents = entityDomainIncludes(getItemId)
export const itemListItems = select(itemParents, 'domainIncludes.item')
// Reduce to only valid/active listItemElements
export const itemActiveListItems = createSelector(itemListItems, pickBy(isValidListItem))
// Move domainIncludes.itemListElement to collection.
export const itemLists = createSelector(itemActiveListItems, setListItemsCollection)
// Same as activeListItem?
export const itemListCreated = createSelector(itemLists, findActionCreated)

// Reorder list -> collection to collection -> listItemElement. Returns object or null if no list.
export const itemCollections = createSelector(itemLists, invertListItems)
export const itemInCollections = boolSelector(itemCollections)
export const itemFavCollection = createSelector(itemCollections, find(isFavList))
// Need to know if we should display a confirm window or a projectEdit window.
// Find fav or active collection under edit.
// export const getActiveCollection = simpleSelector(favCollection, firstValArg)
// export const favId = select('itemListElement.id', favCollection)
// export const itemIcon = createSelector(itemCollections, getItemIcon)

// CREATE


// ITEM CONTAINER
// Used in the ItemFav container.
export const mapStateToProps = createStructuredSelector({
  activeListItem: itemListCreated, // Single listItem entity.
  collections: itemCollections,
  inCollections: itemInCollections,
})
