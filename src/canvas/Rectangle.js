import Konva from "konva"

import { shapeKinds } from './'
import { addCommonEvents, closedShapeProps, commonShapeProps, basicCoordinate, basicSize } from './abstract'

export function newRectangle() {
  let shape = new Konva.Rect({
    kind: shapeKinds.Reactangle,
    ...commonShapeProps(),

    ...basicCoordinate(),
    ...basicSize(),
    ...closedShapeProps(),
  })

  addCommonEvents(shape)
  return shape
}
