// libs
import { group, rollup } from 'd3-array'
import { packEnclose } from 'd3-hierarchy'
import { min, max } from 'd3-array'

// src
import clustersData from '../../data/clusters.json'

export const getScaleFactor = (nodes, width, height) => {
  const minX = min(nodes, node => node.x)
  const maxX = max(nodes, node => node.x)
  const minY = min(nodes, node => node.y)
  const maxY = max(nodes, node => node.y)
  const dx =
    minX <= 0
      ? Math.abs(minX) + Math.abs(maxX)
      : Math.abs(maxX) - Math.abs(minX)
  const dy =
    minY <= 0
      ? Math.abs(minY) + Math.abs(maxY)
      : Math.abs(maxY) - Math.abs(minY)
  const scaleXY = max([dx, dy])
  const scaleScreen = min([width, height])
  return Math.ceil(scaleXY / scaleScreen)
}
export const createClusters = nodes => {
  return Array.from(
    group(nodes, d => d.data.cluster),
    ([cluster, children]) => ({ cluster, children }),
  ).map(({ cluster, children }) => {
    return { cluster, title: clustersData[cluster], ...packEnclose(children) }
  })
}

const centroid = nodes => {
  let x = 0
  let y = 0
  let z = 0
  for (const d of nodes) {
    let k = 5 ** 2
    x += d.x * k
    y += d.y * k
    z += k
  }
  return { x: x / z, y: y / z }
}

export const forceCluster = () => {
  const strength = 0.1
  let nodes
  function force(alpha) {
    const centroids = rollup(nodes, centroid, d => d.data.cluster)
    const l = alpha * strength
    for (const d of nodes) {
      const { x: cx, y: cy } = centroids.get(d.data.cluster)
      d.vx -= (d.x - cx) * l
      d.vy -= (d.y - cy) * l
    }
  }

  force.initialize = _ => (nodes = _)

  return force
}
