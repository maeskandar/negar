import React from "react"
import Konva from "konva"
import { Rect, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds } from './'

export function newRectangle(x,y) {
  return {
    id: v1(),
    kind: shapeKinds.Reactangle,

    x, y,
    width: 100,
    height: 100,
    fill: Konva.Util.getRandomColor(),
  }
}

export function Rectangle({ shapeProps, isSelected, onSelect, onChange }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef()

  React.useEffect(() => {
    if (isSelected) { // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Rect
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