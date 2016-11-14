import test from 'tape'
import { now } from 'lodash'
import { ENTITY_PUT } from '@kaicurry/redux-graph'
import { createListThunk } from '../src'
import { configStore, sailboat } from './mock'

const { dispatch, getState } = configStore()

test('createListThunk', (t) => {
  const action = dispatch(createListThunk())
  t.equal(action.type, ENTITY_PUT)
  t.equal(action.payload.type, 'CollectionList')
  const listId = action.payload.id
  t.deepEqual(action.payload, getState().graph.CollectionList[listId])
  // console.log(getState())
  t.end()
})
