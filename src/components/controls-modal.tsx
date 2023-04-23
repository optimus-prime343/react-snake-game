/* eslint-disable react/jsx-props-no-spreading */
import {
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'

export type ControlsModalProps = Omit<ModalProps, 'children'>
export function ControlsModal(props: ControlsModalProps) {
  const controlKeys = useMemo(
    () => [
      ['W', 'ArrowUp', 'Move the snake up'],
      ['S', 'ArrowDown', 'Move the snake down'],
      ['A', 'ArrowLeft', 'Move the snake left'],
      ['D', 'ArrowRight', 'Move the snake right'],
    ],
    []
  )
  const renderControlKeys = useCallback(() => {
    return controlKeys.map((controlKeyArr, index) => {
      const [firstKey, secondKey, instruction] = controlKeyArr
      return (
        <Stack key={index.toString()} alignItems='center' direction='row'>
          <Text key={index.toString()}>
            <Kbd>{firstKey}</Kbd> | <Kbd>{secondKey}</Kbd>
          </Text>
          <Text flex={1} fontSize='sm' textAlign='right'>
            {instruction}
          </Text>
        </Stack>
      )
    })
  }, [controlKeys])

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Controls</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing='4'>{renderControlKeys()}</Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
