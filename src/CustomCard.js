import React from 'react'
import { Button, Card } from 'react-bootstrap'

export function CustomCard(props){
  const ClickHandler = () => {
    props.hide()
    props.ischosen(props.imagess.url)
  }

  return (
    <div>
      <Card style={{ width: '20rem', marginLeft: '2.9rem' }}>
        <Card.Img variant="top" src={props.imagess.url} />
        <Card.Body>
          <Card.Title>{props.imagess.title}</Card.Title>
          <Card.Text>
            {props.imagess.desc}
          </Card.Text>
          <Button variant="primary" onClick={ClickHandler}>Select</Button>
        </Card.Body>
      </Card>
    </div>
  )
}