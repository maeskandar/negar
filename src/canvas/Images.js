import React from "react"
import { Image, Transformer } from "react-konva"
import useImage from "use-image"
import v1 from 'uuid/dist/v1'

import { shapeKinds } from './'

export function newImage(content) {
  return {
    id: v1(),
    kind: shapeKinds.Image,
    
    content,
  }
}

export function MyImage({ shapeProps, isSelected, onSelect, onChange, imageUrl }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef(),
    [image] = useImage(imageUrl)

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Image
        onClick={onSelect}
        image={image}
        ref={shapeRef}
        draggable = {isSelected}
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={e => {
          const
            node = shapeRef.current,
            scaleX = node.scaleX(),
            scaleY = node.scaleY()

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