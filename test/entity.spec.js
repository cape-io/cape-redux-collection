import test from 'tape'
import { isDate, matches } from 'lodash'
import { buildCollectionList, getTitle } from '../src/entity'

import { collectionList, store, props } from './mock'

test('getTitle', (t) => {
  t.equal(getTitle(null, props), 'strawberry', 'getTitle with prop')
  t.equal(getTitle(null), 'Favorites', 'no props')
  t.end()
})
test('buildCollectionList', (t) => {
  const collection = buildCollectionList(store.getState())
  t.ok(collection, matches(collectionList))
  t.ok(isDate(collection.dateCreated), 'isDate')
  t.end()
})
