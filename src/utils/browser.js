export const
  isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  isFirefox = () => navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
  isEdge = () => document.documentMode || /Edge/.test(navigator.userAgent)
