import React, { useEffect } from "react"
import Konva from "konva"
import { Ellipse, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

export function newCircle(x, y) {
  return {
    id: v1(),
    kind: shapeKinds.Circle,
    x: 200, y: 200,
    width: 100,
    height: 100,
    fill: Konva.Util.getRandomColor(),
    opacity: 1,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE_COLOR,
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
      <Ellipse
        ref={shapeRef}
        
        onClick={onSelect}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={e => {
          const
            node = shapeRef.current,
            sx = node.scaleX(),
            sy = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            width: node.width() * sx,
            height: node.height() * sy,
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}