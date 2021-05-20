import React from "react";
import { Rect, Group, Text } from "react-konva";
import Rectangle from "./Reactangle";

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    stroke: "red",
    strokeWidth: 6
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    stroke: "green",
    strokeWidth: 4
  }
];

const Rects = ({ selectedId, selectShape }) => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);

  const addRect = () => {
    const rect = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width: Math.random() * 40,
      height: Math.random() * 60,
      rotation: Math.random() * 180,
      strokeWidth: Math.ceil(Math.random() * 10),
      stroke: "blue",
      draggable: true
    };
    setRectangles([...rectangles, rect]);
  };

  return (
    <Group id="rects">
      <Text text="Try click on rect" />
      <Rect
        id="clicker"
        onClick={addRect}
        fill="black"
        x={5}
        y={20}
        width={80}
        height={60}
        cornerRadius={6}
      />
      {rectangles.map((rect, i) => {
        rect.id = i;
        return (
          <Rectangle
            id={i}
            key={i}
            shapeProps={rect}
            isSelected={rect.id === selectedId}
            onSelect={() => {
              selectShape(rect.id);
            }}
            onChange={(newAttrs) => {
              const rects = rectangles.slice();
              rects[i] = newAttrs;
              setRectangles(rects);
            }}
          />
        );
      })}
    </Group>
  );
};

export default Rects;
