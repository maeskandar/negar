import React, { useState, useEffect, useCallback } from "react"
import { Stage, Layer } from "react-konva"
import { ChromePicker } from "react-color"
// import v1 from 'uuid/dist/v1'
import randInt from 'random-int'

import { shapeKinds } from "./canvas/"
import { Rectangle, newRectangle } from "./canvas/Rectangle"
import { MyCircle as Circle, newCircle } from "./canvas/Circle"
import { MyImage as Image, newImage } from "./canvas/Images"
// import { addTextNode } from "./canvas/TextNode"
import { MyVerticallyCenteredModal } from "./components/MyVerticallyCenteredModal"
import { MyLine, newLine } from "./canvas/Line"
import { newArrow, Arrow } from "./canvas/Arrow"

import { removeInArray, replaceInArray, cleanArray } from "./utils/array"
import { removeInSet, addToSet } from "./utils/set"


// enum
const
  APP_STATES = {
    DRAGING: 1,
    DRAWING: 2,
    COLOR_PICKING: 3,
  },
  APP_TOOLS = {
    NOTHING: 0,
    LINE: 1,
    RECTANGLE: 2,
    CIRCLE: 3,
    IMAGE: 4,
    PENCIL: 5,
    ERASER: 6,
  },
  drawingTempData = []

// var mouseCursor

export default function HomePage() {
  const
    // react stuff
    // [, updateState] = React.useState(),
    // forceUpdate = useCallback(() => updateState({}), []),

    // canvas related
    [shapes, setShapes] = useState([]),
    [tempShapes, setTempShapes] = useState([]),
    [bg, setbg] = useState("#fff"),
    [selectedId, setSelectedId] = useState(null),
    stageEl = React.createRef(),
    mainLayer = React.createRef(),
    drawingPreviewLayer = React.createRef(),

    // app functionality related
    [appState, setAppState] = React.useState(new Set()),
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
    addToShapes = (...newShapes) => {
      setShapes(shapes.concat(newShapes))
    },

    addRectangle = (x, y) => {
      addToShapes(
        newRectangle(x, y))
    },
    addCircle = (x, y) => {
      addToShapes(
        newCircle(x, y))
    },
    drawLine = () => {
      setAppState(addToSet(appState, APP_STATES.DRAWING))
      setSelectedTool(APP_TOOLS.LINE)
    },
    drawArrow = () => {
      addToShapes(
        newArrow())
    },
    drawText = () => {
      // const id = addTextNode(stageEl.current.getStage(), mainLayer.current)
      // setShapes(shapes.concat([id]))
    },
    drawImage = () => { // #FIXME: what a name
      fileUploadEl.current.click()
    },
    startJamBoard = () => {
      setAppState(addToSet(appState, APP_STATES.DRAWING))
      setSelectedTool(APP_TOOLS.PENCIL)
    },

    deleteShape = (shapeId) => {
      let index = shapes.findIndex(it => it.id === shapeId)

      if (index !== -1)
        setShapes(removeInArray(shapes, index))
    },

    cancelOperation = () => {
      if (appState.has(APP_STATES.DRAWING)) {
        cleanArray(drawingTempData)
        setTempShapes([])
      }
      else if (appState.has(APP_STATES.COLOR_PICKING)) { }

      setAppState(new Set())
      setSelectedTool(APP_TOOLS.NOTHING)
    },

    doneJob = () => {
      if (appState.has(APP_STATES.DRAWING)) {

        if (selectedTool === APP_TOOLS.PENCIL) {
          addToShapes(...tempShapes)
          cancelOperation()
        }

      }
    },

    fileChange = (ev) => {
      let file = ev.target.files[0]

      const reader = new FileReader()
      reader.addEventListener("load", () => {
        fileUploadEl.current.value = null
        addToShapes(newImage(reader.result))
      }, false)

      if (file) {
        reader.readAsDataURL(file)
      }
    },

    // canvas events -------------------------
    handleClick = (ev) => {
      // TODO: add drawing mode for other shapes
      if (appState.has(APP_STATES.DRAWING)) {

        if (selectedTool === APP_TOOLS.LINE) {

          drawingTempData.push(ev.evt.layerX, ev.evt.layerY)
          if (drawingTempData.length === 4) {
            addToShapes(newLine([...drawingTempData]))
            cleanArray(drawingTempData)
          }
        }

      }
      else if (ev.target === ev.target.getStage()) {
        setSelectedId(null)
        cancelOperation()
      }
    },
    onShapeSelected = (shapeId) => {
      setSelectedId(shapeId === selectedId ? null : shapeId)
    },
    handleMouseDown = (e) => {
      if (appState.has(APP_STATES.DRAWING)) {
        if (selectedTool === APP_TOOLS.PENCIL) {
          const pos = e.target.getStage().getPointerPosition()

          setTempShapes(tempShapes.concat([
            newLine([pos.x, pos.y])]))

          setAppState(addToSet(appState, APP_STATES.DRAGING))
        }
      }
    },
    handleMouseMove = (e) => {
      if (appState.has(APP_STATES.DRAWING)) {
        if (selectedTool === APP_TOOLS.PENCIL && appState.has(APP_STATES.DRAGING)) {
          const point = stageEl.current.getPointerPosition()

          let lastLine = tempShapes[tempShapes.length - 1]
          lastLine.points = lastLine.points.concat([point.x, point.y])

          setTempShapes(replaceInArray(
            tempShapes, tempShapes.length - 1, lastLine))
        }
      }
    },
    handleMouseUp = () => {
      if (!appState.has(APP_STATES.DRAWING))
        setAppState(new Set())

      if (appState.has(APP_STATES.DRAWING)) {
        if (selectedTool === APP_TOOLS.PENCIL) {
          setAppState(removeInSet(appState, APP_STATES.DRAGING))
        }
      }
    },

    undo = () => { }


  // if you have any question for what i did that: because of new stupid functional paradigm react way
  useEffect(() => {
    const
      handleWindowKeyboard = (ev) => {
        if (ev.code === "Delete") {
          if (selectedId) {
            deleteShape(selectedId)
            setSelectedId(null)
          }
        }
        else if (ev.code === "Escape") {
          setSelectedId(null)
        }
      }

    window.addEventListener('keydown', handleWindowKeyboard)
    return () => window.removeEventListener('keydown', handleWindowKeyboard)
  }, [selectedId, deleteShape])

  return (
    <div className="home-page"
      style={{ background: `url(${backgroundimage}) no-repeat center fixed`, }}
    >
      <MyVerticallyCenteredModal
        images={backimages}
        show={modalShow}
        setimage={setBackgroundimage}
        onHide={() => setModalShow(false)}
      />
      <div className="btn-group my-2" role="group">
        {/* Default State */
          appState.size === 0 && <>
            <button className="btn btn-info" onClick={() => addRectangle(randInt(100), randInt(100))}>
              Rectangle
        </button>
            <button className="btn btn-info" onClick={() => addCircle(randInt(100), randInt(100))}>
              Circle
        </button>
            <button className="btn btn-info" onClick={drawLine}>
              Line
        </button>
            <button className="btn btn-info" onClick={drawText}>
              Text
        </button>
            <button className="btn btn-info" onClick={drawImage}>
              Image
        </button>
            <button className="btn btn-info" onClick={drawArrow}>
              Arrow
        </button>
            <button className="btn btn-info" onClick={startJamBoard}>
              jamBoard
        </button>
            <button className="btn btn-info" onClick={() => setModalShow(true)}>
              change background
        </button>

            {
              selectedId !== null && <button
                className="btn btn-info"
                onClick={() => {
                  let shape = shapes.find(it => it.id === selectedId)
                  if (shape) {
                    setAppState(addToSet(appState, APP_STATES.COLOR_PICKING))
                    setbg(shape.kind === shapeKinds.Line ? shape.stroke : shape.fill)
                  }
                }}>
                color picker </button>
            }
          </>
        }

        {
          appState.size !== 0 &&
          <button className={'btn btn-warning'} onClick={doneJob}>
            done
        </button>
        }

        {/* Drawing State */
          (appState.has(APP_STATES.DRAWING) || appState.has(APP_STATES.COLOR_PICKING)) && <>
            <button className={'btn btn-warning'} onClick={cancelOperation}>
              cancel
        </button>
          </>
        }
        <button className="btn btn-info" onClick={undo}>
          Undo
         </button>
      </div>

      {// something selected 
        selectedId !== null && appState.has(APP_STATES.COLOR_PICKING) &&
        <div id="color-picker-wrapper" className="position-fixed">
          <ChromePicker
            disableAlpha
            color={bg}
            onChange={(color) => setbg(color['hex'])}
            onChangeComplete={(color) => {
              let
                index = shapes.findIndex((it) => it.id === selectedId),
                shape = shapes[index],
                key = shape.kind !== shapeKinds.Line ? 'fill' : 'stroke'

              setShapes(replaceInArray(shapes, index,
                { ...shape, [key]: color['hex'] }))
            }}
          />
        </div>
      }
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
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer ref={mainLayer}>
          {/* TODO: add dynamic layers not like circles, rects, ... */}
          {/* main layer */}
          {shapes.map((shape, i) => {
            switch (shape.kind) {
              case shapeKinds.Reactangle:
                return <Rectangle
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => onShapeSelected(shape.id)}
                  onChange={newAttrs => {
                    setShapes(replaceInArray(shapes, i, newAttrs))
                  }}
                />

              case shapeKinds.Circle:
                return <Circle
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => onShapeSelected(shape.id)}
                  onChange={newAttrs => {
                    setShapes(replaceInArray(shapes, i, newAttrs))
                  }}
                />

              case shapeKinds.Image:
                return <Image
                  key={shape.id}
                  imageUrl={shape.content}
                  isSelected={shape.id === selectedId}
                  onSelect={() => onShapeSelected(shape.id)}
                  onChange={newAttrs => {
                    // const imgs = images.slice()
                    // imgs[i] = newAttrs
                    // FIXME: why you don't have something like `setCircles`?
                  }}
                />

              case shapeKinds.CustomShape:
                return <Arrow
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => onShapeSelected(shape.id)}
                  onChange={newAttrs => {
                    setShapes(replaceInArray(shapes, i, newAttrs))
                  }}
                />

              case shapeKinds.Line:
                return <MyLine
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => onShapeSelected(shape.id)}
                  onChange={newAttrs => {
                    setShapes(replaceInArray(shapes, i, newAttrs))
                  }}
                />

              default:
                throw "how is it possible?"
            }
          })}
        </Layer>

        {/* drawing preview layer */}
        {appState.has(APP_STATES.DRAWING) &&
          <Layer ref={drawingPreviewLayer}>
            {tempShapes.map((shape, i) =>
              <MyLine
                key={shape.id}
                shapeProps={{ ...shape }}
                isSelected={shape.id === selectedId}
                onSelect={() => onShapeSelected(shape.id)}
                onChange={newAttrs => {
                  setTempShapes(replaceInArray(tempShapes, i, newAttrs))
                }}
              />)}
          </Layer>}
      </Stage>

    </div >
  )
}