function trimCanvas(canvas) {
  var ctx = canvas.getContext("2d");
  var w = canvas.width,
  h = canvas.height,
  imageData = ctx.getImageData(0,0,w,h);
  console.log(imageData);

  let ig = JSON.stringify(imageData.data).replace("0,0,0,0","");
  console.log(ig);

  // for (var i = 0; i < imageData.data.length; i+=4) {
  //   console.log(i,i+1,i+2,i+3);
  // }

  canvas.width = w;
  canvas.height = h;
  // ctx.putImageData(cut, 0, 0);
  return canvas
}
