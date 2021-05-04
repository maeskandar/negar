import React, { useState, useEffect } from "react"
import { Stage, Layer } from "react-konva"
import v1 from 'uuid/dist/v1'
import randInt from 'random-int'

import Rectangle from "./canvas/Rectangle"
import Circle from "./canvas/Circle"
// import { addLine } from "./canvas/Line"
import { addTextNode } from "./canvas/TextNode"
import Image from "./canvas/Images"
import { MyVerticallyCenteredModal } from "./components/MyVerticallyCenteredModal"
import { MyLine, newLine } from "./canvas/Line"
import { newArrow, Arrow } from "./canvas/Arrow"

import { replaceInArray } from "./utils/array"
import Konva from "konva"

// enum
const
  APP_STATES = {
    NOTHING: 0,
    DRAGING: 1,
    DRAWING: 2,
  },
  APP_TOOLS = {
    NOTHING: 0,
    LINE: 1,
    RECTANGLE: 2,
    CIRCLE: 3,
    IMAGE: 4,
  },
  isSet = {
    documentEventListeners: false,
  },
  drawingTempData = []

// var mouseCursor

export default function HomePage() {
  const
    // react stuff
    forceUpdate = React.useCallback(() => updateState({}), []),
    [, updateState] = React.useState(),
    // canvas related
    [circles, setCircles] = useState([]),
    [rectangles, setRectangles] = useState([]),
    [lines, setLines] = useState([]),
    [arrows, setArrows] = useState([]),
    [images, setImages] = useState([]),
    [shapes, setShapes] = useState([]),
    [selectedId, selectShape] = useState(null),
    stageEl = React.createRef(),
    mainLayer = React.createRef(),
    drawingPreviewLayer = React.createRef(),
    // app functionality related
    [appState, setAppState] = React.useState(APP_STATES.NOTHING),
    [selectedTool, setSelectedTool] = React.useState(APP_TOOLS.NOTHING),
    [modalShow, setModalShow] = React.useState(false),
    fileUploadEl = React.createRef(),
    [backgroundimage, setBackgroundimage] = useState('/images/pexels-eberhard-grossgasteiger-1064162.jpg'),
    backimages = [
      {
        url: '/images/pexels-eberhard-grossgasteiger-1064162.jpg',
        title: 'forest and lake!',
        desc: 'no description is available'
      },
      {
        url: '/images/pexels-martin-damboldt-814499.jpg',
        title: 'nice lake!',
        desc: 'no description is available'
      },
      {
        url: '/images/pexels-roberto-shumski-1903702.jpg',
        title: 'mountains!',
        desc: 'no description is available'
      }
    ]

  // functions -----------------------------------------
  const
    onCanvasClick = (ev) => {
      if (appState === APP_STATES.DRAWING) {
        // TODO: add drawing mode for other shapes
        if (selectedTool === APP_TOOLS.LINE) {
          drawingTempData.push(ev.evt.layerX, ev.evt.layerY)

          if (drawingTempData.length === 4) {
            setLines(lines.concat([newLine(...drawingTempData)]))
            setShapes(shapes.concat([`ln${lines.length + 1}`]))
            drawingTempData.length = 0
          }
        }
      }
    },
    addRectangle = (x, y) => {
      const rect = {
        x, y,
        width: 100,
        height: 100,
        fill: Konva.Util.getRandomColor(),
        id: v1(),
      }
      setRectangles(rectangles.concat([rect]))
      setShapes(shapes.concat([rect.id]))
    },
    addCircle = (x, y) => {
      const circ = {
        x, y,
        width: 100,
        height: 100,
        fill: Konva.Util.getRandomColor(),
        id: v1(),
      }
      setCircles(circles.concat([circ]))
      setShapes(shapes.concat([circ.id]))
    },
    drawLine = () => {
      setAppState(APP_STATES.DRAWING)
      setSelectedTool(APP_TOOLS.LINE)
    },
    drawArrow = () => {
      var arw = newArrow()
      console.log(arw)
      setArrows(arrows.concat([arw]))
      setShapes(shapes.concat([`arw${arrows.length + 1}`]))
    },
    drawText = () => {
      const id = addTextNode(stageEl.current.getStage(), mainLayer.current)
      setShapes(shapes.concat([id]))
    },
    drawImage = () => {
      fileUploadEl.current.click()
    },

    cancelDrawing = () => {
      setSelectedTool(APP_TOOLS.NOTHING)
      setAppState(APP_STATES.NOTHING)
    },

    fileChange = (ev) => {
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
      }, false)
      if (file) {
        reader.readAsDataURL(file)
      }
    },
    undo = () => {
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


  // adds event listeners in the first time only
  useEffect(() => {
    if (!isSet.documentEventListeners) {
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
      isSet.documentEventListeners = true
    }
  })

  return (
    <div className="home-page" style={{
      background: `url(${backgroundimage}) no-repeat center fixed`,
    }}>
      <MyVerticallyCenteredModal
        images={backimages}
        show={modalShow}
        setimage={setBackgroundimage}
        onHide={() => setModalShow(false)}
      />
      <div className="btn-group my-2" role="group">
        {/* Default State */
          appState === APP_STATES.NOTHING && <>
            <button className={'btn btn-info'} onClick={() => addRectangle(randInt(100), randInt(100))}>
              Rectangle
        </button>
            <button className={'btn btn-info'} onClick={() => addCircle(randInt(100), randInt(100))}>
              Circle
        </button>
            <button className={'btn btn-info'} onClick={drawLine}>
              Line
        </button>
            <button className={'btn btn-info'} onClick={drawText}>
              Text
        </button>
            <button className={'btn btn-info'} onClick={drawImage}>
              Image
        </button>
            <button className={'btn btn-info'} onClick={drawArrow}>
              Arrow
        </button>
            <button className={'btn btn-info'} onClick={() => setModalShow(true)}>
              change background
        </button>
          </>
        }
        {/* Drawing State */
          appState === APP_STATES.DRAWING && <>
            <button className={'btn btn-warning'} onClick={cancelDrawing}>
              cancel
        </button>
          </>
        }
        <button className={'btn btn-info'} onClick={undo}>
          Undo
        </button>
      </div>
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileUploadEl}
        onChange={fileChange}
      />

      {/* konva canvas */}
      <Stage
        width={window.innerWidth * 0.9}
        height={window.innerHeight}
        ref={stageEl}
        onClick={onCanvasClick}
        onMouseDown={e => {
          // deselect when clicked on empty area
          if (e.target === e.target.getStage()) selectShape(null)
        }}
      >
        <Layer ref={mainLayer}>
          {/* TODO: add dynamic layers not like circles, rects, ... */}
          {/* main layer */}
          {rectangles.map((rect, i) =>
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id)
              }}
              onChange={newAttrs => {
                setRectangles(replaceInArray(rectangles, i, newAttrs))
              }}
            />
          )}
          {circles.map((circle, i) =>
            <Circle
              key={i}
              shapeProps={circle}
              isSelected={circle.id === selectedId}
              onSelect={() => selectShape(circle.id)}
              onChange={newAttrs => {
                setCircles(replaceInArray(circles, i, newAttrs))
              }}
            />
          )}
          {images.map((image, i) =>
            <Image
              key={i}
              imageUrl={image.content}
              isSelected={image.id === selectedId}
              onSelect={() => selectShape(image.id)}
              onChange={newAttrs => {
                const imgs = images.slice()
                imgs[i] = newAttrs
                // FIXME: why you don't have something like `setCircles`?
              }}
            />
          )}
          {arrows.map((arrow, i) =>
            <Arrow
              key={i}
              shapeProps={arrow}
              isSelected={arrow.id === selectedId}
              onSelect={() => selectShape(arrow.id)}
              onChange={newAttrs => {
                setArrows(replaceInArray(arrows, i, newAttrs))
              }}
            />
          )}
          {lines.map((line, i) =>
            <MyLine
              key={i}
              shapeProps={line}
              isSelected={line.id === selectedId}
              onSelect={() => selectShape(line.id)}
              onChange={newAttrs => {
                setLines(replaceInArray(lines, i, newAttrs))
              }}
            />
          )}
        </Layer>

        {/* drawing preview layer */}
        <Layer ref={drawingPreviewLayer}>

        </Layer>
      </Stage>

    </div >
  )
}