import { input } from './input2'
import { sum } from '../../utils'

interface Path {
  from: string
  to: string
}

interface GraphNode {
  exits: string[]
  name: string
}

interface Graph {
  nodes: {
    [key: string]: GraphNode
  }
  root: string
}

function isBigCave(name: string) {
  return /^[A-Z]+$/.test(name)
}

const isEnd = (name: string) => name === 'end'

const newNode = (name: string): GraphNode => ({
  name,
  exits: [],
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

const canVisitOnce = (exit: GraphNode) =>
  !isBigCave(exit.name) && ['start', 'end'].includes(exit.name)
const canVisitTwice = (exit: GraphNode) =>
  !isBigCave(exit.name) && !['start', 'end'].includes(exit.name)
const visitCount = (name: string) => (path: string[]) =>
  path.map((pathPart) => (pathPart === name ? 1 : 0)).reduce(sum, 0)

function canVisitExit(
  nodes: { [p: string]: GraphNode },
  exit: string,
  currentPath: string[],
) {
  const exitNode = nodes[exit]
  return (
    isBigCave(exitNode.name) ||
    (canVisitOnce(exitNode) && visitCount(exitNode.name)(currentPath) === 0) ||
    (canVisitTwice(exitNode) &&
      (visitCount(exitNode.name)(currentPath) === 0 ||
        (visitCount(exitNode.name)(currentPath) === 1 &&
          currentPath.every(
            (pathPart) =>
              isBigCave(pathPart) || visitCount(pathPart)(currentPath) <= 1,
          ))))
  )
}

const findPaths = (graph: Graph): string[] => {
  type ToVisit = [string, string[]]

  const toVisit = [[graph.root, [] as string[]]] as ToVisit[]
  const nodes = { ...graph.nodes }

  let paths: string[][] = []

  while (toVisit.length) {
    let [currentName, previousPath] = toVisit.pop()!
    const current = nodes[currentName]
    const currentPath = [currentName, ...previousPath]

    if (isEnd(current.name)) {
      paths.push(currentPath)
      continue
    }

    const toVisitNext = current.exits
      .filter((exit) => canVisitExit(nodes, exit, currentPath))
      .map((exit) => [exit, currentPath] as ToVisit)
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
