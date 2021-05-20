import React from "react"
import { Tooltip, Button } from "@material-ui/core"

export function ToolBarBtn({ title, onClick, disabled, iconEl }) {
  return (
    <Tooltip title={title} className="my-2" placement="right">
      <Button onClick={onClick} disabled={disabled}>
        {iconEl}
      </Button>
    </Tooltip >
  )
}