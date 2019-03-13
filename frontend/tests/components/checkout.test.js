import React from 'react'
import { CheckoutFormPure } from '../../src/components/checkout/checkout-form'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('components', () => {
  describe('checkout component', () => {
    it('should start a new checkout form with empty state', () => {
      const component = mount(<CheckoutFormPure />)

      expect(component).toEqual({})
      expect(component.state().fullname).toEqual(null)
      expect(component.state().email).toEqual(null)
      component.unmount()
    })

    it('should start a new checkout and set state', () => {
      const component = mount(<CheckoutFormPure />)
      component.setState({ fullname: 'foo', email: 'mail@example.com' })
      expect(component).toEqual({})
      expect(component.state().fullname).toEqual('foo')
      expect(component.state().email).toEqual('mail@example.com')
      component.unmount()
    })

    it('should start a new checkout and check if a payment is requested and change state', () => {
      const component = mount(<CheckoutFormPure />)
      component.find('input').first().simulate('change', {
        target: {
          name: 'fullname',
          value: 'Foo me'
        }
      })
      component.find('form').simulate('submit')
      expect(component).toEqual({})
      expect(component.state().paymentRequested).toEqual(true)
      expect(component.state().fullname).toEqual('Foo me')
      component.unmount()
    })

    it('should set the username and email from a logged user', () => {
      const component = mount(<CheckoutFormPure user={ {
        id: 1,
        name: 'Foo me',
        email: 'foo@mail.com'
      } } />)
      expect(component).toEqual({})
      expect(component.state().fullname).toEqual('Foo me')
      expect(component.state().email).toEqual('foo@mail.com')
      component.unmount()
    })
  })
})
