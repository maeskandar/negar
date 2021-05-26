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

    node.setRotation(-(node.rotaion || 0))

    func(event, { x: sx, y: sy }, Math.floor(rotation < 0 ? 360 + rotation : rotation))
  }
}

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.CustomLine || kindNumber === shapeKinds.StraghtLine
}

export const
  DEFAULT_STROKE_WIDTH = 4,
  DEFAULT_STROKE_COLOR = 'black'