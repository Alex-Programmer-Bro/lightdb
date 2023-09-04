import { beforeAll, expect, test } from 'vitest'
import { LightDB } from '../src'

const lightDB = new LightDB()
const tempFoldPath = './.cache/code-snippets.json'

beforeAll(async () => {
  await lightDB.init(tempFoldPath)
})

test('get data', () => {
  const snippets = lightDB.read()
  expect(Array.isArray(snippets)).toBeTruthy()
})

test('set Array data', async () => {
  await lightDB.write([])
  const snippets = lightDB.read()
  expect(snippets).toEqual([])

  const data = [
    {
      id: 1,
      name: 'hello',
      age: 24,
    },
  ]
  await lightDB.write(data)
  expect(lightDB.read()).toEqual(data)

  await lightDB.write([])
})
