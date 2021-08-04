import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from './'
import { commonShapeProps, addCommonEvents } from './abstract'

import { minMaxDistance, validDeg } from "../utils/math"
import { oddIndexes, evenIndexes, apply2DScale } from "../utils/array"


export function newCustomLine(points) {
  let
    originPoints = [0, 0,
      ...points.slice(2).map((p, i) => p - (i % 2 === 0 ? points[0] : points[1]))],

    originWidth = minMaxDistance(evenIndexes(originPoints)),
    originHeight = minMaxDistance(oddIndexes(originPoints))

  let shape = new Konva.Line({
    kind: shapeKinds.CustomLine,
    ...commonShapeProps(),

    originPoints, originWidth, originHeight, // keep the original values to apply tranformation correctly
    points: originPoints,
    x: points[0],
    y: points[1],

    // TODO offset later
    // x: points[0] + originWidth / 2,  // to fill offset
    // y: points[1] + originHeight / 2, // to fill offset

    width: originWidth,
    height: originHeight,
    rotation: 0,

    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
    opacity: 1,

    lineCap: 'round',
    lineJoin: 'round',
  })

  // TODO we can add little bit more abstraction by the way
  addCommonEvents(shape, () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)

    shape.attrs.width *= sx
    shape.attrs.height *= sy

    let newPoints = apply2DScale(shape.attrs.originPoints,
      shape.attrs.width / shape.attrs.originWidth,
      shape.attrs.height / shape.attrs.originHeight)

    shape.points(newPoints)
    shape.attrs.rotation = validDeg(shape.rotation())
  })


  shape.setters = {
    width: (w) => {
      let newp = apply2DScale(shape.attrs.originPoints, w / shape.attrs.originWidth, 1)
      shape.points(newp)
    },
    height: (h) => {
      let newp = apply2DScale(shape.attrs.originPoints, 1, h / shape.attrs.originHeight)
      shape.points(newp)
    }
  }

  return shape
}