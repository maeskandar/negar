export const shapeKinds = {
  Line: 0,
  CustomLine: 1,
  Circle: 2,
  Reactangle: 3,
  CustomShape: 4,
  Image: 5,
  Text: 6,
}

export function isKindOfLine(kindNumber) {
  return kindNumber === shapeKinds.CustomLine || kindNumber === shapeKinds.Line
}