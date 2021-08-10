import Konva from "konva"

import { DEFAULT_STROKE_WIDTH, shapeKinds } from '../'
import { addCommonEvents, applyDefaultSetters, applyPropsToShape, closedShapeProps, everyShapeProps } from '../abstract'

export function newRectangle(options = {}, isMain= true) {
  let props = { // defaults
    ...everyShapeProps(),
    kind: shapeKinds.Reactangle,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: Konva.Util.getRandomColor(),
    borderColor: "#424242",
    borderSize: DEFAULT_STROKE_WIDTH,
    opacity: 1,

    dash: [],

    ...options,
  }

  let shape = new Konva.Rect({
    isMain,
    ...everyShapeProps(),
    ...closedShapeProps(),
  })

  shape.props = props
  shape.setters = {}
  applyDefaultSetters(shape, shape.setters, [
    "width",
    "height",
    "x",
    "y",
    "fill",
    "dash",
    "opacity",
    "rotation",
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
    "draggable",
  ])

  applyPropsToShape(shape.props, shape.setters)
  addCommonEvents(shape)

  return shape
}