
// remove the item in the set and return the set
export function removeInSet(s, item) {
  let n = new Set(s)
  n.delete(item)
  return n
}

export function addToSet(s, v) {
  let n = new Set(s)
  n.add(v)
  return n
}

