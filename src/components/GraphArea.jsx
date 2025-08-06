import React, { useEffect, useRef } from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import '@antv/graphin/dist/index.css';

const { ZoomCanvas, DragCanvas, DragNode, ActivateRelations } = Behaviors;

export default function GraphArea({
  nodes,
  edges,
  onNodeClick,
  onCanvasClick,
}) {
  // 1) Grab a ref to the Graphin component
  const graphinRef = useRef(null);

  // 2) Attach G6 event listeners once, on mount
  useEffect(() => {
    const graph = graphinRef.current?.graph;
    if (!graph) {
      console.warn('GraphArea: graph not ready yet');
      return;
    }

    graph.on('node:click', onNodeClick);
    graph.on('canvas:click', onCanvasClick);

    return () => {
      graph.off('node:click', onNodeClick);
      graph.off('canvas:click', onCanvasClick);
    };
  }, [onNodeClick, onCanvasClick]);

  // 3) Render! No key‐bumping, no remounts.
  return (
    <Graphin
      ref={graphinRef}
      data={{ nodes, edges }}
      layout={{ type: 'force', animate: true }}
      fitView
    >
      <ZoomCanvas />
      <DragCanvas />
      <DragNode />
      <ActivateRelations />
    </Graphin>
  );
}
