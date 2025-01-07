import mitt from 'mitt'

export type Mitt = ReturnType<typeof mitt>

export const $event = mitt()

export default $event
