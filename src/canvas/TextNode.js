import { useState, useRef, useEffect } from "react"
import { Text, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds, onDragEndCommon, resetTransform, DEFAULT_STROKE_WIDTH } from "."
import { isEdge, isFirefox, isSafari } from "../utils/browser"

export function newTextNode(text) {
  return {
    id: v1(),
    kind: shapeKinds.Text,
    text: text,

    x: 200,
    y: 200,
    width: 200,
    
    fill: "#000",
    stroke: "#000",
    opacity: 1,
    rotation: 0,
    
    fontSize: 50,
    fontFamily: "Shabnam",
    strokeWidth: 0,
    align: 'right',
  }
}

function ignore() {
  let stage, textarea, state, textNode

  let textPosition = textNode.absolutePosition()
  // then lets find position of stage container on the page:
  let stageBox = stage.container().getBoundingClientRect()
  let areaPosition = {
    x: stageBox.left + textPosition.x,
    y: stageBox.top + textPosition.y,
  }

  state.on("click", function (e) {
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

    let rotation = textNode.rotation()
    let transform = ""

    if (rotation)
      transform += "rotateZ(" + rotation + "deg)"

    let px = 0
    if (isFirefox())
      px += 2 + Math.round(textNode.fontSize() / 20)


    transform += "translateY(-" + px + "px)"
    textarea.style.transform = transform
    textarea.style.height = "auto"
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + "px"
    textarea.focus()

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize()
      }
      // some extra fixes on different browsers
      if (isSafari() || isFirefox()) {
        newWidth = Math.ceil(newWidth)
      }
      if (isEdge()) {
        newWidth += 1
      }
      textarea.style.width = newWidth + "px"
    }

    textarea.addEventListener("keydown", (e) => {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value)
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) { }
    })

    textarea.addEventListener("keydown", function (e) {
      let scale = textNode.getAbsoluteScale().x
      setTextareaWidth(textNode.width() * scale)
      textarea.style.height = "auto"
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + "px"
    })


    function removeTextarea(params) { }

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        removeTextarea()
      }
    }

    setTimeout(() =>
      window.addEventListener("click", handleOutsideClick))

  })
}


export function TextNode({ shapeProps, isSelected, onSelect, onChange }) {
  const
    shapeRef = useRef(),
    trRef = useRef(),
    [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 }),
    [isEditing, setIsEditing] = useState(false),
    [text, setText] = useState('')


  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }

    if (rect.width === 0 && isEditing) {
      setRect(shapeRef.current.getClientRect())
    }

  }, [shapeRef, isSelected, isEditing, setRect])


  return (
    <>
      { !isEditing && <Text
        ref={shapeRef}
        {...shapeProps}

        offsetX={rect.width / 2}
        offsetY={rect.height / 2}
        draggable={isSelected}

        onClick={onSelect}
        onDblClick={() => setIsEditing(true)}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotation) => {
          onChange({
            ...shapeProps,
            rotation,
            width: shapeProps.width * scale.x,
            height: shapeProps.height * scale.y,
          })
        })}
      />}
      {!isEditing && isSelected && <Transformer ref={trRef} />}

      { isEditing && <textarea className="text-editing m-0 p-0"
        value={text}
        onKeyPress={e => setText(e.target.value)}
        style={{}}
      >

      </textarea>}
    </>
  )
}

// ------------------- CLASSIC WAY --------------------------

// const uuidv1 = require("uuid/dist/v1");
// export const addTextNode = (stage, layer, text, font) => {
//   const
//     id = v1(),
//     textNode = new Konva.Text({
//       id,
//       text,

//       x: 200,
//       y: 200,
//       width: 200,

//       fontSize: 30,
//       fontFamily: font,
//       align: 'right',
//       padding: '10'
//     })


//   layer.add(textNode)
//   let tr = new Konva.Transformer({
//     node: textNode,
//     enabledAnchors: ["middle-left", "middle-right"],
//     // set minimum width of text
//     boundBoxFunc: (oldBox, newBox) => {
//       newBox.width = Math.max(30, newBox.width)
//       return newBox
//     },
//   })

//   stage.on("click", function (e) {
//     if (!this.clickStartShape) return

//     if (e.target._id === this.clickStartShape._id) {
//       layer.add(tr)
//       tr.attachTo(e.target)
//       layer.draw()
//     } else {
//       tr.detach()
//       layer.draw()
//     }
//   })

//   textNode.on("transform", () => { // reset scale, so only with is changing by transformer
//     textNode.setAttrs({
//       width: textNode.width() * textNode.scaleX(),
//       scaleX: 1,
//     })
//   })

//   layer.add(tr)
//   layer.draw()

//   textNode.on("dblclick", () => {
//     // hide text node and transformer:
//     textNode.hide()
//     tr.hide()
//     layer.draw()
//     // create textarea over canvas with absolute position
//     // first we need to find position for textarea
//     // how to find it?
//     // at first lets find position of text node relative to the stage:
//     let textPosition = textNode.absolutePosition()
//     // then lets find position of stage container on the page:
//     let stageBox = stage.container().getBoundingClientRect()
//     // so position of textarea will be the sum of positions above:
//     let areaPosition = {
//       x: stageBox.left + textPosition.x,
//       y: stageBox.top + textPosition.y,
//     }
//     // create textarea and style it
//     let textarea = document.createElement("textarea")
//     document.body.appendChild(textarea)
//     // apply many styles to match text on canvas as close as possible
//     // remember that text rendering on canvas and on the textarea can be different
//     // and sometimes it is hard to make it 100% the same. But we will try...
//     textarea.value = textNode.text()
//     textarea.style.position = "absolute"
//     textarea.style.top = areaPosition.y + "px"
//     textarea.style.left = areaPosition.x + "px"
//     textarea.style.width = textNode.width() - textNode.padding() * 2 + "px"
//     textarea.style.height =
//       textNode.height() - textNode.padding() * 2 + 5 + "px"
//     textarea.style.fontSize = textNode.fontSize() + "px"
//     textarea.style.border = "none"
//     textarea.style.padding = "0px"
//     textarea.style.margin = "0px"
//     textarea.style.overflow = "hidden"
//     textarea.style.background = "none"
//     textarea.style.outline = "none"
//     textarea.style.resize = "none"
//     textarea.style.lineHeight = textNode.lineHeight()
//     textarea.style.fontFamily = textNode.fontFamily()
//     textarea.style.transformOrigin = "left top"
//     textarea.style.textAlign = textNode.align()
//     textarea.style.color = textNode.fill()

//     let rotation = textNode.rotation()
//     let transform = ""

//     if (rotation) {
//       transform += "rotateZ(" + rotation + "deg)"
//     }
//     let px = 0

//     if (isFirefox()) {
//       px += 2 + Math.round(textNode.fontSize() / 20)
//     }

//     transform += "translateY(-" + px + "px)"
//     textarea.style.transform = transform
//     textarea.style.height = "auto"
//     // after browsers resized it we can set actual value
//     textarea.style.height = textarea.scrollHeight + 3 + "px"
//     textarea.focus()

//     function removeTextarea() {
//       textarea.parentNode.removeChild(textarea)
//       window.removeEventListener("click", handleOutsideClick)
//       textNode.show()
//       tr.show()
//       tr.forceUpdate()
//       layer.draw()
//     }

//     function setTextareaWidth(newWidth) {
//       if (!newWidth) {
//         // set width for placeholder
//         newWidth = textNode.placeholder.length * textNode.fontSize()
//       }
//       // some extra fixes on different browsers
//       if (isSafari() || isFirefox()) {
//         newWidth = Math.ceil(newWidth)
//       }
//       if (isEdge()) {
//         newWidth += 1
//       }
//       textarea.style.width = newWidth + "px"
//     }

//     textarea.addEventListener("keydown", (e) => {
//       // hide on enter
//       // but don't hide on shift + enter
//       if (e.keyCode === 13 && !e.shiftKey) {
//         textNode.text(textarea.value)
//         removeTextarea()
//       }
//       // on esc do not set value back to node
//       if (e.keyCode === 27) {
//         removeTextarea()
//       }
//     })

//     textarea.addEventListener("keydown", function (e) {
//       let scale = textNode.getAbsoluteScale().x
//       setTextareaWidth(textNode.width() * scale)
//       textarea.style.height = "auto"
//       textarea.style.height =
//         textarea.scrollHeight + textNode.fontSize() + "px"
//     })

//     function handleOutsideClick(e) {
//       if (e.target !== textarea) {
//         removeTextarea()
//       }
//     }

//     setTimeout(() =>
//       window.addEventListener("click", handleOutsideClick))
//   })
// }