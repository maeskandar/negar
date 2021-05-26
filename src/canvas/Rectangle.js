import React from "react"
import Konva from "konva"
import { Rect, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

export function newRectangle(x = 50, y = 50,) {
  return {
    id: v1(),
    kind: shapeKinds.Reactangle,
    
    x, y,
    width: 100,
    height: 100,
    rotation: 0,
    
    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    stroke: DEFAULT_STROKE_COLOR,
    
    strokeWidth: DEFAULT_STROKE_WIDTH,
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
        {...shapeProps}

        offsetX={shapeProps.width / 2}
        offsetY={shapeProps.height / 2}
        draggable={isSelected}

        onClick={onSelect}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotation) => {
          onChange({
            ...shapeProps,
            rotation: rotation,
            width: shapeProps.width * scale.x,
            height: shapeProps.height * scale.y,
          })
        })}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}