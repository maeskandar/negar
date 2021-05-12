
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

export function setHasParamsAnd(s, ...params) {
  for (const p of params)
    if (!s.has(p))
      return false
  return true
}
export function setHasParamsOr(s, ...params) {
  for (const p of params)
    if (s.has(p))
      return true
  return false
}