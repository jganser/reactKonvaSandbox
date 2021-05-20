import React from "react";
import { Stage, Layer, Rect } from "react-konva";
import MyImage from "./MyImage";
import Rects from "./Rects";

const VerticalScrollbar = ({ state, setState, padding }) => {
  const width = 10;
  const height = 100;
  const [pos, setPos] = React.useState({
    x: window.innerWidth - stageMargin - padding - 10,
    y: padding
  });

  const dragBounds = (p) => {
    p.x = state.width - padding - 10;
    p.y = Math.max(
      Math.min(p.y, window.innerHeight - height - padding),
      padding
    );
    return p;
  };

  return (
    <Rect
      width={width}
      height={height}
      fill={"grey"}
      opacity={0.8}
      x={pos.x}
      y={pos.y}
      draggable
      onDragMove={(e) => {
        const newPos = dragBounds(e.target.position());
        // reset position to its old state
        // so drag is fully controlled by react
        e.target.position({ x: pos.x, y: pos.y });
        // your set state
        setPos({
          ...pos,
          y: newPos.y
        });
        setState({
          ...state,
          y: -(e.target.y() - padding)
        });
      }}
    />
  );
};

const stageMargin = 50;

const App = () => {
  const [state, setState] = React.useState({
    scale: 1,
    x: 0,
    y: 0,
    width: window.innerWidth - stageMargin,
    height: window.innerHeight - stageMargin
  });
  const layerRef = React.useRef();
  const verticalScrollRef = React.useRef();
  const [selectedId, selectShape] = React.useState(null);
  const [scrollLimit, setScrollLimit] = React.useState({
    maxX: 0,
    minX: 0,
    maxY: 0,
    minY: 0
  });

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    //console.log(e.target);
    const clickedOnEmpty =
      e.target === e.target.getStage() ||
      (e.target.attrs && e.target.attrs.notSelectable);
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.04;
    if (!layerRef) return;
    const layer = layerRef.current;
    const stage = e.target.getStage();
    const oldScale = layer.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - layer.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - layer.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const newStage = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    };
    setState({
      ...state,
      scale: newScale,
      x: Math.max(Math.min(newStage.x, scrollLimit.maxX), scrollLimit.minX),
      y: Math.max(Math.min(newStage.y, scrollLimit.maxY), scrollLimit.minY)
    });
  };
  const dragBounds = (pos) => {
    pos.x = Math.max(Math.min(pos.x, scrollLimit.maxX), scrollLimit.minX);
    pos.y = Math.max(Math.min(pos.y, scrollLimit.maxY), scrollLimit.minY);
    return pos;
  };

  const isScrollable = () => {
    return (
      scrollLimit.maxX !== scrollLimit.minX ||
      scrollLimit.maxY !== scrollLimit.minY
    );
  };

  return (
    <Stage
      width={window.innerWidth - stageMargin}
      height={window.innerHeight - stageMargin}
    >
      <Layer
        id="ImageLayer"
        ref={layerRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        draggable
        dragBoundFunc={dragBounds}
        onWheel={handleWheel}
        x={state.x}
        y={state.y}
        width={state.width}
        height={state.height}
        scaleX={state.scale}
        scaleY={state.scale}
      >
        <MyImage
          layerRef={layerRef}
          scrollLimit={scrollLimit}
          setScrollLimit={setScrollLimit}
          scale={{ x: 4, y: 4 }}
        />
        <Rects selectedId={selectedId} selectShape={selectShape} />
      </Layer>
      <Layer id="ScrollbarLayer">
        {isScrollable() && (
          <VerticalScrollbar
            state={state}
            setState={setState}
            padding={40}
            ref={verticalScrollRef}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default App;
