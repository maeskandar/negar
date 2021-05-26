import React, { useState, useEffect } from "react"
import { Stage, Layer, Rect, Image as KImage } from "react-konva"
import { SketchPicker } from "react-color"
import randInt from 'random-int'

import { shapeKinds, isKindOfLine } from "../canvas"
import { Rectangle, newRectangle } from "../canvas/Rectangle"
import { MyCircle as Circle, newCircle } from "../canvas/Circle"
import { MyImage, newImage } from "../canvas/Images"
import { addTextNode } from "../canvas/TextNode"
import { newArrow, Arrow } from "../canvas/Arrow"
import { newSimpleLine, SimpleLine } from "../canvas/SimpleLine"
import { StraghtLine, newStraghtLine } from "../canvas/StraightLine"
import { CustomLine, newCustomLine } from "../canvas/CustomLine"

import { MyVerticallyCenteredModal } from "../UI/MyVerticallyCenteredModal"
import { ColorPreview } from "../UI/ColorPreview"
import CustomSearchbar from "../UI/CustomSearchbar"

import { removeInArray, replaceInArray, cleanArray, addToArray, arraysEqual } from "../utils/array"
import { removeInSet, addToSet, setHasParamsAnd, setHasParamsOr } from "../utils/set"
import { pointsDistance, sumArraysOneByOne, prettyFloatNumber } from "../utils/math"
import { downloadURI } from "../utils/other"

import {
  CropDin as RectangleIcon,
  RadioButtonUnchecked as CircleIcon,
  Forward as ArrowIcon,
  Remove as LineIcon,
  InsertPhoto as ImageIcon,
  Gesture as JamBoardIcon,
  Save as SaveIcon,
  Wallpaper as BackgroundIcon,
  Close as CancelIcon,
  Create as PencilIcon,
  Backspace as EraserIcon,
  TextFields as TextIcon,
  DoneAll,
} from '@material-ui/icons'

import { ToolBarBtn } from "../UI/Toolbar"
import { Paper, TextField, Slider, Typography } from "@material-ui/core"

// enums ----
const
  APP_STATES = {
    DRAGING: 0,
    DRAWING: 1,
  },
  APP_TOOLS = {
    NOTHING: 0,
    LINE: 1,
    RECTANGLE: 2,
    CIRCLE: 3,
    IMAGE: 4,
    PENCIL: 5,
    ERASER: 6,
    FG_COLOR_PICKER: 7,
    STROKE_COLOR_PICKER: 8,
  },
  ERASER_RADIUS = 10, // px
  PIXEL_RATIO_DOWNLAOD = 3

let drawingTempData = []

function objectToShape(obj, isSelected, onSelect, onChange) {
  const commonProps = {
    key: obj.id,
    shapeProps: obj,
    isSelected, onSelect, onChange,
  }

  switch (obj.kind) {

    case shapeKinds.Reactangle:
      return <Rectangle
        {...commonProps}
      />
    case shapeKinds.Circle:
      return <Circle
        {...commonProps}
      />
    case shapeKinds.Image:
      return <MyImage
        {...commonProps}
        imageUrl={obj.content}
      />
    case shapeKinds.CustomShape:
      return <Arrow
        {...commonProps}
      />
    case shapeKinds.StraghtLine:
      return <StraghtLine
        {...commonProps}
      />
    case shapeKinds.CustomLine:
      return <CustomLine
        {...commonProps}
      />
  }
}

export default function HomePage() {
  const
    // canvas related
    [shapes, setShapes] = useState([]),
    [tempShapes, setTempShapes] = useState([]),
    [color, setColor] = useState('#fff'),
    [selectedShapeInfo, setSelectedShapeInfo] = useState({ id: null, index: null, shapeObj: null }),
    stageEl = React.createRef(),
    mainLayer = React.createRef(),
    drawingPreviewLayer = React.createRef(),

    // app functionality related
    [appState, setAppState] = React.useState(new Set()),
    [selectedTool, setSelectedTool] = React.useState(APP_TOOLS.NOTHING),
    [backgroundimage, setBackgroundimageDirect] = useState({ url: null, imageObj: null, }),
    [backgroundModalShow, setBackgroundModalShow] = useState(false),
    [imageModalShow, setImageModalShow] = useState(false),
    [verseText, setVerseText] = useState(""),
    backimages = [
      {
        url: '/images/pexels-eberhard-grossgasteiger-1064162.jpg',
        title: 'دریاچه و جنگل',
        desc: 'مناظر و طبیعت'
      },
      {
        url: '/images/pexels-martin-damboldt-814499.jpg',
        title: 'دریاچه ای زیبا',
        desc: 'مناظر و طبیعت'
      },
      {
        url: '/images/pexels-roberto-shumski-1903702.jpg',
        title: 'کوه ها!',
        desc: 'مناظر و طبیعت'
      },
      {
        url: '/images/solid1.png',
        title: 'صفحه رنگی',
        desc: 'صفحه رنگی است!'
      },
      {
        url: '/images/solid2.jpg',
        title: 'صفحه رنگی',
        desc: 'صفحه رنگی است!'
      },
      {
        url: '/images/solid3.jpg',
        title: 'صفحه رنگی',
        desc: 'صفحه رنگی است!'
      }
    ],
    imagesData = [
      {
        url: '/images/tree1.png',
        title: 'درخت',
        desc: 'نوع شماره 1'
      },
      {
        url: '/images/tree2.png',
        title: 'درخت',
        desc: 'نوع شماره 2'
      },
      {
        url: '/images/tree3.png',
        title: 'درخت',
        desc: 'نوع شماره 3'
      },
      {
        url: '/images/tree5.png',
        title: 'درخت',
        desc: 'نوع شماره 4'
      },
      {
        url: '/images/tree6.png',
        title: 'درخت',
        desc: 'نوع شماره 5'
      },
      {
        url: '/images/tree8.png',
        title: 'درخت',
        desc: 'نوع شماره 6'
      },
      {
        url: '/images/tree9.png',
        title: 'درخت',
        desc: 'نوع شماره 7'
      },
      {
        url: '/images/tree10.png',
        title: 'درخت',
        desc: 'نوع شماره 8'
      },
      {
        url: '/images/tree11.png',
        title: 'درخت',
        desc: 'نوع شماره 9'
      }
    ]


  // functions -----------------------------------------
  const
    setSelectedId = (shapeId) => {
      if (shapeId === selectedShapeInfo.id) return

      let
        si = shapes.findIndex(it => it.id === shapeId),
        so = si === -1 ? null : shapes[si]

      setSelectedShapeInfo({
        id: so ? shapeId : null,
        index: so ? si : null,
        shapeObj: so,
      })
    },
    deleteShape = (shapeId) => {
      let index = shapes.findIndex(it => it.id === shapeId)

      if (index !== -1)
        setShapes(removeInArray(shapes, index))
    },
    onShapeChanged = (i, newAttrs) => {
      if (newAttrs.id === selectedShapeInfo.id) {

        setSelectedShapeInfo({
          id: newAttrs.id,
          index: i,
          shapeObj: newAttrs
        })
      }
      setShapes(replaceInArray(shapes, i, newAttrs))
    },
    isInJamBoardMode = () =>
      appState.has(APP_STATES.DRAWING) &&
      (selectedTool === APP_TOOLS.PENCIL || selectedTool === APP_TOOLS.ERASER)
    ,
    isColorPicking = () =>
      selectedTool === APP_TOOLS.FG_COLOR_PICKER || selectedTool === APP_TOOLS.STROKE_COLOR_PICKER
    ,
    addToShapes = (select, ...newShapes) => {
      if (select)
        setSelectedShapeInfo({
          id: newShapes[0].id,
          shapeObj: newShapes[0],
          index: shapes.length
        })

      setShapes(shapes.concat(newShapes))
    },
    addRectangle = (x, y) => {
      addToShapes(true, newRectangle(x, y))
    },
    addCircle = (x, y) => {
      addToShapes(true, newCircle(x, y))
    },
    drawArrow = () => {
      addToShapes(true, newArrow())
    },
    ImageSetterHandler = (e) => {
      addToShapes(true, newImage(e))
    },
    drawText = () => {
      // FIXME: needs refactoring
      let txtEl = addTextNode(stageEl.current.getStage(), mainLayer.current, "تایپ کنید", "Shabnam")
      addToShapes(false, txtEl)
    },
    StartLineDrawingMode = () => {
      setAppState(addToSet(appState, APP_STATES.DRAWING))
      setSelectedTool(APP_TOOLS.LINE)
    },
    startJamBoard = () => {
      setAppState(addToSet(appState, APP_STATES.DRAWING))
      setSelectedTool(APP_TOOLS.PENCIL)
      setSelectedId(null)
    },

    cancelOperation = () => {
      if (appState.has(APP_STATES.DRAWING)) {
        cleanArray(drawingTempData)
        setTempShapes([])
      }

      setAppState(new Set())
      setSelectedTool(APP_TOOLS.NOTHING)
    },
    doneOperation = () => {
      if (appState.has(APP_STATES.DRAWING)) {

        // stick lines if they have Intersection, else create new line
        if (isInJamBoardMode() && tempShapes.length !== 0) {
          let
            resultLines = [],
            tempPoints = []


          function stickToLast(...newPoints) {
            tempPoints.push(...newPoints)
          }
          function closeLastLine() {
            resultLines.push(newCustomLine(tempPoints))
          }
          function addNewLine(...points) {
            tempPoints = points
          }

          tempPoints = tempShapes[0].points

          for (let i = 1; i < tempShapes.length - 1; i++) {
            let
              lcp = tempShapes[i].points, // current line points
              lnp = tempShapes[i + 1].points  // next line points

            // if end points of this line are equal to start points of next line
            if (arraysEqual(lcp.slice(2), lnp.slice(0, 2))) {
              stickToLast(...lnp.slice(2))
            }
            else {
              closeLastLine()
              addNewLine(...lnp)
            }
          }
          closeLastLine()

          addToShapes(false, ...resultLines)
        }

      }
      cancelOperation()
    },
    saveAsImage = () => {
      let dataURL = stageEl.current.toDataURL({ pixelRatio: PIXEL_RATIO_DOWNLAOD })
      downloadURI(dataURL, 'stage.png')
    },
    setBackgroundimage = (url) => {
      setBackgroundimageDirect({ url, imageObj: null })

      let imageObj = new Image()
      imageObj.src = url
      imageObj.onload = () =>
        setBackgroundimageDirect({ url, imageObj })
    },
    // canvas events -------------------------
    onShapeSelected = (shapeId) => {
      // toggle select
      setSelectedId(shapeId === selectedShapeInfo ? null : shapeId)
    },
    handleClick = (ev) => {
      if (ev.target.name() === "bg-layer") {
        setSelectedId(null)
        cancelOperation()
      }
    },
    handleMouseDown = (e) => {
      if (!appState.has(APP_STATES.DRAGING))
        setAppState(addToSet(appState, APP_STATES.DRAGING))

      if (appState.has(APP_STATES.DRAWING)) {
        const pos = e.target.getStage().getPointerPosition()
        drawingTempData = [pos.x, pos.y]
      }
    },
    handleMouseMove = (e) => {
      if (setHasParamsAnd(appState, APP_STATES.DRAWING, APP_STATES.DRAGING)) {
        var mp = stageEl.current.getPointerPosition()
        mp = [mp.x, mp.y]

        console.log(mp)

        if (selectedTool === APP_TOOLS.PENCIL) {
          setTempShapes(
            addToArray(tempShapes,
              newSimpleLine(drawingTempData.concat(mp))))
          drawingTempData = mp
        }
        else if (selectedTool === APP_TOOLS.ERASER) {
          let acc = []
          for (const l of tempShapes) {
            let
              sp = [l.points[0], l.points[1]],
              ep = [l.points[2], l.points[3]]

            if ([pointsDistance(sp, mp), pointsDistance(ep, mp)].every(v => v > ERASER_RADIUS)) {
              acc.push(l)
            }
          }
          setTempShapes(acc)
        }
      }
    },
    handleMouseUp = (e) => {
      if (selectedTool === APP_TOOLS.LINE) {
        let pos = e.target.getStage().getPointerPosition()
        addToShapes(false, newStraghtLine(drawingTempData.concat([pos.x, pos.y])))
      }

      setAppState(removeInSet(appState, APP_STATES.DRAGING))
    }


  // register events -----
  useEffect(() => {
    const
      handleWindowKeyboard = (ev) => {
        if (ev.code === "Delete") {
          if (selectedShapeInfo.id) {
            deleteShape(selectedShapeInfo.id)
            setSelectedId(null)
          }
        }
        else if (ev.code === "Escape") {
          setSelectedId(null)
        }
      }

    window.addEventListener('keydown', handleWindowKeyboard)
    return () => window.removeEventListener('keydown', handleWindowKeyboard)
  }, [selectedShapeInfo, deleteShape])

  useEffect(() => {
    if (verseText != "") {
      const id = addTextNode(stageEl.current.getStage(), mainLayer.current, verseText, "QuranTaha")
      const shs = shapes.concat([id])
      setShapes(shs)
    }
  }, [verseText])

  // config default states ------
  if (!backgroundimage.url) { // default state
    setBackgroundimage('/images/pexels-eberhard-grossgasteiger-1064162.jpg')
  }

  // render -------=
  return (
    <div id="home-page" style={{
      textAlign: 'center',
      background: `url(${backgroundimage.url}) no-repeat center fixed`,
      width: '100%'
    }}>

      {backgroundModalShow && <MyVerticallyCenteredModal
        title={"پس زمینه"}
        images={backimages}
        show={backgroundModalShow}
        setimage={setBackgroundimage}
        onHide={() => setBackgroundModalShow(false)}
      />
      }{imageModalShow && <MyVerticallyCenteredModal
        title={"تصویر"}
        images={imagesData}
        show={imageModalShow}
        setimage={(e) => ImageSetterHandler(e)}
        onHide={() => setImageModalShow(false)}
      />
      }

      <div id="tool-bar-wrapper"
      >
        <Paper
          id="tool-bar"
          elevation={3}>
          {/* Default State */
            !appState.has(APP_STATES.DRAWING) && <>
              <ToolBarBtn
                title="مستطیل"
                onClick={() => addRectangle(randInt(100), randInt(100))}
                iconEl={<RectangleIcon />}
              />
              <ToolBarBtn
                title="دایره"
                onClick={() => addCircle(randInt(100), randInt(100))}
                iconEl={<CircleIcon />}
              />
              <ToolBarBtn
                title="خط"
                onClick={StartLineDrawingMode}
                iconEl={<LineIcon />}
              />
              <ToolBarBtn
                title="متن"
                onClick={drawText}
                iconEl={<TextIcon />}
              />
              <ToolBarBtn
                title="تصویر"
                iconEl={<ImageIcon />}
                onClick={() => setImageModalShow(true)}
              />
              <ToolBarBtn
                title="فلش"
                iconEl={<ArrowIcon />}
                onClick={drawArrow}
              />
              <ToolBarBtn
                title="تخته"
                iconEl={<JamBoardIcon />}
                onClick={startJamBoard}
              />
              <ToolBarBtn
                title="ذخیره"
                iconEl={<SaveIcon />}
                onClick={saveAsImage}
              />
              <ToolBarBtn
                title="پس زمینه"
                iconEl={<BackgroundIcon />}
                onClick={() => setBackgroundModalShow(true)}
              />
            </>
          }
          {/* JamBoard */
            isInJamBoardMode() && <>
              <ToolBarBtn
                title="مداد"
                iconEl={<PencilIcon />}
                onClick={() => setSelectedTool(APP_TOOLS.PENCIL)}
                disabled={selectedTool === APP_TOOLS.PENCIL}
              />
              <ToolBarBtn
                title="پاک کن"
                iconEl={<EraserIcon />}
                disabled={selectedTool === APP_TOOLS.ERASER}
                onClick={() => { setSelectedTool(APP_TOOLS.ERASER) }}
              />
            </>
          }
          {/* Drawing State */
            setHasParamsOr(appState, APP_STATES.DRAWING) && <>
              <ToolBarBtn
                title="ثبت عملیات"
                iconEl={<DoneAll />}
                onClick={doneOperation}
              />

              <ToolBarBtn
                title="لغو عملیات"
                iconEl={<CancelIcon />}
                onClick={cancelOperation}
              />
            </>
          }
        </Paper>
      </div>

      {// something selected 
        selectedShapeInfo.id !== null &&
        <Paper id="status-bar" className="p-3" square>
          <div className="mb-2">

            <span> نوع شکل: </span>
            <span>
              {
                Object.keys(shapeKinds)
                  .find(it => shapeKinds[it] === selectedShapeInfo.shapeObj.kind)
                  .toLowerCase()
              }
            </span>
          </div>

          {('x' in selectedShapeInfo.shapeObj) &&
            <TextField
              type="number"
              label="مختصات x"
              value={prettyFloatNumber(selectedShapeInfo.shapeObj.x)}
              onChange={e => {
                let nv = parseInt(e.target.value)
                selectedShapeInfo.shapeObj.x = nv
                onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
              }}
            />
          }
          {('y' in selectedShapeInfo.shapeObj) &&
            <TextField
              type="number"
              label="مختصات y"
              value={prettyFloatNumber(selectedShapeInfo.shapeObj.y)}
              onChange={e => {
                let nv = parseInt(e.target.value)
                selectedShapeInfo.shapeObj.y = nv
                onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
              }}
            />
          }
          <TextField
            type="number"
            label="عرض"
            value={
              prettyFloatNumber
                (selectedShapeInfo.shapeObj.kind === shapeKinds.StraghtLine ?
                  selectedShapeInfo.shapeObj.points[2] :
                  selectedShapeInfo.shapeObj.width)
            }
            onChange={e => {
              let nv = parseInt(e.target.value)

              if (selectedShapeInfo.shapeObj.kind === shapeKinds.StraghtLine)
                selectedShapeInfo.shapeObj.points = replaceInArray(selectedShapeInfo.shapeObj.points, 2, nv)

              else
                selectedShapeInfo.shapeObj.width = nv

              onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
            }}

          />
          <TextField
            type="number"
            label="ارتفاع"
            value={
              prettyFloatNumber
                (selectedShapeInfo.shapeObj.kind === shapeKinds.StraghtLine ?
                  selectedShapeInfo.shapeObj.points[3] :
                  selectedShapeInfo.shapeObj.height)
            }
            onChange={e => {
              let nv = parseInt(e.target.value)

              if (selectedShapeInfo.shapeObj.kind === shapeKinds.StraghtLine)
                selectedShapeInfo.shapeObj.points = replaceInArray(selectedShapeInfo.shapeObj.points, 3, nv)

              else
                selectedShapeInfo.shapeObj.height = nv

              onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
            }}
          />

          {('rotationDeg' in selectedShapeInfo.shapeObj) && <>
            <Typography gutterBottom> چرخش </Typography>
            <Slider
              value={selectedShapeInfo.shapeObj.rotationDeg}
              onChange={(e, nv) => {
                selectedShapeInfo.shapeObj.rotationDeg = nv
                onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
              }}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              min={0}
              max={360}
              valueLabelDisplay="auto"
            />
          </>
          }

          {('strokeWidth' in selectedShapeInfo.shapeObj) && <>
            <Typography gutterBottom> اندازه خط </Typography>
            <Slider
              value={selectedShapeInfo.shapeObj.strokeWidth}
              onChange={(e, nv) => {
                selectedShapeInfo.shapeObj.strokeWidth = nv
                onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
              }}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              min={isKindOfLine(selectedShapeInfo.shapeObj.kind) ? 1 : 0}
              max={20}
              marks
              valueLabelDisplay="auto"
            />
          </>
          }
          {/* color picking */}
          {selectedShapeInfo.shapeObj.kind !== shapeKinds.Image &&
            <>
              {
                !isKindOfLine(selectedShapeInfo.shapeObj.kind) &&
                <div>
                  <span> رنگ داخل: </span>
                  <ColorPreview
                    onClick={() => {
                      if (selectedTool === APP_TOOLS.FG_COLOR_PICKER)
                        setSelectedTool(APP_TOOLS.NOTHING)
                      else {
                        setSelectedTool(APP_TOOLS.FG_COLOR_PICKER)
                        setColor(selectedShapeInfo.shapeObj.fill)
                      }
                    }}
                    hexColor={selectedShapeInfo.shapeObj.fill} />
                </div>
              }
              <div>
                <span> رنگ خط: </span>
                <ColorPreview
                  onClick={() => {
                    if (selectedTool === APP_TOOLS.STROKE_COLOR_PICKER)
                      setSelectedTool(APP_TOOLS.NOTHING)
                    else {
                      setSelectedTool(APP_TOOLS.STROKE_COLOR_PICKER)
                      setColor(selectedShapeInfo.shapeObj.stroke)
                    }
                  }}
                  hexColor={selectedShapeInfo.shapeObj.stroke} />
              </div>
              {
                isColorPicking() &&
                <div id="color-picker-wrapper">
                  <SketchPicker
                    disableAlpha
                    color={color}
                    onChange={(color) => setColor(color['hex'])}
                    onChangeComplete={(color) => {
                      let key = selectedTool === APP_TOOLS.STROKE_COLOR_PICKER ? 'stroke' : 'fill'
                      onShapeChanged(selectedShapeInfo.index, { ...selectedShapeInfo.shapeObj, [key]: color['hex'] })
                    }}
                  />
                </div>
              }
            </>
          }
          {('opacity' in selectedShapeInfo.shapeObj) && <>
            <Typography gutterBottom> شفافیت </Typography>
            <Slider
              value={selectedShapeInfo.shapeObj.opacity}
              onChange={(e, nv) => {
                selectedShapeInfo.shapeObj.opacity = nv
                onShapeChanged(selectedShapeInfo.index, selectedShapeInfo.shapeObj)
              }}
              aria-labelledby="discrete-slider-small-steps"
              step={0.05}
              min={0.05}
              max={1}
              valueLabelDisplay="auto"
            />
          </>
          }

          <button className="btn btn-danger mt-3" onClick={() => setSelectedId(null)}>
            خروج
          </button>
        </Paper>
      }
      <CustomSearchbar setVerseText={setVerseText} />
      {/* konva canvas */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageEl}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >

        {/* background layer */}
        <Layer>
          <KImage
            width={window.innerWidth}
            height={window.innerHeight}
            // image={backgroundimage.imageObj}
            name="bg-layer"
          />
        </Layer>

        {/* main layer */}
        <Layer ref={mainLayer}>
          {shapes.map((shape, i) => objectToShape(
            shape,
            shape.id === selectedShapeInfo.id,
            () => onShapeSelected(shape.id),
            (newAttrs) => onShapeChanged(i, newAttrs),
          ))}
        </Layer>

        {/* drawing preview layer */}
        {isInJamBoardMode() &&
          <Layer ref={drawingPreviewLayer}>
            <Rect
              width={window.innerWidth}
              height={window.innerHeight}
              fill="#fff"
              opacity={0.5}
            />
            {tempShapes.map((shape, i) =>
              <SimpleLine
                key={shape.id}
                shapeProps={{ ...shape }}
              />)}
          </Layer>}
      </Stage>

    </div >
  )
}