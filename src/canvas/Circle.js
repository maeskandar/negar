import Konva from "konva"

import { shapeKinds } from './'
import { addCommonEvents, closedShapeProps, commonShapeProps, basicCoordinate, basicSize } from './abstract'


export function newCircle() {
  let shape = new Konva.Ellipse({
    kind: shapeKinds.Circle,
    ...commonShapeProps(),

    ...basicCoordinate(),
    ...basicSize(100, 100),
    ...closedShapeProps(),
  })

  shape.attrs.width = 100
  shape.attrs.height = 100

  addCommonEvents(shape)
  return shape
}
