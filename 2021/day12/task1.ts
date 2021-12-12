import { input } from './input2'

interface Path {
  from: string
  to: string
}

interface GraphNode {
  exits: string[]
  isBigCave: boolean
  isEnd: boolean
  name: string
  visited?: boolean
}

interface Graph {
  nodes: {
    [key: string]: GraphNode
  }
  root: string
}

const newNode = (name: string): GraphNode => ({
  name,
  exits: [],
  isEnd: name === 'end',
  isBigCave: /^[A-Z]+$/.test(name),
})

const addPathToGraph = (graph: Graph, path: Path): Graph => {
  const fromNodeExists = graph.nodes[path.from] !== undefined
  const toNodeExists = graph.nodes[path.to] !== undefined

  const fromNode = graph.nodes[path.from] || newNode(path.from)
  const toNode = graph.nodes[path.to] || newNode(path.to)

  const newNodes = [
    ...Object.values(graph.nodes),
    ...(fromNodeExists ? [] : [fromNode]),
    ...(toNodeExists ? [] : [toNode]),
  ]
    .map(
      (node): GraphNode =>
        node.name === path.from
          ? { ...node, exits: [...node.exits, toNode.name] }
          : node.name === path.to
          ? { ...node, exits: [...node.exits, fromNode.name] }
          : node,
    )
    .reduce(
      (acc, node) => ({
        ...acc,
        [node.name]: node,
      }),
      {},
    )

  return {
    ...graph,
    nodes: newNodes,
  }
}

const newGraph = (): Graph => {
  const start = newNode('start')
  const end = newNode('end')
  return {
    nodes: {
      start,
      end,
    },
    root: start.name,
  }
}

const findPaths = (graph: Graph): string[] => {
  type ToVisit = [string, string[][]]

  const toVisit = [[graph.root, [] as string[][]]] as ToVisit[]
  const nodes = { ...graph.nodes }

  let paths: string[][] = []

  while (toVisit.length) {
    let [currentName, currentPaths] = toVisit.pop()!
    const current = nodes[currentName]

    if (!currentPaths.length) {
      currentPaths = [[currentName]]
    } else {
      currentPaths = currentPaths.map((path) => [currentName, ...path])
    }

    if (current.isEnd) {
      paths.push(...currentPaths)
      continue
    }

    const toVisitNext = current.exits
      .filter(
        (exit) =>
          nodes[exit].isBigCave ||
          currentPaths.every((path) =>
            path.every((pathPart) => pathPart !== exit),
          ),
      )
      .map((exit) => [exit, currentPaths] as ToVisit)

    toVisit.push(...toVisitNext)
  }

  return paths.map((path) => path.reverse().join(','))
}

const solution = function (inputValue: string) {
  const paths = inputValue
    .trim()
    .split('\n')
    .map((line) => line.split('-'))
    .map(([from, to]) => ({
      from,
      to,
    }))
  const graph = paths.reduce(addPathToGraph, newGraph())
  return findPaths(graph)
}

console.log(solution(input).length)
