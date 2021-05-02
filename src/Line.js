import Konva from "konva"

export const addLine = (stage, layer, mode = "brush") => {
  let
    isPaint = false,
    lastLine

  stage.on("mousedown touchstart", (e) => {
    isPaint = true
    let pos = stage.getPointerPosition()

    lastLine = new Konva.Line({
      stroke: mode === "brush" ? "red" : "white",
      strokeWidth: mode === "brush" ? 5 : 20,
      globalCompositeOperation:
        mode === "brush" ? "source-over" : "destination-out",
      points: [pos.x, pos.y],
      draggable: mode === "brush",
    })

    layer.add(lastLine)
  })

  stage.on("mouseup touchend", () => {
    isPaint = false
  })

  stage.on("mousemove touchmove", () => {
    if (!isPaint)
      return

    const
      pos = stage.getPointerPosition(),
      newPoints = lastLine.points().concat([pos.x, pos.y])

    lastLine.points(newPoints)
    layer.batchDraw()
  })
}