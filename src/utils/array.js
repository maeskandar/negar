export function replaceInArray(array, index, element) {
  let arrc = array.slice()
  arrc[index] = element
  return arrc
}
export function removeInArray(array, index) {
  let myArray = array.slice()
  myArray.splice(index, 1)
  return myArray
}
export function addToArray(array, item) {
  return array.concat([item])
}
export function cleanArray(arr) {
  arr.length = 0
}

export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false

  for (let i = 0; i < arr1.length; i++)
    if (arr1[i] !== arr2[i])
      return false

  return true
}

export const
  oddIndexes = (arr) => arr.filter((_, i) => i % 2 === 1),
  evenIndexes = (arr) => arr.filter((_, i) => i % 2 === 0),

  apply2DScale = (arr, scaleX, scaleY) =>
    arr.map((p, i) => p * (i % 2 === 0 ? scaleX : scaleY))
