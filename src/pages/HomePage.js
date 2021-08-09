import React from "react"

// utilities
import randInt from 'random-int' // TODO we can remove it in future
import { cleanArray, arraysEqual, replaceInArray, removeInArray } from "../utils/array"
import { removeInSet, addToSet, setHasParamsAnd, setHasParamsOr } from "../utils/set"
import { protectedMin, pointsDistance, prettyFloatNumber } from "../utils/math"
import { downloadURI } from "../utils/other"

// data
import { imagesData } from "./meta.json"
import { APP_STATES, APP_TOOLS, ERASER_RADIUS, FONT_NAMES, PIXEL_RATIO_DOWNLAOD, TABS } from "./defaults"

// ui 
import {
  Paper, TextField, Slider, Typography,
  Select, MenuItem,
  Tab, Tabs, AppBar, IconButton
} from "@material-ui/core"

import {
  CropDin as RectangleIcon,
  RadioButtonUnchecked as CircleIcon,
  Forward as ArrowIcon,
  Remove as LineIcon,
  InsertPhoto as ImageIcon,
  Gesture as JamBoardIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  Create as PencilIcon,
  Backspace as EraserIcon,
  TextFields as TextIcon,
  DoneAll as DoneIcon,
  FilterHdr as MointainIcon,
  Flag as FlagIcon,
  Info as InfoIcon,
  ExitToApp as EnterIcon,
  Close as CloseIcon,
  ArrowBackIos as BackIcon,
  DraftsTwoTone
} from '@material-ui/icons'
import { SketchPicker } from "react-color"
import { ColorPreview, CustomSearchbar, MyVerticallyCenteredModal, ToolBarBtn } from "../UI/"
import './home.css'

// canvas import 
import {
  newArrow, newCircle, newImage, newRectangle,
  newStraghtLine, newCustomLine, newSimpleLine, newTextNode
} from "../canvas/shapes"

import { newFlag, newMountain } from "../canvas/stages"

import { shapeKinds, isKindOfLine, hasStroke, isStage } from "../canvas"

import {
  initCanvas, addShape, updateShape, removeShape,
  addTempShape, resetTempPage,
  board, shapes, tempShapes,
  setBackgroundColor, activateTransformer, disableTransformer, drawingLayer, mainLayer, disableDrawingLayer, prepareDrawingLayer, triggerShapeEvent,
} from "../canvas/manager"


function TabPanel(props) {
  let { children, value, index } = props

  return (
    <div hidden={value !== index}>
      {value === index && children}
    </div>
  )
}

let
  drawingTempData = [],
  drawingTempFunction = null,
  drawingTempShape = null


export default class HomePage extends React.Component {
  state = {
    route: [],

    appState: new Set(),
    selectedTool: APP_TOOLS.NOTHING,
    selectedTab: TABS.VISUAL,

    imageModalShow: false,
    showStateModal: false,

    selectedShapeInfo: { id: null, shapeProps: null },
    color: '#fff',
  }

  constructor(props) {
    super(props)

    this.isInJamBoardMode = this.isInJamBoardMode.bind(this)
    this.isColorPicking = this.isColorPicking.bind(this)
    this.isSomethingSelected = this.isSomethingSelected.bind(this)
    this.addMountain = this.addMountain.bind(this)
    this.addFlag = this.addFlag.bind(this)
    this.addRectangle = this.addRectangle.bind(this)
    this.addCircle = this.addCircle.bind(this)
    this.addArrow = this.addArrow.bind(this)
    this.addImage = this.addImage.bind(this)
    this.addText = this.addText.bind(this)
    this.startDrawingShape = this.startDrawingShape.bind(this)
    this.startLineDrawingMode = this.startLineDrawingMode.bind(this)
    this.startJamBoard = this.startJamBoard.bind(this)
    this.saveAsImage = this.saveAsImage.bind(this)
    this.enterStage = this.enterStage.bind(this)
    this.backStage = this.backStage.bind(this)
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
  startDrawingShape(fn) {
    this.setState({
      appState: addToSet(this.state.appState, APP_STATES.DRAWING),
      selectedTool: APP_TOOLS.SHAPE_DRAWING,
    })
    drawingTempFunction = fn
    this.setSelectedId(null)
    prepareDrawingLayer()
  }
  addMountain() {
    this.startDrawingShape(newMountain)
  }
  addFlag() {
    this.startDrawingShape(newFlag)
  }
  addRectangle() {
    this.startDrawingShape(newRectangle)
  }
  addCircle() {
    this.startDrawingShape(newCircle)
  }
  addArrow() {
    this.startDrawingShape(newArrow)
  }
  addImage(e) {
    addShape(newImage(e))
  }
  addText(text = 'تایپ کن') {
    addShape(newTextNode(text))
  }

  backStage() {
    let route = this.state.route
    if (route.length === 0) return
    this.setState({ route: removeInArray(route, route.length - 1) })
  }
  enterStage(shapeId) {
    this.setState({
      route: this.state.route.concat(shapeId),
      showStateModal: false
    })
  }

  handleCanvasClick(ev) {
    if ('props' in ev.target) {
      if ('id' in ev.target.props) { // if a shape selected
        this.setSelectedId(ev.target.props.id)
      }
      else if ('props' in ev.target && ev.target.props["isMain"] === false) { // select parent node for advanced shapes like flag
        this.setSelectedId(ev.target.parent.props.id)
      }
    }
    else if (!this.isInJamBoardMode() && this.state.selectedTool === APP_TOOLS.NOTHING) {
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

    if (this.state.selectedTool === APP_TOOLS.SHAPE_DRAWING) {
      drawingTempShape = drawingTempFunction({
        x: drawingTempData[0],
        y: drawingTempData[1],
        width: 16,
        height: 16,
      })
      triggerShapeEvent(drawingTempShape, 'drawStart')
      drawingLayer.add(drawingTempShape)
    }
  }
  handleCanvasMouseMove(e) {
    if (setHasParamsAnd(this.state.appState, APP_STATES.DRAWING, APP_STATES.DRAGING)) {
      var mp = board.getPointerPosition()
      mp = [mp.x, mp.y]

      let st = this.state.selectedTool
      if (st === APP_TOOLS.PENCIL) {
        let newLine = newSimpleLine(drawingTempData.concat(mp))
        addTempShape(newLine)
        drawingTempData = mp
      }
      else if (st === APP_TOOLS.ERASER) {
        let acc = []
        for (const l of tempShapes) {
          let
            sp = [l.attrs.points[0], l.attrs.points[1]],
            ep = [l.attrs.points[2], l.attrs.points[3]]

          if ([pointsDistance(sp, mp), pointsDistance(ep, mp)].every(v => v > ERASER_RADIUS)) {
            acc.push(l)
          }
        }
        resetTempPage(acc)
      }
      else if (st === APP_TOOLS.SHAPE_DRAWING) {
        let
          dx = protectedMin(mp[0] - drawingTempData[0], 16),
          dy = protectedMin(mp[1] - drawingTempData[1], 16)

        updateShape(drawingTempShape, {
          width: dx,
          height: dy
        })
        drawingLayer.draw()
      }
    }
  }
  handleCanvasMouseUp(e) {
    let st = this.state.selectedTool
    if (st === APP_TOOLS.LINE) {
      let pos = e.target.getStage().getPointerPosition()
      addShape(newStraghtLine(drawingTempData.concat([pos.x, pos.y])))
    }
    else if (st === APP_TOOLS.SHAPE_DRAWING) {
      this.doneOperation()
    }

    this.excludeFromAppState(APP_STATES.DRAGING)
  }

  // app functionalities
  setSelectedId(shapeId) {
    let lastSelectedId = this.state.selectedShapeInfo.id

    if (lastSelectedId === shapeId) return

    else if (shapeId === null && lastSelectedId !== null) {
      let lastShape = shapes[this.state.selectedShapeInfo.id]

      disableTransformer()
      updateShape(lastShape, { draggable: false })

      this.setState({
        selectedShapeInfo: {
          id: null,
          shapeProps: null,
        },
        showStateModal: false,
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
          shapeProps: shape.props,
        },
        showStateModal: isStage(shape.props.kind)
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
  startLineDrawingMode() {
    this.includeToAppStates(APP_STATES.DRAWING)
    this.setState({ selectedTool: APP_TOOLS.LINE }, () => {
    })
    // prepareDrawingLayer()
  }
  startJamBoard() {
    this.includeToAppStates(APP_STATES.DRAWING)
    this.setSelectedId(null)
    this.setState({ selectedTool: APP_TOOLS.PENCIL })
    prepareDrawingLayer()
  }
  saveAsImage() {
    let dataURL = board.toDataURL({ pixelRatio: PIXEL_RATIO_DOWNLAOD })
    downloadURI(dataURL, 'stage.png')
  }
  cancelOperation() {
    if (this.state.appState.has(APP_STATES.DRAWING)) {
      cleanArray(drawingTempData)
      resetTempPage()
    }

    this.setState({
      appState: new Set(),
      selectedTool: APP_TOOLS.NOTHING
    })

    disableDrawingLayer()
  }
  doneOperation() {
    if (this.state.appState.has(APP_STATES.DRAWING)) {
      // stick lines if they have Intersection, else create new line
      if (this.isInJamBoardMode() && tempShapes.length !== 0) {
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

        tempPoints = tempShapes[0].attrs.points

        for (let i = 1; i < tempShapes.length - 1; i++) {
          let
            lcp = tempShapes[i].attrs.points, // current line points
            lnp = tempShapes[i + 1].attrs.points  // next line points

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

        for (let line of resultLines)
          addShape(line)
      }
      else if (this.state.selectedTool == APP_TOOLS.SHAPE_DRAWING) {
        triggerShapeEvent(drawingTempShape, 'drawEnd')
        addShape(drawingTempShape)
        drawingTempShape = null
      }
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
    setBackgroundColor('#eeeeee')
    window.addEventListener('canvas', e => {
      let type = e.detail.type

      if (type === "create") {
      }
      else if (type === "update") {
        this.setState({ selectedShapeInfo: { ...this.state.selectedShapeInfo } })
      }
      else if (type === "delete") {
      }
    })

  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardEvents)
  }
  render() {
    let
      ssa = this.state.selectedShapeInfo.shapeProps,
      ss = this.state.selectedShapeInfo.id ?
        shapes[this.state.selectedShapeInfo.id] :
        null

    return (
      <div id="home-page">

        {this.state.imageModalShow && <MyVerticallyCenteredModal
          title={"تصویر"}
          images={imagesData}
          show={this.state.imageModalShow}
          setimage={(e) => this.addImage(e)}
          onHide={() => this.setState({ imageModalShow: false })}
        />}

        <div className="back-btn" onClick={this.backStage}>
          <IconButton size="small" color="#424242"> <BackIcon /> </IconButton>
        </div>

        {this.state.showStateModal &&
          <div className="state-modal">
            <div className="state-modal" style={{
              left: ss.absolutePosition().x,
              top: ss.absolutePosition().y - 62,
            }}>
              <IconButton color="primary" onClick={() => this.enterStage(ssa.id)}>
                <EnterIcon />
              </IconButton>
              <IconButton color="primary">
                <InfoIcon />
              </IconButton>
              <IconButton color="primary" onClick={() => this.setState({ showStateModal: false })}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>}

        <div className="router">
          {this.state.route.map(r =>
            <div className="route" key={r}> {r} </div>)}
        </div>

        <div id="tool-bar-wrapper">
          <Paper
            id="tool-bar"
            elevation={3}>
            {/* Default State */
              !this.state.appState.has(APP_STATES.DRAWING) && <>
                <ToolBarBtn
                  title="mountain"
                  onClick={this.addMountain}
                  iconEl={<MointainIcon />}
                />
                <ToolBarBtn
                  title="flag"
                  onClick={this.addFlag}
                  iconEl={<FlagIcon />}
                />
                <ToolBarBtn
                  title="مستطیل"
                  onClick={() => this.addRectangle()}
                  iconEl={<RectangleIcon />}
                />
                <ToolBarBtn
                  title="دایره"
                  onClick={() => this.addCircle(randInt(100), randInt(100))}
                  iconEl={<CircleIcon />}
                />
                <ToolBarBtn
                  title="خط"
                  onClick={this.startLineDrawingMode}
                  iconEl={<LineIcon />}
                />
                <ToolBarBtn
                  title="متن"
                  onClick={() => this.addText()}
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
                  iconEl={<DoneIcon />}
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

        {this.isSomethingSelected() &&
          <Paper id="status-bar" className="p-3" square>
            <AppBar position="relative">
              <Tabs value={this.state.selectedTab} onChange={(e, v) =>
                this.setState({ selectedTab: v })
              }>
                <Tab label="Visual" value={0} />
                <Tab label="Info" value={1} />
                <Tab label="Meta" value={2} />
              </Tabs>
            </AppBar>
            <TabPanel value={this.state.selectedTab} index={TABS.VISUAL}>
              <div className="mb-2">
                <span> نوع شکل: </span>
                <span>
                  {Object.keys(shapeKinds)
                    .find(it => shapeKinds[it] === ssa.kind)
                    .toLowerCase()
                  }
                </span>
              </div>

              {('x' in ssa) &&
                <TextField
                  type="number"
                  label="مختصات x"
                  value={prettyFloatNumber(ssa.x)}
                  onChange={e => {
                    this.onShapeChanged({ x: parseInt(e.target.value) })
                  }}
                />
              }
              {('y' in ssa) &&
                <TextField
                  type="number"
                  label="مختصات y"
                  value={prettyFloatNumber(ssa.y)}
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
                      (ssa.kind === shapeKinds.StraghtLine ?
                        ssa.points[2] :
                        ssa.width)
                  }
                  onChange={e => {
                    this.onShapeChanged({ width: parseInt(e.target.value) })
                  }}
                />
              }
              {ssa.kind !== shapeKinds.Text &&
                <TextField
                  type="number"
                  label="ارتفاع"
                  value={
                    prettyFloatNumber
                      (ssa.kind === shapeKinds.StraghtLine ?
                        ssa.points[3] :
                        ssa.height)
                  }
                  onChange={e => {
                    this.onShapeChanged({ height: parseInt(e.target.value) })
                  }}
                />
              }
              {('rotation' in ssa) && <>
                <Typography gutterBottom> چرخش </Typography>
                <Slider
                  value={ssa.rotation}
                  onChange={(e, nv) => this.onShapeChanged({ rotation: nv })}
                  aria-labelledby="discrete-slider-small-steps"
                  step={1}
                  min={0}
                  max={360}
                  valueLabelDisplay="auto"
                />
              </>
              }
              {('text' in ssa) &&
                <TextField
                  label="متن"
                  rows={5}
                  multiline
                  value={ssa.text}
                  onChange={e => this.onShapeChanged({ text: e.target.value })}
                />
              }
              {('fontSize' in ssa) && <>
                <Typography gutterBottom> اندازه فونت </Typography>
                <Slider
                  value={ssa.fontSize}
                  onChange={(e, nv) => this.onShapeChanged({ fontSize: nv })}
                  aria-labelledby="discrete-slider-small-steps"
                  step={0.5}
                  min={1}
                  max={150}
                  valueLabelDisplay="auto"
                />
              </>
              }
              {(ssa.kind === shapeKinds.Text) && <>
                <Typography gutterBottom> نوع فونت </Typography>
                <Select
                  value={ssa.fontFamily}
                  onChange={e => this.onShapeChanged({ fontFamily: e.target.value })}
                >
                  {FONT_NAMES.map(fname =>
                    <MenuItem value={fname}>{fname} </MenuItem>)
                  }
                </Select>

                <Typography gutterBottom> ارتفاع خط </Typography>
                <Slider
                  value={ssa.lineHeight}
                  onChange={(e, nv) => this.onShapeChanged({ lineHeight: nv })}
                  aria-labelledby="discrete-slider-small-steps"
                  step={0.1}
                  min={0.1}
                  max={8}
                  valueLabelDisplay="auto"
                />

                <Typography gutterBottom> چینش </Typography>
                <Select
                  value={ssa.align}
                  onChange={e => this.onShapeChanged({ align: e.target.value })}
                >
                  {['left', 'right', 'center'].map(v =>
                    <MenuItem value={v}>{v} </MenuItem>)
                  }
                </Select>
              </>
              }
              {
                ('borderSize' in ssa) && <>
                  <Typography gutterBottom> اندازه خط </Typography>
                  <Slider
                    value={ssa.borderSize}
                    onChange={(e, nv) => this.onShapeChanged({ borderSize: nv })}
                    // aria-labelledby="discrete-slider-small-steps"
                    step={ssa.kind === shapeKinds.Text ? 0.1 : 0.5}
                    min={isKindOfLine(ssa.kind) ? 1 : 0}
                    max={20}
                    valueLabelDisplay="auto"
                  />
                  <div>
                    <span> رنگ خط: </span>
                    <ColorPreview
                      hexColor={ssa.borderColor}
                      onClick={() => {
                        if (this.state.selectedTool === APP_TOOLS.STROKE_COLOR_PICKER)
                          this.setState({ selectedTool: APP_TOOLS.NOTHING })
                        else {
                          this.setState({
                            selectedTool: APP_TOOLS.STROKE_COLOR_PICKER,
                            color: ssa.borderColor
                          })
                        }
                      }}
                    />
                  </div>
                </>
              }
              {
                ('fill' in ssa) && <div>
                  <span> رنگ داخل: </span>
                  <ColorPreview
                    onClick={() => {
                      if (this.state.selectedTool === APP_TOOLS.FG_COLOR_PICKER)
                        this.setState({ selectedTool: APP_TOOLS.NOTHING })
                      else {
                        this.setState({
                          selectedTool: APP_TOOLS.FG_COLOR_PICKER,
                          color: ssa.fill
                        })
                      }
                    }}
                    hexColor={ssa.fill} />
                </div>}
              {
                this.isColorPicking() &&
                <div id="color-picker-wrapper">
                  <SketchPicker
                    disableAlpha
                    color={this.state.color}
                    onChange={(color) => this.setState({ color: color['hex'] })}
                    onChangeComplete={(color) => {
                      let key = this.state.selectedTool === APP_TOOLS.STROKE_COLOR_PICKER ? 'borderColor' : 'fill'
                      this.onShapeChanged({ [key]: color['hex'] })
                    }}
                  />
                </div>
              }
              {('opacity' in ssa) && <>
                <Typography gutterBottom> شفافیت </Typography>
                <Slider
                  value={ssa.opacity}
                  onChange={(e, nv) => { this.onShapeChanged({ opacity: nv }) }}
                  aria-labelledby="discrete-slider-small-steps"
                  step={0.01}
                  min={0.05}
                  max={1}
                  valueLabelDisplay="auto"
                />
              </>
              }
              {('hypes' in ssa) && <>
                {ssa.hypes.map((v, i) => <>
                  <TextField
                    type="number"
                    label={'x' + i}
                    value={ssa.hypes[i][0]}
                    onChange={e => {
                      let newval = parseInt(e.target.value)
                      let hypes = ssa.hypes
                      this.onShapeChanged({ hypes: replaceInArray(hypes, i, [newval, hypes[i][1]]) })
                    }}
                  />
                  <TextField
                    type="number"
                    label={'y' + i}
                    value={ssa.hypes[i][1]}
                    onChange={e => {
                      let newval = parseInt(e.target.value)
                      let hypes = ssa.hypes
                      this.onShapeChanged({ hypes: replaceInArray(hypes, i, [hypes[i][0], newval]) })
                    }}
                  />
                </>
                )}

                <button className="btn btn-danger mt-3" onClick={() => {
                  this.onShapeChanged({ addHype: null })
                }}>
                  add point
                </button>
              </>
              }
              <button className="btn btn-danger mt-3" onClick={() => this.setSelectedId(null)}>
                خروج
              </button>
            </TabPanel>
            <TabPanel value={this.state.selectedTab} index={TABS.INFO}>
              Item Two
            </TabPanel>
            <TabPanel value={this.state.selectedTab} index={TABS.META}>
              Item Three
            </TabPanel>
          </Paper>
        }
        {
          !this.isSomethingSelected() && this.state.selectedTool === APP_TOOLS.NOTHING &&
          <CustomSearchbar
            onAyaSelect={t => this.addText(t)} />
        }
        <div id="container" className="w-100 h-100"></div>
      </div >
    )
  }
}