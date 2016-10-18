import test from 'tape'
import { isDate, matches, property } from 'lodash'
import { isTriple } from 'redux-graph'
import {
  collectionListBuilder, collectionListBuilderDefault, getTitle, listItemBuilder,
} from '../src/entity'

import { collectionList, configStore, image, props, sailboat } from './mock'

const store = configStore()

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
test('listItemBuilder', (t) => {
  const listSelector = property('graph.entity.foo')
  const imgSelector = property('graph.entity.pic1')
  const entityFields = { image: imgSelector, item: sailboat }
  const entityBuilder = listItemBuilder(listSelector, entityFields)
  const state = store.getState()
  const triple = entityBuilder(state)
  t.ok(isTriple(triple))
  t.equal(triple.object.type, 'ListItem')
  t.equal(triple.object.agent.id, 'anonUser')
  t.equal(triple.object.item, sailboat)
  // Why isn't this equal?
  t.deepEqual(triple.object.image, image)
  t.equal(triple.predicate, 'itemListElement')
  t.equal(triple.subject, state.graph.entity.foo)
  t.end()
})
