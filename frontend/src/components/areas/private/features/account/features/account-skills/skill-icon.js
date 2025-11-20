import React from 'react'

import Nodejs from 'images/icons/skill-preferences/Node.js.svg'
import Ruby from 'images/icons/skill-preferences/Ruby.svg'
import Python from 'images/icons/skill-preferences/Python.svg'
import CSS from 'images/icons/skill-preferences/CSS.svg'
import Design from 'images/icons/skill-preferences/Design.svg'
import Writing from 'images/icons/skill-preferences/Writing.svg'
import Documentation from 'images/icons/skill-preferences/Documentation.svg'
import ReactIcon from 'images/icons/skill-preferences/React.svg'
import Angular from 'images/icons/skill-preferences/Angular.svg'
import Vuejs from 'images/icons/skill-preferences/Vue.js.svg'
import Blogging from 'images/icons/skill-preferences/Blogging.svg'
import Wordpress from 'images/icons/skill-preferences/Wordpress.svg'
import PHP from 'images/icons/skill-preferences/PHP.svg'
import Testing from 'images/icons/skill-preferences/Testing.svg'
import Git from 'images/icons/skill-preferences/Git.svg'
import ContinuousIntegration from 'images/icons/skill-preferences/Continuous Integration.svg'

export function getSkillIcon(name) {
  switch (name) {
    case 'Node.js':
      return Nodejs
    case 'Ruby':
      return Ruby
    case 'Python':
      return Python
    case 'CSS':
      return CSS
    case 'Design':
      return Design
    case 'Writing':
      return Writing
    case 'Documentation':
      return Documentation
    case 'React':
      return ReactIcon
    case 'React Native':
      return ReactIcon
    case 'Angular':
      return Angular
    case 'Vue.js':
      return Vuejs
    case 'Blogging':
      return Blogging
    case 'Wordpress':
      return Wordpress
    case 'PHP':
      return PHP
    case 'Testing':
      return Testing
    case 'Git':
      return Git
    case 'Continuous Integration':
      return ContinuousIntegration
  }
  return ''
}

export function SkillIcon(props) {
  return <img src={getSkillIcon(props.name)} style={{ objectFit: 'contain', width: '80%' }} />
}
