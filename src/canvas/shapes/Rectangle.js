import Konva from "konva"

import { shapeKinds } from '../'
import { addCommonEvents, closedShapeProps, everyShapeProps, basicShape } from '../abstract'

export function newRectangle(options = {}, temp= false) {
  let shape = new Konva.Rect({
    kind: shapeKinds.Reactangle,
    ...everyShapeProps(),
    ...basicShape(0, 0, 100, 100, 0),
    ...closedShapeProps(),
    ...options
  })

  addCommonEvents(shape)
  return shape
}
