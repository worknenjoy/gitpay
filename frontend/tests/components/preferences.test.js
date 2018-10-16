import React from 'react'
import { PreferencesPure } from '../../src/components/profile/preferences'
import { configure } from 'enzyme'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'

configure({ adapter: new Adapter() })

describe('components', () => {
  describe('Preferences component', () => {
    it('should start a new preferences with a defined language', () => {
      const preferencesComponent = () => (<PreferencesPure preferences={ { language: 'br' } } />)
      const component = renderer.create(preferencesComponent()).toJSON()
      console.log(component)
      expect(component).toMatchSnapshot()
    })
  })
})
