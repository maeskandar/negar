import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '../'
import { everyShapeProps, addCommonEvents, basicShape, closedLine } from '../abstract'

import { minMaxDistance, validDeg } from "../../utils/math"
import { oddIndexes, evenIndexes, apply2DScale } from "../../utils/array"


export function newCustomLine(points) {
  let
    originPoints = [0, 0,
      ...points.slice(2).map((p, i) => p - (i % 2 === 0 ? points[0] : points[1]))],

    originWidth = minMaxDistance(evenIndexes(originPoints)),
    originHeight = minMaxDistance(oddIndexes(originPoints))

  let shape = new Konva.Line({
    kind: shapeKinds.CustomLine,
    opacity: 1,
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
    points: originPoints,
    lineCap: 'round',
    lineJoin: 'round',

    ...everyShapeProps(),
    ...basicShape(points[0], points[1], originWidth, originHeight, 0)
  })

  function applyScale(sx, sy) {
    shape.points(apply2DScale(shape.points(), sx, sy))
  }

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())

    shape.attrs.width *= shape.scaleX()
    shape.attrs.height *= shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)

    shape.attrs.rotation = validDeg(shape.rotation())
  })

  shape.setters = {
    width: (w) => applyScale(w / shape.attrs.originWidth, 1),
    height: (h) => applyScale(1, h / shape.attrs.originHeight),
  }

  return shape
}