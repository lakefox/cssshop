function cropImage(dataUrl, color, cb) {
  console.log("cropping");
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.width = img.width;
    ctx.height = img.height;
    ctx.drawImage(img,0,0,img.width,img.height);
    let rgb = hexToRgb(color);
    let colors = ctx.getImageData(0,0,img.width,img.height);
    for (var i = 0; i < colors.data.length; i+=4) {
      let r = colors.data[i];
      let g = colors.data[i+1];
      let b = colors.data[i+2];
      if (r == rgb.r && g == rgb.g && b == rgb.b) {
        colors.data[i] = 0;
        colors.data[i+1] = 0;
        colors.data[i+2] = 0;
        colors.data[i+3] = 0;
      }
    }
    ctx.putImageData(colors,0,0);
    autoCropCanvas(canvas,ctx);
    canvas.toBlob(cb,"image/png")
  };
  img.src = dataUrl;
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function autoCropCanvas(canvas, ctx) {
		var bounds = {
			left: 0,
			right: canvas.width,
			top: 0,
			bottom: canvas.height
		};
		var rows = [];
		var cols = [];
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var x = 0; x < canvas.width; x++) {
			cols[x] = cols[x] || false;
			for (var y = 0; y < canvas.height; y++) {
				rows[y] = rows[y] || false;
				const p = y * (canvas.width * 4) + x * 4;
				const [r, g, b, a] = [imageData.data[p], imageData.data[p + 1], imageData.data[p + 2], imageData.data[p + 3]];
				var isEmptyPixel = Math.max(r, g, b, a) === 0;
				if (!isEmptyPixel) {
					cols[x] = true;
					rows[y] = true;
				}
			}
		}
		for (var i = 0; i < rows.length; i++) {
			if (rows[i]) {
				bounds.top = i ? i - 1 : i;
				break;
			}
		}
		for (var i = rows.length; i--; ) {
			if (rows[i]) {
				bounds.bottom = i < canvas.height ? i + 1 : i;
				break;
			}
		}
		for (var i = 0; i < cols.length; i++) {
			if (cols[i]) {
				bounds.left = i ? i - 1 : i;
				break;
			}
		}
		for (var i = cols.length; i--; ) {
			if (cols[i]) {
				bounds.right = i < canvas.width ? i + 1 : i;
				break;
			}
		}
		var newWidth = bounds.right - bounds.left;
		var newHeight = bounds.bottom - bounds.top;
		var cut = ctx.getImageData(bounds.left, bounds.top, newWidth, newHeight);
		canvas.width = newWidth;
		canvas.height = newHeight;
		ctx.putImageData(cut, 0, 0);
	}
