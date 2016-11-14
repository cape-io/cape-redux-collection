import test from 'tape'
import { flow, keys } from 'lodash'
import { mapValues } from 'lodash/fp'
import { entitySelector, entityUpdate } from 'redux-graph'
import { simpleSelector } from 'cape-select'
// import { addItemToFavs, ensureUserHasCollection } from '../src/actions'
import { favListElements } from '../src/select'
import {
  findActionCreated, fixListItems, listItemIndex, orderListItems,
} from '../src/helpers'
import { CREATED } from '../src/const'
import { configStore, sailboat, sail2 } from './mock'

const { dispatch, getState } = configStore()

// test('findActionCreated()', (t) => {
//   const vals = [
//     { id: 'foo' },
//     { id: 'bar', actionStatus: CREATED },
//   ]
//   const found = findActionCreated(vals)
//   t.equal(found, vals[1])
//   t.end()
// })
// const vals = [
//   { position: 2, id: 'mk46', item: { id: 'foo' }, actionStatus: CREATED },
//   { position: 1, id: 'xvz', item: { id: 'bar' } },
//   { position: 2, id: 'zp', item: { id: 'sailing' } },
// ]
// test('listItemIndex', (t) => {
//   const res = listItemIndex(vals)
//   t.equal(res.foo, vals[0])
//   t.equal(res.bar, vals[1])
//   t.equal(res.sailing, vals[2])
//   t.deepEqual(keys(res), [ 'foo', 'bar', 'sailing' ])
//   t.end()
// })
//
// function filler(item) {
//   if (item.id === 'saga43') return { ...item, length: 43 }
//   if (item.id === 'freedom32') return { ...item, length: 32 }
//   return item
// }
// const itemsFilled = flow(entitySelector, mapValues(filler))
// const favItems = simpleSelector(favListElements, itemsFilled, fixListItems)
// test('fixListItems', (t) => {
//   ensureUserHasCollection({})(dispatch, getState)
//   const fav1 = addItemToFavs(sailboat, 99)(dispatch, getState).object
//   const fav2 = addItemToFavs(sail2)(dispatch, getState).object
//   const res = favItems(getState())
//   t.equal(res[fav1.id].position, 99, 'position')
//   t.equal(res[fav1.id].item.length, 43)
//   t.equal(res[fav2.id].item.length, 32)
//   t.end()
// })
// const sortedFavs = flow(favItems, orderListItems)
// test('orderListItems', (t) => {
//   const res = orderListItems(vals)
//   t.equal(res[0], vals[1])
//   t.equal(res[1], vals[0])
//   t.equal(res[2], vals[2])
//   const res2 = sortedFavs(getState())
//   t.equal(res2[0].position, 99, 'position')
//   t.equal(res2[0].item.id, 'saga43')
//   t.equal(res2[1].item.id, 'freedom32')
//   dispatch(entityUpdate({ id: res2[1].id, position: 99 }))
//   const res3 = sortedFavs(getState())
//   t.equal(res3[0].item.id, 'freedom32')
//   t.equal(res3[1].item.id, 'saga43')
//   t.end()
// })
