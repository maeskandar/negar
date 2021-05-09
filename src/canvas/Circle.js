import React, { useEffect } from "react"
import Konva from "konva"
import { Circle, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds } from './'

export function newCircle(x, y) {
  return {
    id: v1(),
    kind: shapeKinds.Circle,

    x, y,
    width: 100,
    height: 100,
    fill: Konva.Util.getRandomColor(),
  }
}

export function MyCircle({ shapeProps, isSelected, onSelect, onChange }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef()

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Circle
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable = {isSelected}
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          const
            node = shapeRef.current,
            scaleX = node.scaleX(),
            scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          })

        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}