import Konva from "konva"

import { shapeKinds } from '../'
import { addCommonEvents, closedShapeProps, everyShapeProps } from '../abstract'


export function newCircle(options = { x: 0, y: 0, width: 1000, height: 100, rotation: 0 }) {
  let shape = new Konva.Ellipse({
    kind: shapeKinds.Circle,

    ...everyShapeProps(),
    ...closedShapeProps(),

    ...options,

    radiusX: options.width / 2,
    radiusY: options.height / 2,
  })

  shape.setters = {
    width: w => {
      shape.radiusX(Math.abs(w) / 2)
    },
    height: h => {
      shape.radiusY(Math.abs(h) / 2)
    },
  }

  addCommonEvents(shape)
  return shape
}
