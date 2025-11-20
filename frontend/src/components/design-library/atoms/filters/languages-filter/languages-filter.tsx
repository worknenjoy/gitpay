import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { useHistory } from 'react-router-dom'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const TaskFilterLangauges = function ({
  languages,
  listLanguages,
  listTasks
}: {
  languages: any
  listLanguages: any
  listTasks: any
}) {
  const history = useHistory()
  const [currentLanguages, setCurrentLanguages] = React.useState<typeof languages>([])

  const handleChange = (event: SelectChangeEvent<typeof languages>) => {
    const {
      target: { value }
    } = event

    // Update currentLanguages based on selected values
    setCurrentLanguages(
      Array.isArray(value) ? value : [] // Ensure `value` is an array
    )

    // Prepare filters and update tasks
    const filters = { languageIds: value }
    const splitUrl = history?.location?.pathname.split('/')
    const organizationPath = splitUrl[1]
    const organizationId = splitUrl[2]
    const projectPath = splitUrl[3]
    const projectId = splitUrl[4]

    if (projectId && projectPath === 'projects') {
      listTasks && value && listTasks({ projectId, ...filters })
    } else if (organizationId && organizationPath === 'organizations') {
      listTasks && value && listTasks({ projectId, organizationId, ...filters })
    } else {
      listTasks && value && listTasks({ languageIds: value })
    }
  }

  useEffect(() => {
    listLanguages?.()
  }, [])

  const getSelectedNames = (selected) => {
    return languages?.data?.filter((l) => selected.includes(l.id)).map((l) => l.name)
  }

  return (
    <FormControl sx={{ m: 1 }} fullWidth>
      <InputLabel id="demo-multiple-checkbox-label" size="small">
        <FormattedMessage id="task.languages" defaultMessage="Languages" />
      </InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        name={'langaugeIds'}
        value={currentLanguages}
        onChange={handleChange}
        input={<OutlinedInput label="languages" size="small" />}
        renderValue={(selected) => getSelectedNames(selected).join(', ')}
        MenuProps={MenuProps}
      >
        {languages?.data?.map(({ name, id }) => (
          <MenuItem key={id} value={id}>
            <Checkbox checked={!!currentLanguages.find((l) => l === id)} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default TaskFilterLangauges
