import React from "react"
import { Image, Transformer } from "react-konva"
import useImage from "use-image"
import v1 from 'uuid/dist/v1'

import {resetTransform, onDragEndCommon, shapeKinds } from './'


export function newImage(content) {
  return {
    id: v1(),
    kind: shapeKinds.Image,
    content,
    opacity: 1,
    rotationDeg: 0,
    x: 100,
    y: 100,
    width: 300,
    height: 300,
  }
}

export function MyImage({ shapeProps, isSelected, onSelect, onChange, imageUrl }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef(),
    [image] = useImage(imageUrl)

  React.useEffect(() => {
    if (isSelected) { // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  // set for the first time
  if (shapeProps.width == null && image) {
    shapeProps.width = image.width
    shapeProps.height = image.height
  }

  return (
    <>
      <Image
        ref={shapeRef}
        image={image}
        {...shapeProps}
        
        offsetX={shapeProps.width / 2}
        offsetY={shapeProps.height / 2}
        draggable={isSelected}
        
        onClick={onSelect}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotationDeg) => {
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