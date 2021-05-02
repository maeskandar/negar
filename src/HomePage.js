import React, { useState } from "react"
import { Stage, Layer } from "react-konva"

import Rectangle from "./Rectangle"
import Circle from "./Circle"
import { addLine } from "./Line"
import { addTextNode } from "./TextNode"
import Image from "./Images"
import { MyVerticallyCenteredModal } from "./MyVerticallyCenteredModal"

import v1 from 'uuid/dist/v1'

function HomePage() {
  const
    [rectangles, setRectangles] = useState([]),
    [backgroundimage, setBackgroundimage] = useState('/images/pexels-eberhard-grossgasteiger-1064162.jpg'),
    [circles, setCircles] = useState([]),
    [images, setImages] = useState([]),
    [selectedId, selectShape] = useState(null),
    [shapes, setShapes] = useState([]),
    [, updateState] = React.useState(),
    [modalShow, setModalShow] = React.useState(false),
    stageEl = React.createRef(),
    layerEl = React.createRef(),
    fileUploadEl = React.createRef()

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const addRectangle = () => {
    const rect = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      fill: "red",
      id: `rect${rectangles.length + 1}`,
    }
    const rects = rectangles.concat([rect])
    setRectangles(rects)
    const shs = shapes.concat([`rect${rectangles.length + 1}`])
    setShapes(shs)
  }
  const addCircle = () => {
    const circ = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      fill: "red",
      id: `circ${circles.length + 1}`,
    }
    const circs = circles.concat([circ])
    setCircles(circs)
    const shs = shapes.concat([`circ${circles.length + 1}`])
    setShapes(shs)
  }
  const drawLine = () => {
    addLine(stageEl.current.getStage(), layerEl.current)
  }
  const eraseLine = () => {
    addLine(stageEl.current.getStage(), layerEl.current, "erase")
  }
  const drawText = () => {
    const id = addTextNode(stageEl.current.getStage(), layerEl.current)
    const shs = shapes.concat([id])
    setShapes(shs)
  }
  const drawImage = () => {
    fileUploadEl.current.click()
  }
  const forceUpdate = React.useCallback(() => updateState({}), [])
  const fileChange = (ev) => {
    let file = ev.target.files[0]

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      fileUploadEl.current.value = null

      const id = v1()
      images.push({
        content: reader.result,
        id,
      })
      setImages(images)
      shapes.push(id)
      setShapes(shapes)
      
      forceUpdate()
    }, false
    )
    if (file) {
      reader.readAsDataURL(file)
    }
  }
  const undo = () => {
    const lastId = shapes[shapes.length - 1]
    let index = circles.findIndex(c => c.id === lastId)
    if (index !== -1) {
      circles.splice(index, 1)
      setCircles(circles)
    }

    index = rectangles.findIndex(r => r.id === lastId)
    if (index !== -1) {
      rectangles.splice(index, 1)
      setRectangles(rectangles)
    }

    index = images.findIndex(r => r.id === lastId)
    if (index !== -1) {
      images.splice(index, 1)
      setImages(images)
    }

    shapes.pop()
    setShapes(shapes)
    forceUpdate()
  }
  document.addEventListener("keydown", (ev) => {
    if (ev.code === "Delete") {
      let index = circles.findIndex(c => c.id === selectedId)
      if (index !== -1) {
        circles.splice(index, 1)
        setCircles(circles)
      }

      index = rectangles.findIndex(r => r.id === selectedId)
      if (index !== -1) {
        rectangles.splice(index, 1)
        setRectangles(rectangles)
      }

      index = images.findIndex(r => r.id === selectedId)
      if (index !== -1) {
        images.splice(index, 1)
        setImages(images)
      }

      forceUpdate()
    }
  })
  const backimages = [
    {
      url: '/images/pexels-eberhard-grossgasteiger-1064162.jpg',
      title: 'forest and lake!',
      desc: 'nothing to say,beautiful!'
    },
    {
      url: '/images/pexels-martin-damboldt-814499.jpg',
      title: 'nice lake!',
      desc: 'nothing to say,beautiful!'
    },
    {
      url: '/images/pexels-roberto-shumski-1903702.jpg',
      title: 'mountains!',
      desc: 'nothing to say,beautiful!'
    }
  ]

  return (
    <div className="home-page" style={{
      textAlign: 'center',
      background: `url(${backgroundimage}) no-repeat center fixed`,
      width: '100%'
    }}>
      <MyVerticallyCenteredModal
        images={backimages}
        show={modalShow}
        setimage={setBackgroundimage}
        onHide={() => setModalShow(false)}
      />
      <h1 style={{ fontStyle: 'italic' }}>Konva Board</h1>
      <div className={"btn-group"} role="group">
        <button className={'btn btn-info'} variant="secondary" onClick={addRectangle}>
          Rectangle
        </button>
        <button className={'btn btn-info'} variant="secondary" onClick={addCircle}>
          Circle
        </button>
        <button className={'btn btn-info'} variant="secondary" onClick={drawLine}>
          Line
        </button>
        <button className={'btn btn-info'} variant="secondary" onClick={eraseLine}>
          Erase
        </button>
        <button className={'btn btn-info'} onClick={drawText}>
          Text
        </button>
        <button className={'btn btn-info'} onClick={drawImage}>
          Image
        </button>
        <button className={'btn btn-info'} onClick={undo}>
          Undo
        </button>
        <button className={'btn btn-info'} onClick={() => setModalShow(true)}>
          change background
        </button>
      </div>
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileUploadEl}
        onChange={fileChange}
      />
      <Stage
        width={window.innerWidth * 0.9}
        height={window.innerHeight}
        ref={stageEl}
        onMouseDown={e => {
          // deselect when clicked on empty area
          const clickedOnEmpty = e.target === e.target.getStage()
          if (clickedOnEmpty) {
            selectShape(null)
          }
        }}
      >
        <Layer ref={layerEl}>
          {rectangles.map((rect, i) => {
            return (
              <Rectangle
                key={i}
                shapeProps={rect}
                isSelected={rect.id === selectedId}
                onSelect={() => {
                  selectShape(rect.id)
                }}
                onChange={newAttrs => {
                  const rects = rectangles.slice()
                  rects[i] = newAttrs
                  setRectangles(rects)
                }}
              />
            )
          })}
          {circles.map((circle, i) => {
            return (
              <Circle
                key={i}
                shapeProps={circle}
                isSelected={circle.id === selectedId}
                onSelect={() => {
                  selectShape(circle.id)
                }}
                onChange={newAttrs => {
                  const circs = circles.slice()
                  circs[i] = newAttrs
                  setCircles(circs)
                }}
              />
            )
          })}
          {images.map((image, i) => {
            return (
              <Image
                key={i}
                imageUrl={image.content}
                isSelected={image.id === selectedId}
                onSelect={() => {
                  selectShape(image.id)
                }}
                onChange={newAttrs => {
                  const imgs = images.slice()
                  imgs[i] = newAttrs
                }}
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}

export default HomePage