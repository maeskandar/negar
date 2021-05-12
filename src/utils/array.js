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
  let myArray = array.slice()
  myArray.push(item)
  return myArray
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
