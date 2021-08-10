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
    EmptyStage: 9,
  }

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.StraghtLine || kindNumber === shapeKinds.CustomLine
}
export function isShape(kindNumber) {
  return kindNumber < 7
}
export function isStage(kindNumber) {
  return kindNumber >= 7
}