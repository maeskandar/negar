import Konva from "konva"

import { shapeKinds } from '../'
import { validDeg } from "../../utils/math"
import {
  addCommonEvents, everyShapeAttrs, closedShapeProps, everyShapeProps, applyPropsToShape, applyDefaultSetters,
} from '../abstract'
import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "../"
import { updateShape } from "../manager"


export function newCircle(options = { x: 0, y: 0, width: 100, height: 100, rotation: 0 }, isMain = true) {
  let shape = new Konva.Ellipse({
    isMain,
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
    x: v => shape.x(v + shape.props.width / 2),
    y: u => shape.y(u + shape.props.height / 2),
  }

  applyDefaultSetters(shape, shape.setters, [
    "fill",
    "opacity",
    "rotation",
    "draggable",
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
  ])

  addCommonEvents(shape, () => {
    shape.props.width *= shape.scaleX()
    shape.props.height *= shape.scaleY()

    shape.setters.width(shape.props.width)
    shape.setters.height(shape.props.height)

    shape.scaleX(1)
    shape.scaleY(1)
    shape.props.rotation = validDeg(shape.rotation())
  }, () => {
    updateShape(shape, {
      x: shape.x() - shape.props.width / 2,
      y: shape.y() - shape.props.height / 2,
    }, true)
  })

  applyPropsToShape(shape.props, shape.setters)

return shape
}
