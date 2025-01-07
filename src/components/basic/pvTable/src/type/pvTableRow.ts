import type {
  ColumnSlotBodyScope,
  RenderContext,
} from './pvTable'

export type TableRowContext = {
  scope: ColumnSlotBodyScope
  context: RenderContext
  disabled: boolean
}