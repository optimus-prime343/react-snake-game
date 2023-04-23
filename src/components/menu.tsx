import { InfoOutlineIcon, TimeIcon } from '@chakra-ui/icons'
import { IconButton, Stack } from '@chakra-ui/react'

export interface MenuProps {
  onShowControls: () => void
  onShowScore: () => void
}
export function Menu({ onShowControls, onShowScore }: MenuProps) {
  return (
    <Stack direction='row'>
      <IconButton
        aria-label='Show controls'
        icon={<InfoOutlineIcon />}
        onClick={onShowControls}
      />
      <IconButton
        aria-label='Show score'
        icon={<TimeIcon />}
        onClick={onShowScore}
      />
    </Stack>
  )
}
