import Konva from "konva"

import { shapeKinds } from './'
import { addCommonEvents, closedShapeProps, commonShapeProps, basicCoordinate, basicSize } from './abstract'


export function newCircle() {
  let shape = new Konva.Ellipse({
    kind: shapeKinds.Circle,
    ...commonShapeProps(),

    ...basicCoordinate(),
    ...basicSize(),
    ...closedShapeProps(),
  })

  addCommonEvents(shape)
  return shape
}
