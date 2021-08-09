import Konva from "konva"

import { DEFAULT_STROKE_WIDTH, shapeKinds } from '../'
import { addCommonEvents, applyPropsToShape, closedShapeProps, everyShapeProps } from '../abstract'

export function newRectangle(options = {}) {
  let props = { // defaults
    ...everyShapeProps(),
    kind: shapeKinds.Reactangle,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: "#eee",
    borderColor: "#424242",
    borderSize: DEFAULT_STROKE_WIDTH,
    opacity: 1,

    ...options,
  }

  let shape = new Konva.Rect({
    ...everyShapeProps(),
    ...closedShapeProps(),
  })

  shape.props = props
  shape.setters = {
    width: w => shape.width(w),
    height: h => shape.height(h),
    x: v => shape.x(v),
    y: v => shape.y(v),
    fill: c => shape.fill(c),
    borderColor: c => shape.stroke(c),
    borderSize: s => shape.strokeWidth(s),
    opacity: o => shape.opacity(o),
    rotation: r => shape.rotation(r),
    draggable: d => shape.draggable(d),
  }

  applyPropsToShape(shape.props, shape.setters)
  addCommonEvents(shape)

  return shape
}