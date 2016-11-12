import { flow, get, now, partial } from 'lodash'
import { structuredSelector } from 'cape-select'
import { selectUser } from 'cape-redux-auth'

import {
  ASC, COLLECTION_TYPE, CREATED, FAV_TITLE, LIST_ITEM, PREDICATE,
} from './const'

export const entitySchema = {
  [COLLECTION_TYPE]: {
    additionalType: true,
    dateCreated: true,
    itemListOrder: { default: ASC },
    numberOfItems: { calc: true },
    title: { default: FAV_TITLE },
    _refs: {
      agent: true,
      creator: true,
      editor: true,
      [PREDICATE]: { multi: true },
      mainEntity: true,
    },
  },
  [LIST_ITEM]: {
    actionStatus: { default: CREATED },
    dateCreated: true,
    description: true,
    position: { default: 100 },
    title: true,
    _refs: {
      creator: true,
      editor: true,
      item: true,
      mainEntity: true,
    },
  },
}
export function getDefault(type, field) {
  return get(entitySchema, [ type, field, 'default' ], null)
}
export const getListDef = partial(getDefault, COLLECTION_TYPE)
export const getItemDef = partial(getDefault, LIST_ITEM)

// Merge in default Collection fields.
export function collectionList(props = {}) {
  return {
    creator: selectUser, // User that created the thing.
    editor: selectUser, // User that edits/owns has permission the thing.
    dateCreated: now(),
    itemListOrder: getListDef('itemListOrder'),
    title: getListDef('title'), // Title for this CollectionList.
    type: COLLECTION_TYPE,
    ...props,
  }
}
// Creates a structuredSelector that will create a new list.
export const collectionListBuilder = flow(collectionList, structuredSelector)
// Default structuredSelector to build list.
export const collectionListBuilderDefault = collectionListBuilder()

export function collectionItem(props) {
  if (!props.item) throw new Error('Creating a new collectionItem requires an `item`.')
  if (!props.mainEntity) throw new Error('`mainEntity` required to define item collection.')
  return {
    actionStatus: getItemDef('actionStatus'),
    creator: selectUser, // User that created the thing.
    editor: selectUser, // User that edits/owns has permission the thing.
    startTime: now(),
    type: LIST_ITEM,
    position: getItemDef('position'),
    ...props,
  }
}

// Creates a structuredSelector that will create a new list.
export const listItemBuilder = flow(collectionItem, structuredSelector)
