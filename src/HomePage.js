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
    stageEventListeners: false,
    documentEventListeners: false,
  }

export default function HomePage() {
  const
    // react stuff
    forceUpdate = React.useCallback(() => updateState({}), []),
    [, updateState] = React.useState(),
    // canvas related
    [circles, setCircles] = useState([]),
    [rectangles, setRectangles] = useState([]),
    [images, setImages] = useState([]),
    [shapes, setShapes] = useState([]),
    [selectedId, selectShape] = useState(null),
    stageEl = React.createRef(),
    layerEl = React.createRef(),
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
    addRectangle = () => {
      const rect = {
        x: randInt(100),
        y: randInt(100),
        width: 100,
        height: 100,
        fill: "red",
        id: `rect${rectangles.length + 1}`,
      }
      setRectangles(rectangles.concat([rect]))
      setShapes(shapes.concat([`rect${rectangles.length + 1}`]))
    },
    addCircle = () => {
      const circ = {
        x: randInt(100),
        y: randInt(100),
        width: 100,
        height: 100,
        fill: "red",
        id: `circ${circles.length + 1}`,
      }
      setCircles(circles.concat([circ]))
      setShapes(shapes.concat([`circ${circles.length + 1}`]))
    },
    drawLine = () => {
      setAppState(APP_STATES.DRAWING)
      setSelectedTool(APP_TOOLS.LINE)
    },
    drawText = () => {
      const id = addTextNode(stageEl.current.getStage(), layerEl.current)
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

    if (!isSet.stageEventListeners && stageEl.current) {
      stageEl.current.on('click', (ev) => {

        if (appState === APP_STATES.DRAWING) {
          // TODO: add drawing mode for other shapes
          if (selectedTool === APP_TOOLS.LINE) {
            // TODO: show points to select in drawing line
          }
        }
        
      })
      isSet.stageEventListeners = true
    }
  })

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
      <div className="btn-group my-2" role="group">
        {/* Default State */
          appState === APP_STATES.NOTHING && <>
            <button className={'btn btn-info'} onClick={addRectangle}>
              Rectangle
        </button>
            <button className={'btn btn-info'} onClick={addCircle}>
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
            <button className={'btn btn-info'} onClick={() => { }}>
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
        onMouseDown={e => {
          // deselect when clicked on empty area
          if (e.target === e.target.getStage()) selectShape(null)
        }}
      >
        <Layer ref={layerEl}>
          {/* TODO: add dynamic layers not like circles, rects, ... */}
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
                onSelect={() => selectShape(circle.id)}
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
                onSelect={() => selectShape(image.id)}
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