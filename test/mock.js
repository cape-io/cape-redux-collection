import { applyMiddleware, combineReducers, createStore } from 'redux'
import auth from 'cape-redux-auth'
import graph, { entityPutAll } from 'redux-graph'
import thunk from 'redux-thunk'
import collection from '../src/'

const reducer = combineReducers({
  auth,
  collection,
  graph,
})

export const list = { id: 'foolist', type: 'CollectionList' }
export const sailboat = { id: 'saga43', type: 'Sailboat', name: 'Free Spirit' }
export const sail2 = { id: 'freedom32', type: 'Sailboat', name: 'Owl' }
export const image = { id: 'pic1', type: 'Photograph', name: 'Interior' }
export function configStore() {
  const store = createStore(reducer, applyMiddleware(thunk))
  store.dispatch(entityPutAll([ list, sailboat, sail2, image ]))
  return store
}

export const user = {
  type: 'Person',
  id: 'anon',
  name: 'foo',
  gender: 'bar',
}
export const user2 = {
  type: 'Person',
  id: 'auth',
  name: 'Auth User',
}

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
export const collectionList = {
  itemListOrder: 'Ascending',
  type: 'CollectionList',
  creator: { id: 'anonUser', type: 'Person', name: 'Anonymous' },
  title: 'Favorites',
}
