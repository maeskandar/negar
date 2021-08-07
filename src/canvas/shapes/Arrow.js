import Konva from "konva"

import { shapeKinds } from '..'
import {
  addCommonEvents,
  commonShapeProps, closedShapeProps, basicCoordinate, basicSize
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
    ...commonShapeProps(),
    kind: shapeKinds.CustomShape,

    ...basicCoordinate(),
    ...basicSize(ORIGIN_WIDTH, ORIGIN_HEIGHT), // custom property

    ...closedShapeProps(),

    points: ORIGIN_POINTS,
    lineCap: 'round',
    lineJoin: 'round',
    closed: true,
  })

  addCommonEvents(shape, () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY()

      shape.scaleX(1)
      shape.scaleY(1)

      shape.attrs.width *= sx
      shape.attrs.height *= sy

    let newPoints = apply2DScale(ORIGIN_POINTS,
      shape.attrs.width  / ORIGIN_WIDTH,
      shape.attrs.height / ORIGIN_HEIGHT)

    shape.points(newPoints)
    shape.attrs.rotation = validDeg(shape.rotation())
  })

  shape.setters = {
    width: (w) => {
      let newp = apply2DScale(shape.attrs.points, w/shape.attrs.width, 1)
      shape.points(newp)
    },
    height: (h) => {
      let newp = apply2DScale(shape.attrs.points, 1, h/shape.attrs.height)
      shape.points(newp)
    }
  }

  return shape
}