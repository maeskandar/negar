import Konva from "konva"

import { shapeKinds } from '../'
import { addCommonEvents, closedShapeProps, everyShapeProps, basicShape } from '../abstract'


export function newCircle() {
  // FIXME: x,y is the center coordinate, width & height doesn't work because circle has radian 
  let shape = new Konva.Ellipse({
    kind: shapeKinds.Circle,

    ...everyShapeProps(),
    ...basicShape(0, 0, 100, 100, 0),
    ...closedShapeProps(),
  })

  shape.attrs.width = 100
  shape.attrs.height = 100

  addCommonEvents(shape)
  return shape
}
