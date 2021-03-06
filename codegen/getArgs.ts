import * as yargs from 'yargs'

interface Args {
  outDir: string
  day: number
  year: number
}

export const getArgs = () => {
  const yargsConfig = yargs
    .option('outDir', {
      alias: 'o',
      description: 'Output directory',
      type: 'string',
    })
    .option('day', {
      alias: 'd',
      description: 'Puzzle day',
      type: 'number',
    })
    .option('year', {
      alias: 'y',
      description: 'Puzzle year',
      type: 'number',
    })
    .help()
    .alias('help', 'h')

  const currentDate = new Date()
  const DEFAULT_ARGS: Args = {
    day: currentDate.getDate(),
    year: currentDate.getFullYear(),
    outDir: '.',
  }

  return {
    ...DEFAULT_ARGS,
    ...yargsConfig.argv,
  } as Args
}
