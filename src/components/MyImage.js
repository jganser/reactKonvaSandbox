import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const MyImage = ({ layerRef, scrollLimit, setScrollLimit, scale }) => {
  const [image] = useImage("https://konvajs.org/assets/yoda.jpg");
  //setScrollLimit(); //TODO
  const imageRef = React.useRef();

  React.useEffect(() => {
    if (!layerRef) {
      console.log("no layerRef given, calculating limits is impossible");
      return;
    }
    if (!imageRef.current.attrs.image) return;
    const lwi =
      imageRef.current.attrs.image.naturalWidth *
      scale.x *
      layerRef.current.scaleX();
    const layerWidth = layerRef.current.width();
    const lhi =
      imageRef.current.attrs.image.naturalHeight *
      scale.y *
      layerRef.current.scaleY();
    const layerHeight = layerRef.current.height();
    if (lwi > layerWidth && scrollLimit.minX !== Math.ceil(layerWidth - lwi)) {
      setScrollLimit({
        ...scrollLimit,
        minX: Math.ceil(layerWidth - lwi)
      });
    }
    if (lwi <= layerWidth && scrollLimit.minX !== 0) {
      setScrollLimit({
        ...scrollLimit,
        minX: 0
      });
    }
    if (
      lhi > layerHeight &&
      scrollLimit.minY !== Math.ceil(layerHeight - lhi)
    ) {
      setScrollLimit({
        ...scrollLimit,
        minY: Math.ceil(layerHeight - lhi)
      });
    }
    if (lhi <= layerHeight && scrollLimit.minY !== 0) {
      setScrollLimit({
        ...scrollLimit,
        minY: 0
      });
    }
  }, [setScrollLimit, scale, scrollLimit]);

  return <Image image={image} scale={scale} notSelectable ref={imageRef} />;
};

export default MyImage;
