import { React } from 'react'
import { Button, Modal } from 'react-bootstrap'

import { CustomCard } from './CustomCard'

export function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ direction: 'ltr' }}
    >
      <Modal.Header closeButton >
        <Modal.Title className={"text-center"} id="contained-modal-title-vcenter"
          style={{ fontFamily: 'Shabnam', marginLeft: '45%' }}>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={"row"}>
          {props.images.mapI((img) => (
            <CustomCard ischosen={props.setimage}
              imagess={img}
              hide={props.onHide}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer style={{ direction: 'rtl' }}>
        <Button onClick={props.onHide}>
          لغو
          </Button>
      </Modal.Footer>
    </Modal>
  )
}
