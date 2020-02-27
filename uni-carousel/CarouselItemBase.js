export default class {
  constructor() {
    //
  }

  // Must be overriden
  get container() {
    return document.createElement("div");
  }

  // Must be overriden
  resize(p_width) {
    return container.getBoundingClientRect().height;
  }
}
