import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { LightDB } from '../src'

interface Data {
  id: number
  name: string
  age: number
}

const lightDB = new LightDB<Data[]>()
const tempFoldPath = './.cache/array.json'

describe('array', () => {
  beforeAll(async () => {
    await lightDB.init(tempFoldPath, [])
  })

  afterEach(async () => {
    lightDB.data.length = 0
    await lightDB.write()
  })

  it('get data', () => {
    expect(Array.isArray(lightDB.data)).toBeTruthy()
  })

  it('set Array data', async () => {
    const mockData = {
      id: 1,
      name: 'hello',
      age: 24,
    }

    lightDB.data.push(mockData)
    await lightDB.write()

    expect(lightDB.data[0]).toEqual(mockData)
  })
})
