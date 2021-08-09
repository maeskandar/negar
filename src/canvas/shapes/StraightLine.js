import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '../'
import { everyShapeProps, addCommonEvents, basicShape, applyPropsToShape, everyShapeAttrs, applyDefaultSetters } from '../abstract'

import {  replaceInArray } from '../../utils/array'
import { updateShape } from "../manager"

export function newStraghtLine(points, options = {}) {
  let
    deltax = points[2] - points[0],
    deltay = points[3] - points[1]

  let shape = new Konva.Line({
    ...everyShapeAttrs(),
    points: [0, 0, deltax, deltay],
    lineCap: 'round',
    lineJoin: 'round',
  })

  let props = {
    ...everyShapeProps(),
    kind: shapeKinds.StraghtLine,
    opacity: 1,
    borderColor: Konva.Util.getRandomColor(),
    borderSize: DEFAULT_STROKE_WIDTH,

    ...basicShape(points[0], points[1], deltax, deltay, 0),
    ...options
  }

  shape.props = props

  shape.setters = {
    width: (w) => shape.points(replaceInArray(shape.points(), 2, w)),
    height: (h) => shape.points(replaceInArray(shape.points(), 3, h)),
  }

  applyDefaultSetters(shape, shape.setters, [
    "x",
    "y",
    "fill",
    "opacity",
    "rotation",
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
    "draggable",
    "points",
  ])

  applyPropsToShape(shape.props, shape.setters)
  addCommonEvents(shape, () => {
    updateShape(shape, {
      width: shape.props.width * shape.scaleX(),
      height: shape.props.height * shape.scaleY(),
    })
    shape.scaleX(1)
    shape.scaleY(1)
  })

  return shape
}