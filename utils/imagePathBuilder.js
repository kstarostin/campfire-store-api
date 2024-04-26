const AppError = require('./appError');

class ImagePathBuilder {
  #supportedResources = ['user', 'product'];

  /**
   * Add resource (model name) to the builder.
   */
  for(resource) {
    // Validate resource type
    if (!this.#supportedResources.includes(resource)) {
      throw new AppError(
        `This resource is not supported. Image path can be build only for the following resources [${this.#supportedResources.join(', ')}]`,
      );
    }
    this.resource = resource;
    return this;
  }

  /**
   * Add image size type to the builder.
   */
  withSize(size) {
    // Validate size
    if (!Array.from(this.#getDimensionsMap().keys()).includes(size)) {
      throw new AppError(
        `This size is not supported. Image path can be build only for the following sizes [${Array.from(this.#getDimensionsMap().keys()).join(', ')}]`,
      );
    }
    this.size = size;
    return this;
  }

  /**
   * Add image file name to the builder.
   */
  withName(name) {
    this.name = name;
    return this;
  }

  /**
   * Add image file mime type to the builder.
   */
  withMime(mime) {
    this.mime = mime;
    return this;
  }

  /**
   * Perform bulding of the image path and name.
   */
  build() {
    const resourceToken = `${this.resource}s`;
    const nameToken = this.name ? this.name : 'user_photo_placeholder';
    const dimensionToken = this.#getDimensionsMap().get(this.size);
    const formatToken = this.name ? this.mime.split('/')[1] : 'png';

    return `/img/${resourceToken}/${this.size}/${nameToken}_${dimensionToken}.${formatToken}`;
  }

  /**
   * Get the map of image sizes.
   * The key is an image size type, the value is an actual size in pixels of one side (assuming that the image is square).
   */
  #getDimensionsMap() {
    const dimensionsMap = new Map();

    dimensionsMap.set('thumbnail', '200');
    dimensionsMap.set('small', '500');
    // dimensionsMap.set('medium', '1000');
    // dimensionsMap.set('large', '2000');
    // dimensionsMap.set('original', 'original');

    return dimensionsMap;
  }
}

module.exports = ImagePathBuilder;
