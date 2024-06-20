export async function getCamera() {
  const video = document.createElement("video");
  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
  await video.play();

  return video;
}

export async function drawVideo() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const video = await getCamera();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  function drawFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
  return canvas;
}
