import React from 'react'
import { PreferencesPure } from '../../src/components/profile/preferences'
import { mount, configure } from 'enzyme'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'

configure({ adapter: new Adapter() })

describe('components', () => {
  describe('Preferences component', () => {
    it('should start a new preferences with a defined language', () => {
      const component = renderer.create(<PreferencesPure preferences={{language: 'br'}} />).toJSON()
      const componentMount = mount(<PreferencesPure preferences={{language: 'br'}} />)
      console.log(component)
      expect(componentMount.props().preferences).toEqual({language: 'br'})
      expect(component).toMatchSnapshot()
      componentMount.unmount()
    })
  })
})
