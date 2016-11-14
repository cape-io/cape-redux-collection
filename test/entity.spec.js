import test from 'tape'
import { isDate, isFunction, matches, property } from 'lodash'
import { isTriple } from 'redux-graph'

import { LIST_ITEM, PREDICATE } from '../src/const'
import {
  collectionListBuilder, collectionListBuilderDefault, listItemBuilder,
} from '../src/entity'
import { collectionList, configStore, image, sailboat } from './mock'

const store = configStore()

// test('collectionListBuilder', (t) => {
//   const collection = collectionListBuilder()(store.getState())
//   t.ok(matches(collectionList)(collection), 'matches')
//   t.ok(isDate(collection.dateCreated), 'isDate')
//   const collection2 = collectionListBuilder({ foo: 'bar' })(store.getState())
//   t.ok(matches(collectionList)(collection2))
//   t.ok(isDate(collection2.dateCreated), 'isDate')
//   t.equal(collection2.foo, 'bar', 'foo')
//   const foo = property('graph.entity.foo')
//   const objSelector = { foo }
//   const collection3 = collectionListBuilder(objSelector)(store.getState())
//   t.equal(collection3.foo, foo(store.getState()), 'foo entity')
//   t.end()
// })
// test('collectionListBuilderDefault', (t) => {
//   const collection = collectionListBuilderDefault(store.getState())
//   t.ok(matches(collectionList)(collection), 'matches')
//   t.ok(isDate(collection.dateCreated), 'isDate')
//   t.end()
// })
// test('listItemBuilder', (t) => {
//   const listSelector = property('graph.entity.foo')
//   const imgSelector = property('graph.entity.pic1')
//   const entityFields = { image: imgSelector, item: sailboat }
//   const entityBuilder = listItemBuilder(listSelector, entityFields)
//   t.ok(isFunction(entityBuilder))
//   const state = store.getState()
//   const triple = entityBuilder(state)
//   t.ok(isTriple(triple))
//   t.equal(triple.object.type, LIST_ITEM)
//   t.equal(triple.object.agent.id, 'anonUser')
//   t.equal(triple.object.item, sailboat)
//   t.equal(triple.object.image, state.graph.entity.pic1)
//   t.deepEqual(triple.object.image, image)
//   t.equal(triple.predicate, PREDICATE)
//   t.equal(triple.subject, state.graph.entity.foo)
//   t.end()
// })
