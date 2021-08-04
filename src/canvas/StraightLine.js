import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from './'
import { commonShapeProps, addCommonEvents } from './abstract'

import { apply2DScale } from '../utils/array'

export function newStraghtLine(points) {
  let
    deltax = points[2] - points[0],
    deltay = points[3] - points[1]

  let shape = new Konva.Line( {
    ...commonShapeProps(),
    kind: shapeKinds.StraghtLine,

    x: points[0],
    y: points[1],
    width: deltax,
    height: deltay,
    points: [0, 0, deltax, deltay],
    rotation: 0,

    opacity: 1,

    lineCap: 'round',
    lineJoin: 'round',
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
  })

  addCommonEvents(shape, () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)

    let newp = apply2DScale(shape.attrs.points, sx, sy)
    shape.points(newp)
  })

  shape.setters = {
    width: (w) => {
      let newp = apply2DScale(shape.attrs.points, w / shape.attrs.width, 1)
      shape.points(newp)
    },
    height: (h) => {
      let newp = apply2DScale(shape.attrs.points, 1, h / shape.attrs.height)
      shape.points(newp)
    }
  }

  return shape
}