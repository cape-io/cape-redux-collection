import test from 'tape'
import { keys } from 'lodash'
import { findActionCreated, isCollectionList, listItemIndex } from '../src/helpers'

test('findActionCreated()', (t) => {
  const vals = [
    { id: 'foo' },
    { id: 'bar', actionStatus: 'created' },
  ]
  const found = findActionCreated(vals)
  t.equal(found, vals[1])
  t.end()
})
test('listItemIndex', (t) => {
  const vals = [
    { item: { id: 'foo' } },
    { item: { id: 'bar', actionStatus: 'created' } },
  ]
  const res = listItemIndex(vals)
  t.equal(res.foo, vals[0])
  t.equal(res.bar, vals[1])
  t.deepEqual(keys(res), [ 'foo', 'bar' ])
  t.end()
})
test('isCollectionList', (t) => {
  const collection = {
    dateCreated: new Date(),
    itemListOrder: 'Ascending',
    type: 'CollectionList',
    title: 'Favorites',
    id: 'mk46xvzp',
  }
  t.ok(isCollectionList(collection))
  collection.itemListOrder = 'Desc'
  t.false(isCollectionList(collection))
  t.end()
})
