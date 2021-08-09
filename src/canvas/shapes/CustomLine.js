import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '../'
import { everyShapeProps, addCommonEvents, basicShape, closedLine, everyShapeAttrs, applyPropsToShape, applyDefaultSetters } from '../abstract'

import { minMaxDistance, validDeg } from "../../utils/math"
import { oddIndexes, evenIndexes, apply2DScale } from "../../utils/array"


export function newCustomLine(points) {
  let
    originPoints = [0, 0,
      ...points.slice(2).map((p, i) => p - (i % 2 === 0 ? points[0] : points[1]))],

    shape = new Konva.Line({
      ...everyShapeAttrs(),
      points: originPoints,
      lineCap: 'round',
      lineJoin: 'round',
    })

  shape.props = {
    ...everyShapeProps(),
    kind: shapeKinds.CustomLine,
    
    x: points[0],
    y: points[1],
    width:  minMaxDistance(evenIndexes(originPoints)),
    height: minMaxDistance(oddIndexes(originPoints)),
    rotation: 0,
    borderColor: Konva.Util.getRandomColor(),
    borderSize: DEFAULT_STROKE_WIDTH,
    opacity: 1,
  }

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
    "points",
    "draggable",
  ])

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())

    shape.props.width *= shape.scaleX()
    shape.props.height *= shape.scaleY()
    shape.props.rotation = validDeg(shape.rotation())

    shape.scaleX(1)
    shape.scaleY(1)
  })

  applyPropsToShape(shape.props, shape.setters)

  return shape
}