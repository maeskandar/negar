import Konva from "konva"
import v1 from 'uuid/dist/v1'
import { Line } from "react-konva"


import { shapeKinds, DEFAULT_STROKE_WIDTH } from './'

export function newSimpleLine(points) {
  return {
    id: v1(),
    kind: shapeKinds.StraghtLine,

    points,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    lineCap: 'round',
    lineJoin: 'round',
    
    stroke: Konva.Util.getRandomColor(),
  }
}
export function SimpleLine({shapeProps}) {
  return <Line {...shapeProps} />
}