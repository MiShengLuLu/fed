export interface Todo {
  id: number,
  text: string,
  done: boolean
}

export interface Event {
  target: {
    value: string;
    checked: boolean
  }
}
