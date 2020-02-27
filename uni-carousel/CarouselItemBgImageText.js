import CarouselItemBase from "./CarouselItemBase";

export default class extends CarouselItemBase {
  constructor(image_url, p_text, p_image_width, p_image_height) {
    super();

    this.image_url = image_url;
    this.text = p_text;
    this.image_width = p_image_width;
    this.image_height = p_image_height;
    //
    this.init();
  }

  init() {
    this.container_node = document.createElement("div");
    this.image_node = document.createElement("div");
    this.text_node = document.createElement("p");

    this.container_node.style.position = "absolute";
    this.container_node.style.width = "100%";

    this.image_node.style.backgroundImage = `url(${this.image_url})`;
    this.image_node.style.backgroundPosition = "center center";
    this.image_node.style.backgroundSize = "cover";
    this.image_node.style.width = "100%";

    this.text_node.style.padding = "0.5rem 0";
    this.text_node.innerText = this.text;

    this.container_node.appendChild(this.image_node);
    this.container_node.appendChild(this.text_node);
  }

  get container() {
    return this.container_node;
  }

  resize(p_width, p_fullwidth) {
    this.image_node.style.height = p_fullwidth
      ? `${p_width * (this.image_height / this.image_width)}px`
      : `${this.image_height}px`;

    return this.container_node.getBoundingClientRect().height;
  }
}
