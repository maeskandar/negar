import React from "react"
import { Button } from "@material-ui/core"

export function ColorPreview({ hexColor, onClick, disabled }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className="color-preview"
        style={{ backgroundColor: hexColor }}
      ></div>
    </Button>
  )
}