import * as js from "./main.js";

const go = new Go();

function loadImageIntoCanvas(image) {
  const $element = document.createElement("canvas");
  const context = $element.getContext("2d");

  $element.width = image.naturalWidth || image.width;
  $element.height = image.naturalHeight || image.height;

  context.drawImage(image, 0, 0);

  return { $element, context };
}

/**
 * @param {WebAssembly.Instance} inst
 */
async function run(inst) {
  const $root = document.getElementById("root");

  // Bootstrap built Go's environment
  go.run(inst);

  const { malloc, ...wasm } = inst.exports;

  // Show app's root
  $root.removeAttribute("style");

  const $viewer = $root.querySelector("#viewer");
  const [$original, $modified] = $viewer.querySelectorAll("img");
  const $control = $root.querySelector("#control");

  const $uploader = document.querySelector('#uploader > input[type="file"]');
  $uploader.addEventListener("change", (evt) => {
    const [blob] = evt.target.files;
    const reader = new FileReader();

    $original.title = blob.name;
    $modified.title = `${blob.name} modified`;
    reader.onload = (evt) => {
      $uploader.setAttribute("style", "display: none");

      $original.src = evt.target.result;
      $modified.src = evt.target.result;

      $viewer.removeAttribute("style");
      $control.removeAttribute("style");
    };

    reader.readAsDataURL(blob);
  });

  const $filters = $control.querySelectorAll("#filters");
  const [$bp] = $filters;
  $bp.addEventListener("click", () => {
    console.time(`[${__RUNNER__}] applyBlackAndWhiteFilter`);
    if (__RUNNER__ === "JavaScript") {
      const canvas = loadImageIntoCanvas($modified);
      const b64 = js.applyBlackAndWhiteFilter(canvas);
      $modified.src = b64;
    }

    if (__RUNNER__ === "WebAssembly") {
      const { $element, context } = loadImageIntoCanvas($modified);
      const image = context.getImageData(0, 0, $element.width, $element.height);
      const buffer = new Uint8Array(image.data.buffer);
      const pointer = malloc(buffer.length);

      const mem = new Uint8ClampedArray(
        wasm.memory.buffer,
        pointer,
        buffer.length
      );

      mem.set(buffer);

      wasm.applyBlackAndWhiteFilter(pointer, buffer.length);

      const nimage = context.createImageData($element.width, $element.height);

      nimage.data.set(mem);

      context.putImageData(nimage, 0, 0);

      $modified.src = $element.toDataURL("image/jpeg");
    }
    console.timeEnd(`[${__RUNNER__}] applyBlackAndWhiteFilter`);
  });

  const $actions = $control.querySelectorAll("#actions > button");
  const [, $resetter] = $actions;
  $resetter.addEventListener("click", () => {
    $modified.src = $original.src;
  });
}

/**
 * @param {string} path
 */
async function main(path) {
  const importObject = go.importObject;

  const $loading = document.getElementById("loading");

  try {
    const result = await WebAssembly.instantiateStreaming(
      fetch(path),
      importObject
    );
    const { instance } = result;

    // Remove loading
    $loading.remove();

    run(instance);
  } catch (err) {
    $loading.style = "color: red;";
    $loading.innerText = err.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  main("main.wasm");
});
