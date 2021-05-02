import Konva from "konva"

import v1 from 'uuid/dist/v1'

export const addTextNode = (stage, layer) => {
  const
    id = v1(),
    textNode = new Konva.Text({
      text: "type here",
      x: 50,
      y: 80,
      fontSize: 20,
      draggable: true,
      width: 200,
      id,
    })

  layer.add(textNode)

  let tr = new Konva.Transformer({
    node: textNode,
    enabledAnchors: ["middle-left", "middle-right"],
    // set minimum width of text
    boundBoxFunc: (oldBox, newBox) => {
      newBox.width = Math.max(30, newBox.width)
      return newBox
    },
  })

  stage.on("click", function (e) {
    if (!this.clickStartShape)
      return

    if (e.target._id === this.clickStartShape._id) {
      layer.add(tr)
      tr.attachTo(e.target)
      layer.draw()
    } else {
      tr.detach()
      layer.draw()
    }
  })

  textNode.on("transform", () => {
    // reset scale, so only with is changing by transformer
    textNode.setAttrs({
      width: textNode.width() * textNode.scaleX(),
      scaleX: 1,
    })
  })

  layer.add(tr)
  layer.draw()

  textNode.on("dblclick", () => {
    // hide text node and transformer:
    textNode.hide()
    tr.hide()
    layer.draw()
    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?
    // at first lets find position of text node relative to the stage:
    let textPosition = textNode.absolutePosition()
    // then lets find position of stage container on the page:
    let stageBox = stage.container().getBoundingClientRect()
    // so position of textarea will be the sum of positions above:
    let areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    }
    // create textarea and style it
    let textarea = document.createElement("textarea")
    document.body.appendChild(textarea)
    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = textNode.text()
    textarea.style.position = "absolute"
    textarea.style.top = areaPosition.y + "px"
    textarea.style.left = areaPosition.x + "px"
    textarea.style.width = textNode.width() - textNode.padding() * 2 + "px"
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + "px"
    textarea.style.fontSize = textNode.fontSize() + "px"
    textarea.style.border = "none"
    textarea.style.padding = "0px"
    textarea.style.margin = "0px"
    textarea.style.overflow = "hidden"
    textarea.style.background = "none"
    textarea.style.outline = "none"
    textarea.style.resize = "none"
    textarea.style.lineHeight = textNode.lineHeight()
    textarea.style.fontFamily = textNode.fontFamily()
    textarea.style.transformOrigin = "left top"
    textarea.style.textAlign = textNode.align()
    textarea.style.color = textNode.fill()

    let
      rotation = textNode.rotation(),
      transform = ""

    if (rotation) {
      transform += `rotateZ(${rotation}deg)`
    }

    let
      px = 0,
      isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1

    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20)
    }

    transform += `translateY(-${px}px)`
    textarea.style.transform = transform
    textarea.style.height = "auto"
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + "px"
    textarea.focus()

    function removeTextarea() {
      textarea.parentNode.removeChild(textarea)
      window.removeEventListener("click", handleOutsideClick)
      textNode.show()
      tr.show()
      tr.forceUpdate()
      layer.draw()
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) { // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize()
      }
      // some extra fixes on different browsers
      const
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
        isEdge = document.documentMode || /Edge/.test(navigator.userAgent)

      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth)
      }
      else if (isEdge)
        newWidth += 1

      textarea.style.width = newWidth + "px"
    }

    textarea.addEventListener("keydown", (e) => {
      // hide on enter
      // but don't hide on shift + enter
      if (e.key === "Escape" && !e.shiftKey) {
        textNode.text(textarea.value)
        removeTextarea()
      }
      // on esc do not set value back to node
      if (e.key === "Enter") {
        removeTextarea()
      }
    })

    textarea.addEventListener("keydown", (e) => {
      let scale = textNode.getAbsoluteScale().x

      setTextareaWidth(textNode.width() * scale)
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + "px"
    })

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        removeTextarea()
      }
    }

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick)
    })
  })

  return id
}