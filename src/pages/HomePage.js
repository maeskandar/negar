import React from "react"
import { SketchPicker } from "react-color"
import randInt from 'random-int' // TODO we can remove it in future

import { shapeKinds, isKindOfLine, hasStroke } from "../canvas"
import { newRectangle } from "../canvas/Rectangle"
import { newCircle } from "../canvas/Circle"
import { newImage } from "../canvas/Images"
import { newTextNode } from "../canvas/TextNode"
import { newArrow } from "../canvas/Arrow"
import { newSimpleLine } from "../canvas/SimpleLine"
import { newStraghtLine } from "../canvas/StraightLine"
import { newCustomLine } from "../canvas/CustomLine"

import { MyVerticallyCenteredModal } from "../UI/MyVerticallyCenteredModal"
import { ColorPreview } from "../UI/ColorPreview"
import CustomSearchbar from "../UI/CustomSearchbar"

import { removeInArray, replaceInArray, cleanArray, addToArray, arraysEqual } from "../utils/array"
import { removeInSet, addToSet, setHasParamsAnd, setHasParamsOr } from "../utils/set"
import { pointsDistance, prettyFloatNumber } from "../utils/math"
import { downloadURI } from "../utils/other"
import {
  Paper, TextField, Slider, Typography,
  Select, MenuItem,
} from "@material-ui/core"

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

import './home.css'
import { backgrounds, imagesData } from "./meta.json"
import { ToolBarBtn } from "../UI/Toolbar"
import { APP_STATES, APP_TOOLS, ERASER_RADIUS, FONT_NAMES, PIXEL_RATIO_DOWNLAOD } from "./defaults"

import {
  initCanvas, addShape, updateShape, removeShape,
  board, shapes,
  activateTransformer, disableTransformer,
} from "../canvas/manager"

let drawingTempData = []

export default class HomePage extends React.Component {
  state = {
    color: '#fff',
    selectedShapeInfo: { id: null, shapeAttrs: null },

    // app functionality related
    appState: new Set(),
    selectedTool: APP_TOOLS.NOTHING,
    backgroundimage: { url: null, imageObj: null, },
  }

  constructor(props) {
    super(props)

    this.isInJamBoardMode = this.isInJamBoardMode.bind(this)
    this.isColorPicking = this.isColorPicking.bind(this)
    this.isSomethingSelected = this.isSomethingSelected.bind(this)
    this.addRectangle = this.addRectangle.bind(this)
    this.addCircle = this.addCircle.bind(this)
    this.addArrow = this.addArrow.bind(this)
    this.addImage = this.addImage.bind(this)
    this.addText = this.addText.bind(this)
    this.StartLineDrawingMode = this.StartLineDrawingMode.bind(this)
    this.startJamBoard = this.startJamBoard.bind(this)
    this.saveAsImage = this.saveAsImage.bind(this)
    this.setBackgroundimage = this.setBackgroundimage.bind(this)
    this.cancelOperation = this.cancelOperation.bind(this)
    this.doneOperation = this.doneOperation.bind(this)
    this.setSelectedId = this.setSelectedId.bind(this)
    this.onShapeChanged = this.onShapeChanged.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this)
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this)
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this)
    this.deleteShape = this.deleteShape.bind(this)
    this.includeToAppStates = this.includeToAppStates.bind(this)
    this.excludeFromAppState = this.excludeFromAppState.bind(this)
    this.keyboardEvents = this.keyboardEvents.bind(this)
  }

  // advanced state checker
  isInJamBoardMode() {
    return this.state.appState.has(APP_STATES.DRAWING) &&
      (this.state.selectedTool === APP_TOOLS.PENCIL || this.state.selectedTool === APP_TOOLS.ERASER)
  }
  isColorPicking() {
    return this.state.selectedTool === APP_TOOLS.FG_COLOR_PICKER || this.state.selectedTool === APP_TOOLS.STROKE_COLOR_PICKER
  }

  // advenced state functionalities
  includeToAppStates(val) {
    this.setState({ appState: addToSet(this.state.appState, val) })
  }
  excludeFromAppState(val) {
    this.setState({ appState: removeInSet(this.state.appState, val) })
  }
  isSomethingSelected() {
    return this.state.selectedShapeInfo.id !== null
  }

  // related to the canvas
  addRectangle(x, y) {
    addShape(newRectangle(x, y))
  }
  addCircle(x, y) {
    addShape(newCircle(x, y))
  }
  addArrow() {
    addShape(newArrow())
  }
  addImage(e) {
    addShape(newImage(e))
  }
  addText(text = 'تایپ کن') {
    addShape(newTextNode(text))
  }

  handleCanvasClick(ev) {
    if ('id' in ev.target.attrs) { // if a shape selected
      let id = ev.target.attrs.id
      this.setSelectedId(id)
    }
    else { // FIXME it's not working for now - maybe i should set szie for layar
      this.setSelectedId(null)
      this.cancelOperation()
    }
  }
  handleCanvasMouseDown(e) {
    if (!this.state.appState.has(APP_STATES.DRAGING))
      this.includeToAppStates(APP_STATES.DRAGING)

    if (this.state.appState.has(APP_STATES.DRAWING)) {
      const pos = e.target.getStage().getPointerPosition()
      drawingTempData = [pos.x, pos.y]
    }
  }
  handleCanvasMouseMove(e) {
    if (setHasParamsAnd(this.state.appState, APP_STATES.DRAWING, APP_STATES.DRAGING)) {
      var mp = board.getPointerPosition()
      mp = [mp.x, mp.y]


      if (this.state.selectedTool === APP_TOOLS.PENCIL) {
        // setTempShapes(
        //   addToArray(tempShapes,
        //     newSimpleLine(drawingTempData.concat(mp))))
        drawingTempData = mp
      }
      else if (this.state.selectedTool === APP_TOOLS.ERASER) {
        let acc = []
        // for (const l of tempShapes) {
        //   let
        //     sp = [l.points[0], l.points[1]],
        //     ep = [l.points[2], l.points[3]]

        //   if ([pointsDistance(sp, mp), pointsDistance(ep, mp)].every(v => v > ERASER_RADIUS)) {
        //     acc.push(l)
        //   }
        // }
        // setTempShapes(acc)
      }
    }
  }
  handleCanvasMouseUp(e) {
    if (this.state.selectedTool === APP_TOOLS.LINE) {
      let pos = e.target.getStage().getPointerPosition()
      // addToShapes(false, newStraghtLine(drawingTempData.concat([pos.x, pos.y])))
    }

    this.excludeFromAppState(APP_STATES.DRAGING)
  }

  // app functionalities
  setSelectedId(shapeId) {
    let lastSelectedId = this.state.selectedShapeInfo.id
    if (shapeId === null && lastSelectedId !== null) {
      let lastShape = shapes[this.state.selectedShapeInfo.id]

      disableTransformer()
      updateShape(lastShape, { draggable: false })

      this.setState({
        selectedShapeInfo: {
          id: null,
          shapeAttrs: null,
        }
      })
    }
    else if (shapeId !== null) {
      let shape = shapes[shapeId]

      if (lastSelectedId)
        updateShape(shapes[lastSelectedId], { draggable: false })

      activateTransformer(shape)
      updateShape(shape, { draggable: true })

      this.setState({
        selectedShapeInfo: {
          id: shapeId,
          shapeAttrs: shape.attrs,
        }
      })
    }
  }
  onShapeChanged(changedAttrs) {
    if (this.isSomethingSelected()) {
      updateShape(shapes[this.state.selectedShapeInfo.id], changedAttrs)
      this.setState({ selectedShapeInfo: { ...this.state.selectedShapeInfo } })
    }
  }
  deleteShape() {
    let shapeId = this.state.selectedShapeInfo.id
    if (shapeId) {
      this.setSelectedId(null)
      removeShape(shapes[shapeId])
    }
  }
  StartLineDrawingMode() {
    this.includeToAppStates(APP_STATES.DRAWING)
    this.setState({ selectedTool: APP_TOOLS.LINE })
  }
  startJamBoard() {
    this.includeToAppStates(APP_STATES.DRAWING)
    this.setSelectedId(null)
    this.setState({ selectedTool: APP_TOOLS.PENCIL })
  }
  saveAsImage() {
    let dataURL = board.toDataURL({ pixelRatio: PIXEL_RATIO_DOWNLAOD })
    downloadURI(dataURL, 'stage.png')
  }
  setBackgroundimage(url) {
    this.setState({ backgroundimage: { url, imageObj: null } })

    let imageObj = new Image()
    imageObj.src = url
    imageObj.onload = () =>
      this.setState({ backgroundimage: { url, imageObj } })

    // FIXME set to bgLayer
  }
  cancelOperation() {
    if (this.state.appState.has(APP_STATES.DRAWING)) {
      cleanArray(drawingTempData)
      // setTempShapes([])
    }

    this.setState({
      appState: new Set(),
      selectedTool: APP_TOOLS.NOTHING
    })
  }
  doneOperation() {
    if (this.state.appState.has(APP_STATES.DRAWING)) {
      // stick lines if they have Intersection, else create new line
      // if (isInJamBoardMode() && tempShapes.length !== 0) {
      //   let
      //     resultLines = [],
      //     tempPoints = []


      //   function stickToLast(...newPoints) {
      //     tempPoints.push(...newPoints)
      //   }
      //   function closeLastLine() {
      //     // resultLines.push(newCustomLine(tempPoints))
      //   }
      //   function addNewLine(...points) {
      //     tempPoints = points
      //   }

      //   tempPoints = tempShapes[0].points

      //   for (let i = 1; i < tempShapes.length - 1; i++) {
      //     let
      //       lcp = tempShapes[i].points, // current line points
      //       lnp = tempShapes[i + 1].points  // next line points

      //     // if end points of this line are equal to start points of next line
      //     if (arraysEqual(lcp.slice(2), lnp.slice(0, 2))) {
      //       stickToLast(...lnp.slice(2))
      //     }
      //     else {
      //       closeLastLine()
      //       addNewLine(...lnp)
      //     }
      //   }
      //   closeLastLine()

      //   addToShapes(false, ...resultLines)
      // }

    }
    this.cancelOperation()
  }
  keyboardEvents(ev) {
    if (ev.code === "Delete") this.deleteShape()
    else if (ev.code === "Escape") this.setSelectedId(null)
  }

  // register native events 
  componentDidMount() {
    window.addEventListener('keydown', this.keyboardEvents) // TODO use external dependency to manager keyboard events

    initCanvas({
      onClick: this.handleCanvasClick,
      onMouseDown: this.handleCanvasMouseDown,
      onMouseMove: this.handleCanvasMouseMove,
      onMouseUp: this.handleCanvasMouseUp
    })

    this.setBackgroundimage('/images/pexels-eberhard-grossgasteiger-1064162.jpg')
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardEvents)
  }
  render() {
    return (
      <div id="home-page">

        {this.state.backgroundModalShow && <MyVerticallyCenteredModal
          title={"پس زمینه"}
          images={backgrounds}
          show={this.state.backgroundModalShow}
          setimage={this.setBackgroundimage}
          onHide={() => this.setState({ backgroundModalShow: false })}
        />
        }{this.state.imageModalShow && <MyVerticallyCenteredModal
          title={"تصویر"}
          images={imagesData}
          show={this.state.imageModalShow}
          setimage={(e) => this.addImage(e)}
          onHide={() => this.setState({ imageModalShow: false })}
        />
        }

        <div id="tool-bar-wrapper">
          <Paper
            id="tool-bar"
            elevation={3}>
            {/* Default State */
              !this.state.appState.has(APP_STATES.DRAWING) && <>
                <ToolBarBtn
                  title="مستطیل"
                  onClick={() => this.addRectangle(randInt(100), randInt(100))}
                  iconEl={<RectangleIcon />}
                />
                <ToolBarBtn
                  title="دایره"
                  onClick={() => this.addCircle(randInt(100), randInt(100))}
                  iconEl={<CircleIcon />}
                />
                <ToolBarBtn
                  title="خط"
                  onClick={this.StartLineDrawingMode}
                  iconEl={<LineIcon />}
                />
                <ToolBarBtn
                  title="متن"
                  onClick={this.addText}
                  iconEl={<TextIcon />}
                />
                <ToolBarBtn
                  title="تصویر"
                  iconEl={<ImageIcon />}
                  onClick={() => this.setState({ imageModalShow: true })}
                />
                <ToolBarBtn
                  title="فلش"
                  iconEl={<ArrowIcon />}
                  onClick={this.addArrow}
                />
                <ToolBarBtn
                  title="تخته"
                  iconEl={<JamBoardIcon />}
                  onClick={this.startJamBoard}
                />
                <ToolBarBtn
                  title="ذخیره"
                  iconEl={<SaveIcon />}
                  onClick={this.saveAsImage}
                />
                <ToolBarBtn
                  title="پس زمینه"
                  iconEl={<BackgroundIcon />}
                  onClick={() => this.setState({ backgroundModalShow: true })}
                />
              </>
            }
            {/* JamBoard */
              this.isInJamBoardMode() && <>
                <ToolBarBtn
                  title="مداد"
                  iconEl={<PencilIcon />}
                  onClick={() => this.setState({ selectedTool: APP_TOOLS.PENCIL })}
                  disabled={this.state.selectedTool === APP_TOOLS.PENCIL}
                />
                <ToolBarBtn
                  title="پاک کن"
                  iconEl={<EraserIcon />}
                  disabled={this.state.selectedTool === APP_TOOLS.ERASER}
                  onClick={() => { this.setState({ selectedTool: APP_TOOLS.ERASER }) }}
                />
              </>
            }
            {/* Drawing State */
              setHasParamsOr(this.state.appState, APP_STATES.DRAWING) && <>
                <ToolBarBtn
                  title="ثبت عملیات"
                  iconEl={<DoneAll />}
                  onClick={this.doneOperation}
                />

                <ToolBarBtn
                  title="لغو عملیات"
                  iconEl={<CancelIcon />}
                  onClick={this.cancelOperation}
                />
              </>
            }
          </Paper>
        </div>

        {// something selected 
          this.isSomethingSelected() &&
          <Paper id="status-bar" className="p-3" square>
            <div className="mb-2">

              <span> نوع شکل: </span>
              <span>
                {
                  Object.keys(shapeKinds)
                    .find(it => shapeKinds[it] === this.state.selectedShapeInfo.shapeAttrs.kind)
                    .toLowerCase()
                }
              </span>
            </div>

            {('x' in this.state.selectedShapeInfo.shapeAttrs) &&
              <TextField
                type="number"
                label="مختصات x"
                value={prettyFloatNumber(this.state.selectedShapeInfo.shapeAttrs.x)}
                onChange={e => {
                  this.onShapeChanged({ x: parseInt(e.target.value) })
                }}
              />
            }
            {('y' in this.state.selectedShapeInfo.shapeAttrs) &&
              <TextField
                type="number"
                label="مختصات y"
                value={prettyFloatNumber(this.state.selectedShapeInfo.shapeAttrs.y)}
                onChange={e => {
                  this.onShapeChanged({ y: parseInt(e.target.value) })
                }}
              />
            }
            {
              <TextField
                type="number"
                label="عرض"
                value={
                  prettyFloatNumber
                    (this.state.selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine ?
                      this.state.selectedShapeInfo.shapeAttrs.points[2] :
                      this.state.selectedShapeInfo.shapeAttrs.width)
                }
                onChange={e => {
                  // if (this.state.selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine)
                  //   this.state.selectedShapeInfo.shapeAttrs.points = replaceInArray(this.state.selectedShapeInfo.shapeAttrs.points, 2, nv)

                  // else
                  //   this.state.selectedShapeInfo.shapeAttrs.width = nv

                  this.onShapeChanged({ width: parseInt(e.target.value) })
                }}
              />
            }
            {this.state.selectedShapeInfo.shapeAttrs.kind !== shapeKinds.Text &&
              <TextField
                type="number"
                label="ارتفاع"
                value={
                  prettyFloatNumber
                    (this.state.selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine ?
                      this.state.selectedShapeInfo.shapeAttrs.points[3] :
                      this.state.selectedShapeInfo.shapeAttrs.height)
                }
                onChange={e => {
                  // let nv = parseInt(e.target.value)

                  // if (this.state.selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine)
                  //   this.state.selectedShapeInfo.shapeAttrs.points = replaceInArray(this.state.selectedShapeInfo.shapeAttrs.points, 3, nv)

                  // else
                  //   this.state.selectedShapeInfo.shapeAttrs.height = nv

                  this.onShapeChanged({ height: parseInt(e.target.value) })
                }}
              />
            }
            {('rotation' in this.state.selectedShapeInfo.shapeAttrs) && <>
              <Typography gutterBottom> چرخش </Typography>
              <Slider
                value={this.state.selectedShapeInfo.shapeAttrs.rotation}
                onChange={(e, nv) => this.onShapeChanged({ rotation: nv })}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                min={0}
                max={360}
                valueLabelDisplay="auto"
              />
            </>
            }
            {('text' in this.state.selectedShapeInfo.shapeAttrs) &&
              <TextField
                label="متن"
                rows={5}
                multiline
                value={this.state.selectedShapeInfo.shapeAttrs.text}
                onChange={e => this.onShapeChanged({ text: e.target.value })}
              />
            }
            {('fontSize' in this.state.selectedShapeInfo.shapeAttrs) && <>
              <Typography gutterBottom> اندازه فونت </Typography>
              <Slider
                value={this.state.selectedShapeInfo.shapeAttrs.fontSize}
                onChange={(e, nv) => this.onShapeChanged({ fontSize: nv })}
                aria-labelledby="discrete-slider-small-steps"
                step={0.5}
                min={1}
                max={150}
                valueLabelDisplay="auto"
              />
            </>
            }
            {(this.state.selectedShapeInfo.shapeAttrs.kind === shapeKinds.Text) && <>
              <Typography gutterBottom> نوع فونت </Typography>
              <Select
                value={this.state.selectedShapeInfo.shapeAttrs.fontFamily}
                onChange={e => this.onShapeChanged({ fontFamily: e.target.value })}
              >
                {FONT_NAMES.map(fname =>
                  <MenuItem value={fname}>{fname} </MenuItem>)
                }
              </Select>

              <Typography gutterBottom> ارتفاع خط </Typography>
              <Slider
                value={this.state.selectedShapeInfo.shapeAttrs.lineHeight}
                onChange={(e, nv) => this.onShapeChanged({ lineHeight: nv })}
                aria-labelledby="discrete-slider-small-steps"
                step={0.1}
                min={0.1}
                max={8}
                valueLabelDisplay="auto"
              />

              <Typography gutterBottom> چینش </Typography>
              <Select
                value={this.state.selectedShapeInfo.shapeAttrs.align}
                onChange={e => this.onShapeChanged({ align: e.target.value })}
              >
                {['left', 'right', 'center'].map(v =>
                  <MenuItem value={v}>{v} </MenuItem>)
                }
              </Select>
            </>
            }
            {('strokeWidth' in this.state.selectedShapeInfo.shapeAttrs) && <>
              <Typography gutterBottom> اندازه خط </Typography>
              <Slider
                value={this.state.selectedShapeInfo.shapeAttrs.strokeWidth}
                onChange={(e, nv) => this.onShapeChanged({ strokeWidth: nv })}
                aria-labelledby="discrete-slider-small-steps"
                step={this.state.selectedShapeInfo.shapeAttrs.kind === shapeKinds.Text ? 0.1 : 0.5}
                min={isKindOfLine(this.state.selectedShapeInfo.shapeAttrs.kind) ? 1 : 0}
                max={20}
                valueLabelDisplay="auto"
              />
            </>
            }
            {/* color picking */}
            {hasStroke(this.state.selectedShapeInfo.shapeAttrs.kind) &&
              <>
                {
                  !isKindOfLine(this.state.selectedShapeInfo.shapeAttrs.kind) &&
                  <div>
                    <span> رنگ داخل: </span>
                    <ColorPreview
                      onClick={() => {
                        if (this.state.selectedTool === APP_TOOLS.FG_COLOR_PICKER)
                          this.setState({ selectedTool: APP_TOOLS.NOTHING })
                        else {
                          this.setState({
                            selectedTool: APP_TOOLS.FG_COLOR_PICKER,
                            color: this.state.selectedShapeInfo.shapeAttrs.fill
                          })
                        }
                      }}
                      hexColor={this.state.selectedShapeInfo.shapeAttrs.fill} />
                  </div>
                }
                <div>
                  <span> رنگ خط: </span>
                  <ColorPreview
                    onClick={() => {
                      if (this.state.selectedTool === APP_TOOLS.STROKE_COLOR_PICKER)
                        this.setState({ selectedTool: APP_TOOLS.NOTHING })
                      else {
                        this.setState({
                          selectedTool: APP_TOOLS.STROKE_COLOR_PICKER,
                          color: this.state.selectedShapeInfo.shapeAttrs.stroke
                        })
                      }
                    }}
                    hexColor={this.state.selectedShapeInfo.shapeAttrs.stroke} />
                </div>
                {
                  this.isColorPicking() &&
                  <div id="color-picker-wrapper">
                    <SketchPicker
                      disableAlpha
                      color={this.state.color}
                      onChange={(color) => this.setState({ color: color['hex'] })}
                      onChangeComplete={(color) => {
                        let key = this.state.selectedTool === APP_TOOLS.STROKE_COLOR_PICKER ? 'stroke' : 'fill'
                        this.onShapeChanged({ [key]: color['hex'] })
                      }}
                    />
                  </div>
                }
              </>
            }
            {('opacity' in this.state.selectedShapeInfo.shapeAttrs) && <>
              <Typography gutterBottom> شفافیت </Typography>
              <Slider
                value={this.state.selectedShapeInfo.shapeAttrs.opacity}
                onChange={(e, nv) => { this.onShapeChanged({ opacity: nv }) }}
                aria-labelledby="discrete-slider-small-steps"
                step={0.01}
                min={0.05}
                max={1}
                valueLabelDisplay="auto"
              />
            </>
            }
            <button className="btn btn-danger mt-3" onClick={() => this.setSelectedId(null)}>
              خروج
            </button>
          </Paper>
        }
        {
          !this.isSomethingSelected() && <CustomSearchbar
            onAyaSelect={t => this.addText(t)} />
        }
        <div id="container" className="w-100 h-100"></div>
      </div>
    )
  }
}