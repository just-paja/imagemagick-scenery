/**
 * @typedef {string[]} Template
 *
 * First element is the Imagemagick command or "input", all other are arguments
 */

/**
 * @typedef {Object} Scene
 * @property {Template[]} template Imagemagick templates recipe
 * @property {string} format Output format, for example "png"
 * @property {Function} getDestStream Callback to creates destination write stream
 */

const imagemagick = require('imagemagick-stream')

/** Hackity hackity hacky @HACK
 *
 * This class overcomes input issue of imagemagick-stream, it is unable
 * to use multiple input images.
 *
 * To add extra input, use -input operator with input paths as arguments,
 * the input paths will be added inside the convert operator sequence
 * and the fake "-input" operator will be removed.
 *
 * @TODO: Consume imagemagick-stream library into this code
 */
const imDummy = imagemagick()
class ImageMagick extends imDummy.constructor {
  args () {
    return super.args().filter(key => key !== '-input')
  }
}

function getTransformer (specs) {
  const transformer = new ImageMagick()
  if (specs.template) {
    specs.template.forEach(([command, ...args]) => {
      transformer.op(command, args)
    })
  }
  if (specs.format) {
    transformer.outputFormat(specs.format)
  }
  transformer.quality(100)
  return transformer
}

/** Transform image based on image group specs
 * @async
 * @param {ReadStream} srcStream
 * @param {Scene|Scene[]} scenes
 * @returns void
 */
async function transformImage (srcStream, scene) {
  if (scene instanceof Array) {
    return await Promise.all(scene.map(s => transformImage(srcStream, s)))
  }
  return await new Promise((resolve, reject) => {
    srcStream
      .pipe(getTransformer(scene))
      .on('error', reject)
      .pipe(scene.getDestStream(scene))
      .on('finish', resolve)
      .on('error', reject)
  })
}

module.exports = {
  transformImage
}
