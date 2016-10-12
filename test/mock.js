import { combineReducers, createStore } from 'redux'
import auth from 'cape-redux-auth'
import graph from 'redux-graph'

const reducer = combineReducers({
  auth,
  graph,
})
const initState = {
  graph: { entity: { foo: { id: 'foo', type: 'CollectionList' } } },
}
export const store = createStore(reducer, initState)
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
export const collection = {
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
