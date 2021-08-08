import Konva from "konva"
import v1 from 'uuid/dist/v1'

import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "./"
import { updateShape, transformer } from "./manager"
import { validDeg } from "../utils/math"

// common shape events --------------------------
export function resetTransformGen(shape, custom) {
  if (custom) {
    return () => {
      if (custom()) transformer.forceUpdate()
      updateShape(shape.attrs.id)
    }
  }
  else return () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY(),
      rotation = shape.getAbsoluteRotation()

    shape.scaleX(1)
    shape.scaleY(1)

    let oldSize = shape.size()
    shape.size({
      width: oldSize.width * sx,
      height: oldSize.height * sy
    })
    shape.attrs.rotation = validDeg(rotation)

    updateShape(shape.attrs.id)
  }
}
export function onDragMoveGen(shape) {
  return () => updateShape(shape.attrs.id)
}
export function addCommonEvents(shape, transformendCustomProc) {
  shape.on('transformend', resetTransformGen(shape, transformendCustomProc))
  shape.on('dragmove', onDragMoveGen(shape))
}

// common shape props --------------------------
export function everyShapeProps() {
  return {
    id: v1(),
    draggable: false
  }
}
export function closedShapeProps() {
  return {
    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    stroke: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
  }
}
export function basicShape(x, y, w, h, rotation) {
  return {
    x, y,
    width: w,
    height: h,
    rotation,
  }
}
export function closedLine(points) {
  return {
    points,
    lineCap: 'round',
    lineJoin: 'round',
    closed: true,
  }
}