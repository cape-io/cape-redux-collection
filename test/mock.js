import { combineReducers, createStore } from 'redux'
import auth from 'cape-redux-auth'
import graph, { entityPut } from 'redux-graph'
import collection from '../src/'

const reducer = combineReducers({
  auth,
  collection,
  graph,
})
const initState = {
  graph: {
    entity: { foo: { id: 'foo', type: 'CollectionList' } },
    triple: { spo: {}, sop: {}, osp: {}, ops: {}, pos: {}, pso: {} },
    typeIndex: {},
  },
}
export const sailboat = { id: 'saga43', type: 'Sailboat', name: 'Free Spirit' }
export const sail2 = { id: 'freedom32', type: 'Sailboat', name: 'Owl' }
export const image = { id: 'pic1', type: 'Photograph', name: 'Interior' }
export function configStore() {
  const store = createStore(reducer, initState)
  store.dispatch(entityPut(sailboat))
  store.dispatch(entityPut(sail2))
  store.dispatch(entityPut(image))
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
export const collectionListEntity = {
  itemListOrder: 'Ascending',
  type: 'CollectionList',
  title: 'Favorites',
}
