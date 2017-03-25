import { get, set } from 'lodash'
import {
  fullRefPath, getEntity, getKey, getPath, getRefPath,
  pickTypeId,
} from 'redux-graph'
import { entityDb, entitySet, entityUpdate } from 'cape-firebase'
import { COLLECTION_TYPE, PREDICATE } from './const'
import { getListCollectionId } from './select'

// ({ action, entityIds, firebase, next, store })

export function createItem({ action: { payload }, firebase }) {
  const { mainEntity, ...item } = payload
  const subject = pickTypeId(mainEntity)
  set(item, [ 'rangeIncludes', PREDICATE, getKey(subject) ], subject)
  // Save ListItem to the database.
  return entitySet(firebase, item)
  // Get dateModified value of ListItem
  .then(node => entityDb(firebase.entity, node).child('dateModified').once('value'))
  .then((dateModified) => {
    const object = pickTypeId(item)
    object.dateModified = dateModified.val()
    // Attach the ListItem to the CollectionList.
    entityDb(firebase.entity, subject).update({
      dateModified: firebase.TIMESTAMP,
      [getRefPath(PREDICATE, object).join('/')]: object,
    })
  })
}
export function removeItem({ store, action, firebase }) {
  // Get the full item info.
  const item = getEntity(store.getState(), action.payload)
  const list = { id: getListCollectionId(item), type: COLLECTION_TYPE }
  const listRefPath = fullRefPath(list, PREDICATE, item).join('/')
  const listDatePath = getPath(list).concat('dateModified').join('/')
  const itemPath = getPath(item).join('/')
  // remove from list refs and remove listItem node at same time.
  // console.log(item, listId, listPath)
  return firebase.entity.update({
    [listRefPath]: null,
    [listDatePath]: firebase.TIMESTAMP,
    [itemPath]: null,
  })
}
export function updateItem({ store, action: { meta, payload }, firebase }) {
  if (get(meta, 'action') === 'END_ITEM') return removeItem(store, payload, firebase)
  return entityUpdate(firebase, payload)
}