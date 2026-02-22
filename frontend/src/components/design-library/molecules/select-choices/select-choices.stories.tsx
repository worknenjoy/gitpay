import React, { useMemo, useState } from 'react'
import SelectChoices from './select-choices'

type ChoiceItem = {
  id: number
  name: string
  label: string
  description: string
  imageSrc: string
}

const svgDataUri = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120">
    <rect width="240" height="120" fill="#263238" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="18" font-family="Arial, Helvetica, sans-serif">
      ${label}
    </text>
  </svg>
`)}`

const DemoSelectChoices = (args: any) => {
  const items: ChoiceItem[] = useMemo(
    () => [
      {
        id: 1,
        name: 'funding',
        label: 'Funder',
        description: 'I want to fund bounties and support maintainers.',
        imageSrc: svgDataUri('Funding')
      },
      {
        id: 2,
        name: 'contributor',
        label: 'Contributor',
        description: 'I want to work on issues and earn bounties.',
        imageSrc: svgDataUri('Contributor')
      },
      {
        id: 3,
        name: 'maintainer',
        label: 'Maintainer',
        description: 'I maintain projects and want to manage bounties.',
        imageSrc: svgDataUri('Maintainer')
      }
    ],
    []
  )

  const [selected, setSelected] = useState<ChoiceItem[]>([items[0]])

  return (
    <SelectChoices<ChoiceItem>
      {...args}
      title={args.title}
      description={args.description}
      items={items}
      getKey={(item) => item.id}
      getImageSrc={(item) => item.imageSrc}
      getImageAlt={(item) => item.name}
      getTitle={(item) => item.label}
      getDescription={(item) => item.description}
      isSelected={(item) => selected.some((s) => s.id === item.id)}
      onToggle={(item) =>
        setSelected((prev) => {
          const exists = prev.some((p) => p.id === item.id)
          return exists ? prev.filter((p) => p.id !== item.id) : [...prev, item]
        })
      }
    />
  )
}

export default {
  title: 'Design Library/Molecules/FormSection/SelectChoices',
  component: SelectChoices,
  parameters: { layout: 'padded' }
}

const Template = (args) => <DemoSelectChoices {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Select user roles',
  description: 'Choose one or more options.',
  loading: false
}

export const Loading = Template.bind({})
Loading.args = {
  title: 'Select user roles',
  description: 'Choose one or more options.',
  loading: true,
  placeholderCount: 3
}
