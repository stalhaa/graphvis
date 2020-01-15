// @flow
// libs
import React from 'react'

// src
import styles from './styles.module.css'
import Draggable from 'react-draggable'
import useZoom from './useZoom'

export default function ForceDirectedGraphInner(props) {
  const { links, nodes, clusters, onMouseMove, onMouseLeave, scale } = props
  const zoom = useZoom()

  return (
    <svg
      viewBox={`0 0 ${window.innerWidth * scale} ${window.innerHeight * scale}`}
    >
      <Draggable>
        <g className={styles.root}>
          <rect
            width={window.innerWidth * scale}
            height={window.innerHeight * scale}
            fill="transparent"
          />
          <g transform={`scale(${zoom})`}>
            {links.map(({ source, target }, index) => (
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                key={`line-${index}`}
                stroke="#888"
              />
            ))}
            {clusters.map(({ x, y, r, title, cluster }, index) => (
              <circle
                key={cluster}
                className={styles.cluster}
                data-tip={title || 'N/A'}
                r={r < 20 ? 20 : r}
                cx={x}
                cy={y}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
              />
            ))}
            {nodes.map((node, index) => (
              <circle
                key={index}
                className={styles.node}
                data-tip={node.data.title}
                r={node.r - 7}
                cx={node.x}
                cy={node.y}
                fill={node.data.color}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
              />
            ))}
          </g>
        </g>
      </Draggable>
    </svg>
  )
}
