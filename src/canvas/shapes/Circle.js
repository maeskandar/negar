import Konva from "konva"

import { shapeKinds } from '../'
import { validDeg } from "../../utils/math"
import { addCommonEvents, closedShapeProps, everyShapeProps } from '../abstract'
import { mainLayer } from "../manager"


export function newCircle(options = { x: 0, y: 0, width: 100, height: 100, rotation: 0 }) {
  let shape = new Konva.Ellipse({
    kind: shapeKinds.Circle,

    ...everyShapeProps(),
    ...closedShapeProps(),

    ...options,

    radiusX: options.width / 2,
    radiusY: options.height / 2,
  })

  let isDrawing = false

  shape.events = {
    drawStart: () => {
      isDrawing = true
    },
    drawEnd: () => {
      shape.move({ x: - shape.offsetX(), y: - shape.offsetY() })
      shape.offsetX(0)
      shape.offsetY(0)
      isDrawing = false
    }
  }

  shape.setters = {
    fixSize: () => {
      shape.setters.width(shape.attrs.width)
      shape.setters.height(shape.attrs.height)
    },

    width: w => {
      shape.radiusX(Math.abs(w) / 2)
      if (isDrawing)
        shape.offsetX(-w / 2)
    },
    height: h => {
      shape.radiusY(Math.abs(h) / 2)
      if (isDrawing)
        shape.offsetY(-h / 2)
    },
  }

  addCommonEvents(shape, () => {
    shape.attrs.width *= shape.scaleX()
    shape.attrs.height *= shape.scaleY()

    shape.setters.fixSize()

    shape.scaleX(1)
    shape.scaleY(1)
    shape.attrs.rotation =  validDeg(shape.rotation())
  })

  return shape
}
