export const applyBlackAndWhiteFilter = ({ $element, context }) => {
  const image = context.getImageData(0, 0, $element.width, $element.height);

  const pixels = image.data;
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    const filter = pixels[i] / 3 + pixels[i + 1] / 3 + pixels[i + 2] / 3;
    pixels[i] = filter;
    pixels[i + 1] = filter;
    pixels[i + 2] = filter;
  }

  context.putImageData(image, 0, 0);

  return $element.toDataURL("image/jpeg");
};
