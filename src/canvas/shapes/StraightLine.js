import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '../'
import { everyShapeProps, addCommonEvents, basicShape } from '../abstract'

import {  apply2DScaleProtected } from '../../utils/array'

export function newStraghtLine(points) {
  let
    deltax = points[2] - points[0],
    deltay = points[3] - points[1]

  let shape = new Konva.Line({
    kind: shapeKinds.StraghtLine,
    opacity: 1,
    points: [0, 0, deltax, deltay],
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
    lineCap: 'round',
    lineJoin: 'round',

    ...everyShapeProps(),
    ...basicShape(points[0], points[1], deltax, deltay, 0),
  })

  function applyScale(sx, sy) {
    shape.points(apply2DScaleProtected(shape.points(), sx, sy))
  }

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())
    shape.scaleX(1)
    shape.scaleY(1)
  })

  shape.setters = {
    width: (w) => applyScale(w / shape.attrs.width, 1),
    height: (h) => applyScale(1, h / shape.attrs.height),
  }

  return shape
}