import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export class LightDB<T> {
  private data: T[] = []

  private cacheFilePath!: string

  public async init(filepath: string) {
    async function createDirectoryAndFile(filePath: string, data: T[]) {
      const directoryPath = dirname(filePath)

      try {
        await mkdir(directoryPath, { recursive: true })
        await writeFile(filePath, JSON.stringify(data))
      }
      catch (error) {
        throw new Error((error as Error).message)
      }
    }

    this.cacheFilePath = filepath

    try {
      const { isFile } = await stat(this.cacheFilePath)

      if (isFile()) {
        try {
          const content = JSON.parse(await readFile(this.cacheFilePath, 'utf-8'))
          if (Array.isArray(content))
            this.data = content
          else
            throw new Error('must be array data')
        }
        catch (error) {
          throw new Error((error as Error).message)
        }
      }
      else {
        throw new Error(`${this.cacheFilePath} is not a file type`)
      }
    }
    catch (error) {
      await createDirectoryAndFile(this.cacheFilePath, [])
    }
  }

  public read() {
    if (!this.cacheFilePath)
      throw new Error('Must init first please')

    return this.data
  }

  public async write(data: T[]) {
    if (!this.cacheFilePath)
      throw new Error('Must init first please')

    try {
      await writeFile(this.cacheFilePath, JSON.stringify(data))
      this.data = data
    }
    catch (error) {
      throw new Error((error as Error).message)
    }
  }
}
