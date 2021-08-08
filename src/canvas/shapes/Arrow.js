import Konva from "konva"

import { shapeKinds } from '..'
import {
  addCommonEvents,
  everyShapeProps, closedShapeProps, closedLine
} from "../abstract"

import { oddIndexes, evenIndexes, apply2DScale, apply2DScaleProtected } from '../../utils/array'
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
  ORIGIN_HEIGHT = minMaxDistance(oddIndexes(ORIGIN_POINTS)),
  MIN_ORIGTIN_POINTS = apply2DScale(ORIGIN_POINTS, 15 / ORIGIN_WIDTH, 30 / ORIGIN_HEIGHT)

export function newArrow(options = { x: 0, y: 0, width: 100, height: 100, rotation: 0 }) {
  let shape = new Konva.Line({
    kind: shapeKinds.Arrow,

    ...everyShapeProps(),
    ...closedShapeProps(),
    ...closedLine(apply2DScale(ORIGIN_POINTS,
      options.width / ORIGIN_WIDTH,
      options.height / ORIGIN_HEIGHT)),

    ...options,
  })

  function applyScale(sx, sy) {
    shape.points(apply2DScaleProtected(shape.points(), sx, sy, MIN_ORIGTIN_POINTS))
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
    width: (w) => applyScale(w / shape.attrs.width, 1),
    height: (h) => applyScale(1, h / shape.attrs.height),
  }

  return shape
}