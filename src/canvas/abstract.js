import Konva from "konva"
import v1 from 'uuid/dist/v1'

import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "./"
import { updateShape } from "./manager"
import { validDeg } from "../utils/math"


export function resetTransformGen(shape) {
  return () => {
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

export function addCommonEvents(shape) {
  shape.on('transformend', resetTransformGen(shape))
  shape.on('dragmove', onDragMoveGen(shape))
}

export function commonShapeProps() {
  return {
    id: v1(),
    draggable: false
  }
}

export function fillableProps() {
  return {
    opacity: 1,
    fill: Konva.Util.getRandomColor(),
  }
}

export function strokeProps() {
  return {
    stroke: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
  }
}

export function closedShapeProps(){
  return {
    ...fillableProps(),
    ...strokeProps(),
  }
}

export function basicSize(w = 100, h = 100) {
  return {
    width: w,
    height: h
  }
}

export function basicCoordinate(x = 10, y = 10, rotation = 0) {
  return {
    rotation,
    x, y,
  }
}