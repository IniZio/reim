/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import renderer from 'react-test-renderer'

import React from 'react'
import reim from '../../reim/src'
import {useReim} from '../src'

test('Hook should return store value on component mount', () => {
  const store = reim({level: 10})

  function TestComponent() {
    const [state] = useReim(store)

    return (
      <div>
        <div id="level">{state.level}</div>
      </div>
    )
  }

  const component = renderer.create(<TestComponent/>)
  store.set(s => {
    s.level += 2
  })

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})