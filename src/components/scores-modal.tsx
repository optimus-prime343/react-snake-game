/* eslint-disable react/jsx-props-no-spreading */
import {
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  OrderedList,
} from '@chakra-ui/react'
import { useCallback } from 'react'

export interface ScoresModalProps extends Omit<ModalProps, 'children'> {
  scores: number[]
}

export function ScoresModal({ scores, ...rest }: ScoresModalProps) {
  const renderScores = useCallback(() => {
    return scores.map(score => (
      <ListItem key={score.toString()}>{score}</ListItem>
    ))
  }, [scores])
  return (
    <Modal {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scores</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <OrderedList>{renderScores()}</OrderedList>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
