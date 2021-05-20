import React from 'react'
import { Button, Card } from 'react-bootstrap'
import useStyles from "./style";

export const CustomCard = (props) => {
  const ClickHandler=()=>{
    props.hide();
    props.ischosen(props.imagess.url);
  };  
  const classes = useStyles();
  return (
    <div>
      <Card className={classes.MainCard}>
        <Card.Img variant="top" src={props.imagess.url} className={classes.CardImg}/>
        <Card.Body>
          <Card.Title>{props.imagess.title}</Card.Title>
          <Card.Text>
           {props.imagess.desc}
    </Card.Text>
          <Button variant="primary" onClick={ClickHandler}>Submit</Button>
        </Card.Body>
      </Card>
    </div>
  )
}

