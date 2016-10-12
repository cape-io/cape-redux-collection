import test from 'tape'
import { isDate, matches, property } from 'lodash'
import { collectionListBuilder, collectionListBuilderDefault, getTitle } from '../src/entity'

import { collectionList, store, props } from './mock'

test('getTitle', (t) => {
  t.equal(getTitle(null, props), 'strawberry', 'getTitle with prop')
  t.equal(getTitle(null), 'Favorites', 'no props')
  t.end()
})
test('collectionListBuilder', (t) => {
  const collection = collectionListBuilder()(store.getState())
  t.ok(matches(collectionList)(collection), 'matches')
  t.ok(isDate(collection.dateCreated), 'isDate')
  const collection2 = collectionListBuilder({ foo: 'bar' })(store.getState())
  t.ok(matches(collectionList)(collection2))
  t.ok(isDate(collection2.dateCreated), 'isDate')
  t.equal(collection2.foo, 'bar', 'foo')
  const foo = property('graph.entity.foo')
  const objSelector = { foo }
  const collection3 = collectionListBuilder(objSelector)(store.getState())
  t.equal(collection3.foo, foo(store.getState()), 'foo entity')
  t.end()
})
test('collectionListBuilderDefault', (t) => {
  const collection = collectionListBuilderDefault(store.getState())
  t.ok(matches(collectionList)(collection), 'matches')
  t.ok(isDate(collection.dateCreated), 'isDate')
  t.end()
})
