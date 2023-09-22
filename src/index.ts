import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import debugApp from 'debug'

const debug = debugApp('lightdb')

export class LightDB<T> {
  private cacheFilePath: string
  public data!: T

  constructor() {
    this.cacheFilePath = ''
  }

  private async createDirectoryAndFile(filePath: string, data: T[]) {
    const directoryPath = dirname(filePath)

    try {
      await mkdir(directoryPath, { recursive: true })
      await writeFile(filePath, JSON.stringify(data))
    }
    catch (error) {
      throw new Error(`Failed to create directory and file: ${(error as Error).message}`)
    }
  }

  public async init(filepath: string, initValue: T) {
    if (!filepath)
      throw new Error('Filepath must be provided')

    try {
      const fileStats = await stat(filepath)

      if (fileStats.isFile()) {
        const fileContent = await readFile(filepath, 'utf-8') as T
        try {
          const content = JSON.parse(fileContent as string)
          this.data = content || initValue
        }
        catch (error) {
          debug(`parse file content failed, because: ${(error as Error).message}`)
          this.data = fileContent || initValue
        }
      }
      else {
        throw new Error(`${filepath} is not a file`)
      }
    }
    catch (error) {
      await this.createDirectoryAndFile(filepath, [])
      this.data = initValue
    }

    this.cacheFilePath = filepath
  }

  public async write() {
    if (!this.cacheFilePath)
      throw new Error('Must initialize first')

    try {
      await writeFile(this.cacheFilePath, JSON.stringify(this.data))
    }
    catch (error) {
      throw new Error(`Failed to write data to file: ${(error as Error).message}`)
    }
  }
}
