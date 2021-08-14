import React from "react"

// utilities
import { cleanArray, arraysEqual, replaceInArray, removeInArray } from "../utils/array"
import { removeInSet, addToSet, setHasParamsOr } from "../utils/set"
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
  LibraryAdd as AddStageIcon,
  Search as ZoomIcon,
  PanTool as HandIcon,
} from '@material-ui/icons'
import { SketchPicker } from "react-color"
import { ColorPreview, CustomSearchbar, MyVerticallyCenteredModal, ToolBarBtn } from "../UI/"
import './home.css'

// canvas import 
import { shapeKinds, isKindOfLine } from "../canvas"
import {
  newArrow, newCircle, newImage, newRectangle,
  newStraghtLine, newCustomLine, newSimpleLine, newTextNode,
  newFlag, newMountain,
} from "../canvas/shapes"
import { newStage } from "../canvas/stage"
import {
  initCanvas, addShapes, updateShape, removeShape,
  addTempShape, resetTempPage,
  board, shapes, tempShapes,
  setBackgroundColor, activateTransformer, disableTransformer, drawingLayer, disableDrawingLayer, prepareDrawingLayer, triggerShapeEvent,
  renderCanvas,
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
    zoom: 0,

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
    this.addEmptyStage = this.addEmptyStage.bind(this)
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

    this.onCanvasClick = this.onCanvasClick.bind(this)
    this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this)
    this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this)
    this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this)

    this.deleteShape = this.deleteShape.bind(this)
    this.includeToAppStates = this.includeToAppStates.bind(this)
    this.excludeFromAppState = this.excludeFromAppState.bind(this)
    this.keyboardEvents = this.keyboardEvents.bind(this)

    this.addShape = this.addShape.bind(this)
    this.getFatherShapeId = this.getFatherShapeId.bind(this)
    this.getScaleFactor = this.getScaleFactor.bind(this)
    this.setZoom = this.setZoom.bind(this)
    this.toggleHandTool = this.toggleHandTool.bind(this)
    this.getCursorStyle = this.getCursorStyle.bind(this)
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
    if (!this.state.appState.has(val))
      this.setState({ appState: addToSet(this.state.appState, val) })
  }
  excludeFromAppState(val) {
    if (this.state.appState.has(val))
      this.setState({ appState: removeInSet(this.state.appState, val) })
  }
  isSomethingSelected() {
    return this.state.selectedShapeInfo.id !== null
  }

  // related to the canvas
  addShape(newShape, nodes, trigger = true) {
    addShapes(newShape, nodes, this.getFatherShapeId(), trigger)
  }
  startDrawingShape(fn) {
    this.setState({
      appState: addToSet(this.state.appState, APP_STATES.DRAWING),
      selectedTool: APP_TOOLS.SHAPE_DRAWING,
    })
    drawingTempFunction = fn
    this.setSelectedId(null)
    prepareDrawingLayer()
  }
  addEmptyStage() {
    this.startDrawingShape(newStage)
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
    this.addShape(newImage(e))
  }
  addText(text = 'تایپ کن') {
    this.addShape(newTextNode({ text }))
  }

  getFatherShapeId() {
    let r = this.state.route
    return (r.length === 0) ? 'root' : r[r.length - 1]
  }
  enterStage(shapeId) {
    disableTransformer()
    renderCanvas(this.state.route, shapeId, +1)

    this.setState({
      route: this.state.route.concat(shapeId),
      showStateModal: false
    })
  }
  backStage() {
    let r = this.state.route
    if (r.length === 0) return
    renderCanvas(r, undefined, -1)
    this.setState({ route: removeInArray(r, r.length - 1) })
  }

  onCanvasClick(ev) {
    if (this.state.selectedTool === APP_TOOLS.HAND) return
    console.log(shapes)

    if (ev.target.attrs["isMain"] === false) { // select parent node for advanced shapes like flag
      this.setSelectedId(ev.target.parent.props.id)
    }
    /// FIXME consider route
    else if ('props' in ev.target && 'id' in ev.target.props) { // if a shape selected
      this.setSelectedId(ev.target.props.id)
    }
    else if (!this.isInJamBoardMode() && this.state.selectedTool === APP_TOOLS.NOTHING) {
      this.setSelectedId(null)
      this.cancelOperation()
    }
  }
  onCanvasMouseDown(e) {
    if (!this.state.appState.has(APP_STATES.DRAGING))
      this.includeToAppStates(APP_STATES.DRAGING)

    const pos = e.target.getStage().getPointerPosition()
    drawingTempData = [pos.x, pos.y]

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
  onCanvasMouseMove(e) {
    if (!this.state.appState.has(APP_STATES.DRAGING)) return

    var mp = board.getPointerPosition()

    if (this.state.appState.has(APP_STATES.DRAWING)) {
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
    else if (this.state.selectedTool === APP_TOOLS.HAND) {
      shapes['root'].move({
        x: mp.x - drawingTempData[0],
        y: mp.y - drawingTempData[1],
      })
      drawingTempData = [mp.x, mp.y]
    }
  }
  onCanvasMouseUp(e) {
    let st = this.state.selectedTool
    if (st === APP_TOOLS.LINE) {
      let
        pos = e.target.getStage().getPointerPosition(),
        dx = Math.abs(pos.x - drawingTempData[0]),
        dy = Math.abs(pos.y - drawingTempData[1])

      if (dx + dy < 32) return
      this.addShape(newStraghtLine(drawingTempData.concat([pos.x, pos.y])))
    }
    else if (st === APP_TOOLS.SHAPE_DRAWING) {
      this.doneOperation()
    }

    this.excludeFromAppState(APP_STATES.DRAGING)
  }

  setZoom(z) {
    this.setState({ zoom: z })
    let sf = this.getScaleFactor()
    shapes['root'].scale({ x: sf, y: sf })
  }
  getCursorStyle() {
    if (this.state.selectedTool === APP_TOOLS.HAND)
      if (this.state.appState.has(APP_STATES.DRAGING))
        return 'grabbing'
      else
        return 'grab'

    if (this.state.appState.has(APP_STATES.DRAWING))
      return 'crosshair'

    return 'auto'
  }
  getScaleFactor() {
    return (100 + this.state.zoom) / 100
  }

  toggleHandTool() {
    this.setState({
      selectedTool:
        this.state.selectedTool === APP_TOOLS.HAND ?
          APP_TOOLS.NOTHING :
          APP_TOOLS.HAND
    })
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
        showStateModal: shape.props.kind === shapeKinds.Stage
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
          this.addShape(line)
      }
      else if (this.state.selectedTool === APP_TOOLS.SHAPE_DRAWING) {
        let
          reversedScaleFactor = (1 / this.getScaleFactor()),
          p = drawingTempShape.props

        updateShape(drawingTempShape, {
          width: p.width * reversedScaleFactor,
          height: p.height * reversedScaleFactor,
          x: p.x * reversedScaleFactor,
          y: p.y * reversedScaleFactor
        })

        triggerShapeEvent(drawingTempShape, 'drawEnd')
        this.addShape(drawingTempShape, drawingTempShape.nodes, this.getFatherShapeId())
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
      onClick: this.onCanvasClick,
      onMouseDown: this.onCanvasMouseDown,
      onMouseMove: this.onCanvasMouseMove,
      onMouseUp: this.onCanvasMouseUp
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
          <IconButton size="small"> <BackIcon /> </IconButton>
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
                  title="stage"
                  onClick={this.addEmptyStage}
                  iconEl={<AddStageIcon />}
                />
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
                  onClick={() => this.addCircle()}
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

        <div id="app-bar-wrapper">
          <Paper id="app-bar" elevation={3}>
            <div className="row m-auto">
              <Slider
                className="col-8"
                value={this.state.zoom}
                onChange={(_, nv) => this.setZoom(nv)}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                min={-90}
                max={+100}
                valueLabelDisplay="auto"
              />
              <div className="col-2">
                <ZoomIcon />
              </div>

              <div className={"col-2 " + (this.state.selectedTool === APP_TOOLS.HAND ? "active" : "")}
                onClick={this.toggleHandTool}>
                <HandIcon />
              </div>
            </div>
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
                  value={ssa.width}
                  onChange={e => {
                    this.onShapeChanged({ width: parseInt(e.target.value) })
                  }}
                />
              }
              {'height' in ssa &&
                <TextField
                  type="number"
                  label="ارتفاع"
                  value={ssa.height}
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
              {'borderSize' in ssa && <>
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
              </>}
              {'borderColor' in ssa && <div>
                <span>  رنگ خط </span>
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
              </div>}
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
        <div id="container" style={{
          'cursor': this.getCursorStyle()
        }} className="w-100 h-100"></div>
      </div >
    )
  }
}