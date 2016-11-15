import { applyMiddleware, combineReducers, createStore } from 'redux'
import auth from 'cape-redux-auth'
import graph, { entityPutAll } from '@kaicurry/redux-graph'
import thunk from 'redux-thunk'
import collection, { COLLECTION_TYPE, LIST_ITEM, entityMiddleware } from '../src/'

const reducer = combineReducers({
  auth,
  collection,
  graph,
})
export const TIME = 1479141039389
export const list = { id: 'foolist', type: COLLECTION_TYPE, extra: 'field' }
export const listItem = { id: 'z1listItem', type: LIST_ITEM }
export const sailboat = { id: 'saga43', type: 'Sailboat', name: 'Free Spirit' }
export const sail2 = { id: 'freedom32', type: 'Sailboat', name: 'Owl' }
export const image = { id: 'pic1', type: 'Photograph', name: 'Interior' }
export function configStore() {
  const store = createStore(reducer, applyMiddleware(thunk, entityMiddleware))
  store.dispatch(entityPutAll([ list, listItem, sailboat, sail2, image ]))
  return store
}

export const user = { type: 'Person', id: 'anon', name: 'foo', gender: 'bar' }
export const user2 = { id: 'anonUser', type: 'Person', name: 'Anonymous' }

export const props = {
  item: { id: 'bar' },
  title: 'strawberry',
}
export const collections = {
  a1: {
    id: 'a1',
    type: 'Sample',
    title: 'Rubish',
    creator: {
      anon: user,
      auth: user2,
    },
  },
  a2: {
    id: 'a2',
    type: 'Sample',
    creator: {
      auth: user2,
    },
  },
  a3: {
    id: 'a3',
    type: 'Sample',
    title: 'Favorites',
    creator: {
      anon: user,
    },
  },
}
// This is what we are looking for from collectionListBuilder.
export const collectionList = {
  itemListOrder: 'Ascending',
  type: 'CollectionList',
  creator: user2,
  editor: user2,
  title: 'Favorites',
}
