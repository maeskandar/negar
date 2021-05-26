import React from 'react'
import { makeStyles } from "@material-ui/styles"
import { Button, Card } from 'react-bootstrap'

const useStyles = makeStyles(theme => ({
  MainCard: {
    width: '20rem',
    marginLeft: '1.9rem',
    height: '30rem',
    marginTop: '1rem',
    fontFamily: 'Shabnam',
    marginRight: '1.7rem'
  },
  CardImg: {
    height: '20rem'
  }
}))

export const CustomCard = (props) => {
  const ClickHandler = () => {
    props.hide()
    props.ischosen(props.imagess.url)
  }
  const classes = useStyles()
  return (
    <div>
      <Card className={classes.MainCard}>
        <Card.Img variant="top" src={props.imagess.url} className={classes.CardImg} />
        <Card.Body>
          <Card.Title>{props.imagess.title}</Card.Title>
          <Card.Text>
            {props.imagess.desc}
          </Card.Text>
          <Button variant="primary" onClick={ClickHandler} style={{ fontFamily: 'Shabnam' }}>
            انتخاب
            </Button>
        </Card.Body>
      </Card>
    </div>
  )
}

