const AppError = require('./appError');
const { imageDimensionsMap } = require('./config');

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
  size(imageSize) {
    // Validate size
    if (!Array.from(imageDimensionsMap.keys()).includes(imageSize)) {
      throw new AppError(
        `This size is not supported. Image path can be build only for the following sizes [${Array.from(imageDimensionsMap.keys()).join(', ')}]`,
      );
    }
    this.imageSize = imageSize;
    return this;
  }

  /**
   * Add image file name to the builder.
   */
  name(imageName) {
    this.imageName = imageName;
    return this;
  }

  /**
   * Add image file mime type to the builder.
   */
  mime(mimeType) {
    this.mimeType = mimeType;
    return this;
  }

  /**
   * Perform bulding of the image path and name.
   */
  build() {
    const resourceToken = `${this.resource}s`;
    const nameToken = this.imageName
      ? this.imageName
      : 'user_photo_placeholder';
    const dimensionToken = imageDimensionsMap.get(this.imageSize);
    const formatToken = this.imageName ? this.mimeType.split('/')[1] : 'png';

    return `/img/${resourceToken}/${this.imageSize}/${nameToken}_${dimensionToken}.${formatToken}`;
  }
}

module.exports = ImagePathBuilder;
