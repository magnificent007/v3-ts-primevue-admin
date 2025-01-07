declare type Recordable<T = any> = Record<string, T>
declare type Objectable<T = object> = {
  [K in keyof T]: T[K]
} & Recordable