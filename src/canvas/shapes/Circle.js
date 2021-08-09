import Konva from "konva"

import { shapeKinds } from '../'
import { validDeg } from "../../utils/math"
import {
  addCommonEvents, everyShapeAttrs, closedShapeProps, everyShapeProps, applyPropsToShape, applyDefaultSetters,
} from '../abstract'
import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH  } from "../"


export function newCircle(options = { x: 0, y: 0, width: 100, height: 100, rotation: 0 }) {
  let shape = new Konva.Ellipse({
    ...everyShapeAttrs(),
    ...closedShapeProps(),
  })

  shape.props = {
    ...everyShapeProps(),
    kind: shapeKinds.Circle,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: Konva.Util.getRandomColor(),
    borderColor: DEFAULT_STROKE_COLOR,
    borderSize: DEFAULT_STROKE_WIDTH,
    opacity: 1,
    ...options
  }

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
    fixSize: (w, h) => {
      shape.props.width = w
      shape.props.height = h

      shape.setters.width(w)
      shape.setters.height(h)
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

  applyDefaultSetters(shape, shape.setters, [
    "x",
    "y",
    "fill",
    "opacity",
    "rotation",
    "draggable",
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
  ])

  addCommonEvents(shape, () => {
    shape.setters.fixSize(
      shape.props.width * shape.scaleX(),
      shape.props.height * shape.scaleY(),
    )

    shape.scaleX(1)
    shape.scaleY(1)
    shape.props.rotation = validDeg(shape.rotation())
  })

  applyPropsToShape(shape.props, shape.setters)

  return shape
}
