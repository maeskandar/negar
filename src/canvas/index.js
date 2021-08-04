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

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.StraghtLine || kindNumber === shapeKinds.CustomLine
}

export function hasStroke(kindNumber) {
  return kindNumber !== shapeKinds.Text || kindNumber !== shapeKinds.Image
}


// TODO import/exprot all shapes here