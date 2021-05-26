export const shapeKinds = {
  Line: 0,
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

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.CustomLine || kindNumber === shapeKinds.Line
}

export const 
  DEFAULT_STROKE_WIDTH = 4, 
  DEFAULT_STROKE_COLOR = 'black'