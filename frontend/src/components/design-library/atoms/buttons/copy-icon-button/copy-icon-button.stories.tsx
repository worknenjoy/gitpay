import CopyIconButton from './copy-icon-button'

const meta = {
  title: 'Design Library/Atoms/Buttons/CopyIconButton',
  component: CopyIconButton
}

export default meta

export const Default = {
  args: { value: 'pay_abc123' }
}

export const CustomTooltip = {
  args: { value: 'https://example.com/issue/123', tooltipTitle: 'Copy link' }
}
