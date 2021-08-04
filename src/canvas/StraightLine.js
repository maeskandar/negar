import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from './'
import { updateShape } from './manager'
import { commonShapeProps } from './abstract'

import { apply2DScale } from '../utils/array'

export function newStraghtLine(points) {
  let
    deltax = points[2] - points[0],
    deltay = points[3] - points[1]

  let shape = {
    ...commonShapeProps(),
    kind: shapeKinds.StraghtLine,

    x: points[0] + deltax / 2,
    y: points[1] + deltay / 2,
    points: [0, 0, deltax, deltay],
    rotation: 0,

    opacity: 1,

    lineCap: 'round',
    lineJoin: 'round',
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
  }

  shape.on('transform', () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)

    shape.attrs.points = apply2DScale(shape.attrs.points, sx, sy)
    updateShape(shape.attrs.id)
  })

  // TODO shape.on("dragmove") 
  return shape
}