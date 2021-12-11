import * as colors from 'colors'
import { config } from 'dotenv'
// @ts-ignore
import generate from '@babel/generator'
import axios from 'axios'
import { promises } from 'fs'
import { getArgs } from './getArgs'
import { join } from 'path'
import { createInputFileAst, createSolutionFileAst } from './fileCreators'

config()

if (!process.env.SESSION) {
  console.warn(
    colors.yellow(`
------
Please provide your session cookie via SESSION env variable
You can either add .env file and add your variable there
Or call this command with \`SESSION=<YOUR SESSION COOKIE>\` prefix
------
`),
  )
  process.exit(1)
}

const { day, year, outDir } = getArgs()

const saveDir = join(process.cwd(), outDir)

axios({
  url: `https://adventofcode.com/${year}/day/${day}/input`,
  headers: {
    Cookie: `session=${process.env.SESSION}`,
  },
}).then((response) => {
  const inputFile1Ast = createInputFileAst('')
  const inputFile2Ast = createInputFileAst(response.data)
  const solutionFileAst = createSolutionFileAst()

  const filesDir = join(saveDir, year.toString(), `day${day}`)
  promises
    .mkdir(filesDir, { recursive: true })
    .then(() =>
      Promise.all([
        promises.writeFile(
          join(filesDir, 'input1.ts'),
          generate(inputFile1Ast).code,
        ),
        promises.writeFile(
          join(filesDir, 'input2.ts'),
          generate(inputFile2Ast).code,
        ),
        promises.writeFile(
          join(filesDir, 'task1.ts'),
          generate(solutionFileAst).code,
        ),
        promises.writeFile(
          join(filesDir, 'task2.ts'),
          generate(solutionFileAst).code,
        ),
      ]),
    )
    .then(() => {
      console.log('success: ')
    })
})
