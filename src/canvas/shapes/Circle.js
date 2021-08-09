import Konva from "konva"

import { shapeKinds } from '../'
import { validDeg } from "../../utils/math"
import {
  addCommonEvents, everyShapeAttrs, closedShapeProps, everyShapeProps, applyPropsToShape,
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
    fill: "#eee",
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
    x: v => shape.x(v),
    y: v => shape.y(v),
    fill: c => shape.fill(c),
    rotation: v => shape.rotation(v),
    draggable: d => shape.draggable(d),
    opacity: o => shape.opacity(o),
    borderColor: c => shape.stroke(c),
    borderSize: s => shape.strokeWidth(s),
    opacity: o => shape.opacity(o),
  }

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
