export function replaceInArray(array, index, element){
  let arrc = array.slice()
  arrc[index] = element
  return arrc 
}