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