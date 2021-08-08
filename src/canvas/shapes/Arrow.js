import Konva from "konva"

import { shapeKinds } from '..'
import {
  addCommonEvents,
  everyShapeProps, closedShapeProps, closedLine, basicShape
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

export function newArrow() {
  let shape = new Konva.Line({
    kind: shapeKinds.Arrow,
    ...everyShapeProps(),
    ...basicShape(0, 0, ORIGIN_WIDTH, ORIGIN_HEIGHT, 0), // custom property
    ...closedShapeProps(),
    ...closedLine(ORIGIN_POINTS)
  })

  function applyScale(sx, sy) {
    shape.points(apply2DScale(shape.points(), sx, sy))
  }

  addCommonEvents(shape, () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)

    applyScale(sx, sy)

    shape.attrs.width *= sx
    shape.attrs.height *= sy
    shape.attrs.rotation = validDeg(shape.rotation())
  })

  shape.setters = {
    width: (w) => applyScale(w / shape.attrs.width, 1),
    height: (h) => applyScale(1, h / shape.attrs.height),
  }

  return shape
}