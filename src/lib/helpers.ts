import { cloneDeep } from 'lodash'

import { Board, Item, List } from '../types/graphql'

class Helpers {
  getBoardId(id: string): number {
    return Number(id.slice(6))
  }

  getItemId(id: string): number {
    return Number(id.slice(5))
  }

  getListId(id: string): number {
    return Number(id.slice(5))
  }

  removeItemFromList(list: List, index: number): List {
    const next = cloneDeep(list)

    next.items?.splice(index, 1)

    return next
  }

  addItemToList(list: List, item: Item, index: number): List {
    const next = cloneDeep(list)

    next.items?.splice(index, 0, item)

    return next
  }

  reorderLists(lists: List[], fromIndex: number, toIndex: number): List[] {
    const next = cloneDeep(lists)

    const [list] = next.splice(fromIndex, 1)

    next.splice(toIndex, 0, list)

    return next
  }

  removeListFromBoard(board: Board, index: number): Board {
    const next = cloneDeep(board)

    next.lists?.splice(index, 1)

    return next
  }

  addListToBoard(board: Board, list: List, index: number): Board {
    const next = cloneDeep(board)

    next.lists?.splice(index, 0, list)

    return next
  }
}

export const helpers = new Helpers()
