// libs
import React from 'react'
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
} from 'd3-force'

// src
import { createClusters, forceCluster, getScaleFactor } from './utils'
import ForceDirectedGraphInner from './ForceDirectedGraphInner'

class ForceDirectedGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nodes: props.nodes,
      links: props.links,
      clusters: [],
      scale: 1,
    }
  }

  componentDidMount() {
    const { width, height } = this.props
    const { links, nodes } = this.state

    this.force = forceSimulation(nodes)
      .force(
        'link',
        forceLink(links)
          .id(({ data }) => data.id)
          .strength(0.002),
      )
      .force('charge', forceManyBody())
      .force('cluster', forceCluster())
      .tick(30)
    const scale = getScaleFactor(nodes, window.innerWidth, window.innerHeight)

    this.force.force(
      'center',
      forceCenter(width * (scale / 2), height * (scale / 2)),
    )

    this.force.on('tick', () => {
      this.setState(() => ({
        clusters: createClusters(nodes),
        scale,
      }))
    })
  }

  componentWillUnmount() {
    this.force.stop()
  }

  render() {
    const { links, nodes, clusters, scale } = this.state
    const { onMouseMove, onMouseLeave } = this.props

    return (
      <ForceDirectedGraphInner
        links={links}
        nodes={nodes}
        clusters={clusters}
        scale={scale}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    )
  }
}

export default ForceDirectedGraph
