export const
  DEFAULT_STROKE_WIDTH = 4,
  DEFAULT_STROKE_COLOR = '#212121',

  shapeKinds = {
    StraghtLine: 0,
    CustomLine: 1,
    Circle: 2,
    Reactangle: 3,
    Arrow: 4,
    Image: 5,
    Text: 6,
    Mountain: 7,
    Flag: 8,
  }

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.StraghtLine || kindNumber === shapeKinds.CustomLine
}
export function hasStroke(kindNumber) {
  return kindNumber !== shapeKinds.Text || kindNumber !== shapeKinds.Image
}
export function isShape(kindNumber) {
  return kindNumber < 7
}
export function isState(kindNumber) {
  return kindNumber >= 7
}