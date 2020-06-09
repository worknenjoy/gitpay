import React from 'react'
import TeamCard from '../../src/components/Cards/TeamCard'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('components', () => {
  describe('Card component', () => {
    it('should start a new Card with no data', () => {
      const component = mount(<TeamCard />)

      expect(component).toEqual({})
      component.unmount()
    })

    it('should start a new card with data', () => {
      const component = mount(<TeamCard data={ [{ name: 'foo' }] } />)
      expect(component.props().data[0].name).toEqual('foo')
      component.unmount()
    })
  })
})
