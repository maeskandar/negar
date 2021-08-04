import Konva from "konva"

import { shapeKinds } from './'
import { commonShapeProps, closedShapeProps, basicCoordinate, basicSize } from "./abstract"

import { oddIndexes, evenIndexes, apply2DScale } from '../utils/array'
import { minMaxDistance } from '../utils/math'

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
 
  // TODO custom events + valid deg
  // shapeProps.points = apply2DScale(ORIGIN_POINTS,
  //   shapeProps.width / ORIGIN_WIDTH,
  //   shapeProps.height / ORIGIN_HEIGHT)
  
  //   onChange({
  //     ...shapeProps,
  //     rotation,
  //     width: shapeProps.width * scale.x,
  //     height: shapeProps.height * scale.y,
  //   })
  
  return shape
}