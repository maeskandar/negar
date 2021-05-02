import { React } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { CustomCard } from './CustomCard'

export const MyVerticallyCenteredModal = (props) => {
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Change background Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={"row"}>
          {
            props.images.map((img) => (
              <CustomCard ischosen={props.setimage}
                imagess={img}
                hide={props.onHide}
              />

            ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}
