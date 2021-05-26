import React, { useEffect } from "react"
import Konva from "konva"
import { Ellipse, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { resetTransform as resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'


export function newCircle(x, y) {
  return {
    id: v1(),
    kind: shapeKinds.Circle,
    x,
    y,
    rotationDeg: 0,
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
        {...shapeProps}

        // circle is an exception and doesn't need offsetX ,offsetY
        draggable={isSelected}

        onClick={onSelect}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotationDeg,) => {
          onChange({
            ...shapeProps,
            rotationDeg,
            width: shapeProps.width * scale.x,
            height: shapeProps.height * scale.y,
          })
        })}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}