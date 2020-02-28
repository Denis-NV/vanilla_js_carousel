export default class {
  constructor() {
    //
    this.transform_x = 0;
  }

  get container() {
    console.error(
      "ERROR!!! 'get container() [returns a reference to the item's container]' method of the CarouselItemBase Class must be overriden"
    );
    return document.createElement("div");
  }

  get width() {
    console.warn(
      "WARNING!!! 'get width() [returns item's height]' method of the CarouselItemBase Class should be overriden. Otherwise it returns width of item container's bounding box"
    );
    return this.container.getBoundingClientRect().width;
  }

  resize(p_viewport_width, p_fullwidth) {
    console.error(
      "ERROR!!! 'resize(p_item_width, p_viewport_width, p_fullwidth) [returns item's height]' method of the CarouselItemBase Class must be overriden"
    );
    return this.container.getBoundingClientRect().height;
  }

  //

  get x() {
    return this.transform_x;
  }

  set x(p_x) {
    this.transform_x = p_x;
  }
}
