/**
 * @jest-environment jsdom
 */

import React from 'react'
import MessageAuthor from '../../src/components/task/task-message-author'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

xdescribe('components', () => {
  describe('message author component', () => {
    it('should start a new message author form dialog empty state', () => {
      const component = mount(<MessageAuthor userId={ 1 } taskId={ 1 } name='Foo' />)

      expect(component).toEqual({})
      expect(component.state().message).toEqual('')
      expect(component.props().userId).toEqual(1)
      expect(component.props().taskId).toEqual(1)
      expect(component.props().name).toEqual('Foo')
      component.unmount()
    })

    it('should start a new messageAuthor and set state', () => {
      const component = mount(<MessageAuthor userId={ 1 } taskId={ 1 } name='Foo' />)
      component.setState({ message: 'other foo' })
      expect(component).toEqual({})
      expect(component.state().message).toEqual('other foo')
      component.unmount()
    })

    xit('should start a new checkout and check if a payment is requested and change state', () => {
      const component = mount(<MessageAuthor userId={ 1 } taskId={ 1 } name='Foo' />)
      component.find('input').first().simulate('change', {
        target: {
          name: 'message',
          value: 'foo message written'
        }
      })
      component.find('form').simulate('submit')
      expect(component).toEqual({})
      expect(component.state().message).toEqual('foo message written')
      component.unmount()
    })
  })
})
