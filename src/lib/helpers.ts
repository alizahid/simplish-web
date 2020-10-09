import { cloneDeep } from 'lodash'

import { Item, List } from '../types/graphql'

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

  reorderItems(items: Item[], fromIndex: number, toIndex: number): Item[] {
    const next = cloneDeep(items)

    const [item] = next.splice(fromIndex, 1)

    next.splice(toIndex, 0, item)

    return next
  }

  removeItem(items: Item[], index: number): Item[] {
    const next = cloneDeep(items)

    next.splice(index, 1)

    return next
  }

  addItem(items: Item[], item: Item, index: number): Item[] {
    const next = cloneDeep(items)

    next.splice(index, 0, item)

    return next
  }

  reorderLists(lists: List[], fromIndex: number, toIndex: number): List[] {
    const next = cloneDeep(lists)

    const [list] = next.splice(fromIndex, 1)

    next.splice(toIndex, 0, list)

    return next
  }
}

export const helpers = new Helpers()
