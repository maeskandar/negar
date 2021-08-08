import Konva from 'konva'
import { shapeKinds } from '../'
import { addCommonEvents, closedShapeProps, everyShapeProps, basicShape } from '../abstract'

export function newTextNode(text) {
  let shape = new Konva.Text({
    kind: shapeKinds.Text,
    strokeWidth: 0,
    
    text: text,
    fontSize: 30,
    fontFamily: "Shabnam",
    lineHeight: 1,
    align: 'right',

    ...everyShapeProps(),
    ...closedShapeProps(),
    ...basicShape(200,200, 200, undefined, 0),
  })

  addCommonEvents(shape)
  return shape
}