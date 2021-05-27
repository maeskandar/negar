import { validDeg } from "../utils/math"

export const shapeKinds = {
  StraghtLine: 0,
  CustomLine: 1,
  Circle: 2,
  Reactangle: 3,
  CustomShape: 4,
  Image: 5,
  Text: 6,
}

export function onDragEndCommon(shapeProps, onChange) {
  return (e) => onChange({
    ...shapeProps,
    x: e.target.x(),
    y: e.target.y(),
  })
}

export function resetTransform(shapeRef, func) {
  return (event) => {
    let
      node = shapeRef.current,
      sx = node.scaleX(),
      sy = node.scaleY(),
      rotation = node.getAbsoluteRotation()

    node.scaleX(1)
    node.scaleY(1)

    node.setRotation(-node.rotaion || 0)

    rotation = validDeg(Math.trunc(rotation))
    // if (sx * sy < 0) // shaped flipped (think of mirror)
    // rotation = validDeg(rotation + (sx < 0 ? +180 : 270))

    console.log(rotation)
    func(event, { x: Math.abs(sx), y: Math.abs(sy) }, rotation)
  }
}

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.StraghtLine || kindNumber === shapeKinds.CustomLine
}

export function hasStroke(kindNumber) {
  return kindNumber !== shapeKinds.Text || kindNumber !== shapeKinds.Image
}

export const
  DEFAULT_STROKE_WIDTH = 4,
  DEFAULT_STROKE_COLOR = 'black'