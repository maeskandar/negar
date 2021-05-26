import React from "react"
import Konva from "konva"
import { Rect, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

export function newRectangle(x = 50, y = 50,) {
  return {
    id: v1(),
    kind: shapeKinds.Reactangle,
    x, y,
    width: 100,
    opacity: 1,
    height: 100,
    fill: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE_COLOR,
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
        ref={shapeRef}
        
        onClick={onSelect}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={e => {
          const
            node = shapeRef.current,
            scaleX = node.scaleX(),
            scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}