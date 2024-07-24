import React, { memo, useEffect, useRef } from "react"
import Flower from "../../asset/test.gif"

const imageDecoder = null;
let imageIndex = 0;

const getDimensions = (blob) => {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.addEventListener("load", (e) => {
      URL.revokeObjectURL(blob);
      return resolve({ width: img.naturalWidth, height: img.naturalHeight })
    });
    img.src = URL.createObjectURL(blob);
  })
}
const decodeImage = async (imageByteStream) => {
  imageDecoder.current = new ImageDecoder({
    data: imageByteStream,
    type: "image/gif",
  });
  const imageFrame = await imageDecoder.current.decode({
    frameIndex: imageIndex.current, // imageIndex从0开始
  });
  const track = imageDecoder.current.tracks.selectedTrack;
  await renderImage(imageFrame, track);
}
const renderImage = async (imageFrame, track) => {
  const offscreenCtx = offscreenCanvas.current.getContext("2d");
  offscreenCtx.drawImage(imageFrame.image, 0, 0);
  const temp = offscreenCtx.getImageData(
    0,
    0,
    offscreenCanvas.current.width,
    offscreenCanvas.current.height
  );
  const ctx = canvas.current.getContext("2d");
  ctx.putImageData(temp, 0, 0);
  setInit(true);
  if (track.frameCount === 1) {
    return;
  }
  if (imageIndex.current + 1 >= track.frameCount) {
    imageIndex.current = 0;
  }
  const nextImageFrame = await imageDecoder.current.decode({
    frameIndex: ++imageIndex.current,
  });
  window.setTimeout(() => {
    renderImage(nextImageFrame, track);
  }, (imageFrame.image.duration / 1000) * factor.current);
};


const MyGif = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const runGIF = async () => {
      const res = await fetch(Flower);
      const clone = res.clone();
      const blob = await res.blob();;
      const { width, height } = await getDimensions(blob);
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      offscreenCanvas.current = new OffscreenCanvas(width, height);

      decodeImage(clone.body)
    }
  })
  return (
    <>
      <div className="container">
        <div>原始gif</div>
        {init && <img src={Flower} />}
        <div>canvas渲染的gif</div>
        <canvas ref={canvasRef} />
      </div>
    </>
  )
}

export default memo(MyGif)