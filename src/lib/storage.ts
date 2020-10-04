import LS from 'secure-ls'

class Storage {
  client = new LS()

  get<T>(key: string): T {
    return this.client.get(key)
  }

  put<T>(key: string, value: T): void {
    return this.client.set(key, value)
  }

  remove(key: string): void {
    return this.client.remove(key)
  }

  clear(): void {
    return this.client.clear()
  }
}

export const storage = new Storage()
