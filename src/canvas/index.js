import { updateShape } from "./manager"
import { validDeg } from "../utils/math"

export const
  DEFAULT_STROKE_WIDTH = 4,
  DEFAULT_STROKE_COLOR = 'black'

export const shapeKinds = {
  StraghtLine: 0,
  CustomLine: 1,
  Circle: 2,
  Reactangle: 3,
  CustomShape: 4,
  Image: 5,
  Text: 6,
}

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

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.StraghtLine || kindNumber === shapeKinds.CustomLine
}

export function hasStroke(kindNumber) {
  return kindNumber !== shapeKinds.Text || kindNumber !== shapeKinds.Image
}
