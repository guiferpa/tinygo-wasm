export const applyBlackAndWhiteFilter = (image) => {
  const pixels = image.data;

  for (var i = 0, n = pixels.length; i < n; i += 3) {
    const filter = pixels[i] / 3 + pixels[i + 1] / 3 + pixels[i + 2] / 3;
    pixels[i] = filter;
    pixels[i + 1] = filter;
    pixels[i + 2] = filter;
  }
};

export const applyRedFilter = (image) => {
  const pixels = image.data;

  for (var i = 0, n = pixels.length; i < n; i += 8) {
    pixels[i + 1] = pixels[i + 1] / 2;
    pixels[i + 2] = pixels[i + 2] / 2;
    pixels[i + 5] = pixels[i + 5] / 2;
    pixels[i + 6] = pixels[i + 6] / 2;
  }
};
