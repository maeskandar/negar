import Konva from "konva"

import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH, shapeKinds } from '..'
import {
  addCommonEvents,
  everyShapeProps, closedLine, everyShapeAttrs, applyPropsToShape, applyDefaultSetters
} from "../abstract"

import { oddIndexes, evenIndexes, apply2DScale } from '../../utils/array'
import { minMaxDistance, validDeg } from '../../utils/math'

const
  ORIGIN_POINTS = [
    [0, 0],
    [50, 50],
    [50, 20],
    [150, 20],
    [150, -20],
    [50, -20],
    [50, -50],
  ].map(p => [p[0], p[1] + 50]).flat(), // to make coordiantes from (0, 0)

  ORIGIN_WIDTH = minMaxDistance(evenIndexes(ORIGIN_POINTS)),
  ORIGIN_HEIGHT = minMaxDistance(oddIndexes(ORIGIN_POINTS))

export function newArrow(options = {}) {
  let props = {
    ...everyShapeProps(),
    kind: shapeKinds.Arrow,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    borderSize: DEFAULT_STROKE_WIDTH,
    borderColor: DEFAULT_STROKE_COLOR,

    ...options
  }

  let shape = new Konva.Line({
    ...everyShapeAttrs(),
    ...closedLine(apply2DScale(ORIGIN_POINTS,
      options.width / ORIGIN_WIDTH,
      options.height / ORIGIN_HEIGHT)),
  })

  shape.props = props


  function applyScale(sx, sy) {
    shape.points(apply2DScale(shape.points(), sx, sy))
  }

  shape.setters = {
    width: (w) => applyScale(w / shape.props.width, 1),
    height: (h) => applyScale(1, h / shape.props.height),
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
  ])

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())
    shape.props.width *= shape.scaleX()
    shape.props.height *= shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)
    shape.props.rotation = validDeg(shape.rotation())
  })

  applyPropsToShape(shape.props, shape.setters)
  return shape
}