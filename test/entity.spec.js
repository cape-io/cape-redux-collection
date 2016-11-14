import test from 'tape'
import { isNumber, isMatch, property } from 'lodash'
import { entitySelector } from '@kaicurry/redux-graph'

// import { LIST_ITEM, PREDICATE } from '../src/const'
import {
  collectionListBuilder,
} from '../src/entity'
import { collectionList, configStore } from './mock'

const { getState } = configStore()

const TIME = 1479141039389

test('collectionListBuilder', (t) => {
  const collection = collectionListBuilder()(getState())
  t.ok(isMatch(collection, collectionList), 'matches mock collectionList')
  // only other field is dateCreated.
  t.ok(collection.dateCreated > TIME, 'isDate')

  const collection2 = collectionListBuilder({ foo: 'bar' })(getState())
  t.ok(isMatch(collection2, collectionList), 'matches mock collectionList')
  t.ok(collection.dateCreated > TIME, 'isDate')
  t.equal(collection2.foo, 'bar', 'foo field set')

  const foo = entitySelector({ type: 'Sailboat', id: 'saga43' })
  const collection3 = collectionListBuilder({ foo })(getState())
  t.equal(collection3.foo, foo(getState()), 'foo entity')
  t.end()
})
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
