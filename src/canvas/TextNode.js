import Konva from 'konva'
import { shapeKinds } from './'
import { addCommonEvents, closedShapeProps, commonShapeProps, basicCoordinate, basicSize } from './abstract'

export function newTextNode(text) {
  console.log(text)

  let shape = new Konva.Text({
    kind: shapeKinds.Text,
    ...commonShapeProps(),

    ...basicCoordinate(200,200),
    ...basicSize(200, undefined),
    
    ...closedShapeProps(),
    strokeWidth: 0,
    
    text: text,
    fontSize: 30,
    fontFamily: "Shabnam",
    lineHeight: 1,
    align: 'right',
  })

  addCommonEvents(shape)
  return shape
}