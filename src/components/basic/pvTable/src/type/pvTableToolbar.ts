import type { VNode } from 'vue'
import type { RenderContext } from '../type/pvTable'

export interface PvTableToolbarSlots {
  start({ disabled, context }: { disabled: boolean; context: RenderContext }): VNode
  center({ disabled, context }: { disabled: boolean; context: RenderContext }): VNode
  end({ disabled, context }: { disabled: boolean; context: RenderContext }): VNode
}
