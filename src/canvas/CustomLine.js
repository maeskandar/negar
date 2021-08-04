import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from './'
import { commonShapeProps } from './abstract'

import { minMaxDistance } from "../utils/math"
import { oddIndexes, evenIndexes, apply2DScale } from "../utils/array"


export function newCustomLine(points) {
  let
    originPoints = [0, 0,
      ...points.slice(2).map((p, i) => p - (i % 2 === 0 ? points[0] : points[1]))],

    originWidth = minMaxDistance(evenIndexes(originPoints)),
    originHeight = minMaxDistance(oddIndexes(originPoints))

  let shape = {
    kind: shapeKinds.CustomLine,
    ...commonShapeProps(),

    originPoints, originWidth, originHeight, // keep the original values to apply tranformation correctly
    points: originPoints,
    x: points[0] + originWidth / 2,  // to fill offset
    y: points[1] + originHeight / 2, // to fill offset

    width: originWidth,
    height: originHeight,
    rotation: 0,

    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
    opacity: 1,

    lineCap: 'round',
    lineJoin: 'round',
  }

  // TODO
  // offsetX = { shapeProps.width / 2 }
  // offsetY = { shapeProps.height / 2 }
  // onChange({
  //   width: shapeProps.width * scale.x,
  //   height: shapeProps.height * scale.y,
  // })
  // shapeProps.points = apply2DScale(shapeProps.originPoints,
  //   shapeProps.width / shapeProps.originWidth,
  //   shapeProps.height / shapeProps.originHeight)
  
  return shape
}

