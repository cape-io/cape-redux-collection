import test from 'tape'
import {
  createCollectionList, createCollectionItemTriple, getCollection, mainEntity,
} from '../../src/redux/project/select'

const creator = { id: 'user0', type: 'Person', name: 'Anonymous' }
test('createCollectionList()', t => {
  const list1 = createCollectionList(creator)
  t.equal(list1.creator, creator, 'creator equal')
  t.equal(list1.title, 'Favorites')
  t.equal(list1.mainEntity, mainEntity, 'mainEntity')
  t.end()
})
test('getCollection', t => {
  const collectionList = null
  const listEntities = null
  const list1 = getCollection(collectionList, listEntities, creator)
  t.false(list1.id, 'no id')
  t.equal(list1.title, 'Favorites')
  t.end()
})
test('createCollectionItemTriple', t => {
  const list = createCollectionList(creator)
  const item = { id: 'foo', type: 'Textile' }
  const position = 12
  const listEl = createCollectionItemTriple(list, item, creator, position)
  t.equal(listEl.subject, list, 'list')
  t.equal(listEl.predicate, 'itemListElement', 'predicate')
  t.equal(listEl.object.item, item, 'item')
  t.equal(listEl.object.agent, creator, 'agent')
  t.end()
})
