import SelectInput from './select-input'

const meta = {
  title: 'Design Library/Atoms/Inputs/SelectInputs/SelectInput',
  component: SelectInput,
  args: {
    label: 'Choose an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: '',
    onChange: () => {},
  },
}

export default meta

export const Default = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: '',
    onChange: () => {},
  },
}
