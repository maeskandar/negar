import { useRef, useEffect } from "react"
import { Text, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds, onDragEndCommon, resetTransform } from "."

export function newTextNode(text) {
  return {
    id: v1(),
    kind: shapeKinds.Text,
    text: text,

    x: 200,
    y: 200,
    width: 200,

    fill: "#000",
    stroke: "#000", // we can add text shadom for textarea
    opacity: 1,
    rotation: 0,

    strokeWidth: 0,
    fontSize: 30,
    fontFamily: "Shabnam",
    lineHeight: 1,
    align: 'right',
  }
}

export function TextNode({ shapeProps, isSelected, onSelect, onChange}) {
  const
    shapeRef = useRef(),
    trRef = useRef()

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [trRef, isSelected])
  
  return (
    <>
      <Text
        ref={shapeRef}
        {...shapeProps}

        // offsetX={rect.width / 2}
        draggable={isSelected}

        onClick={onSelect}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotation) => {
          onChange({
            ...shapeProps,
            rotation,
            width: shapeProps.width * scale.x,
          })
        })} />

      { isSelected && <Transformer ref={trRef} />}
    </>
  )
}
