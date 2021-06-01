import { React } from 'react'
import { Button, Modal } from 'react-bootstrap'

import { CustomCard } from './CustomCard'

export function MyVerticallyCenteredModal(props) {
  const fileUploadHandler = (e) => {
    
    if (e.target.files && e.target.files[0]) {
      props.setimage(URL.createObjectURL(e.target.files[0]))
      props.onHide();
    }
  }
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ direction: 'ltr' }}
    >
      <Modal.Header closeButton >
        {
          (props.mode == "back") && (
            <div className={"text-left position-fixed"}>
              <input type={"file"} id={"customFile"} onChange={(e) => fileUploadHandler(e)} />
            </div>
          )
        }

        <Modal.Title className={"text-center"} id="contained-modal-title-vcenter"
          style={{ fontFamily: 'Shabnam', marginLeft: '45%' }}>
          {props.title}
        </Modal.Title>

      </Modal.Header>
      <Modal.Body>
        <div className={"row"}>
          {props.images.map((img) => (
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
