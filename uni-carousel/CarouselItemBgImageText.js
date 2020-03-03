import CarouselItemBase from "./CarouselItemBase";

export default class extends CarouselItemBase {
  constructor(image_url, p_text, p_item_width, p_image_height) {
    super();

    this.image_url = image_url;
    this.text = p_text;
    this.item_width = p_item_width + Math.random() * 60 - 30;
    this.image_height = p_image_height + Math.random() * 40 - 20;
    // this.item_width = p_item_width;
    // this.image_height = p_image_height;
    //
    this.init();
  }

  init() {
    this.container_node = document.createElement("div");
    this.image_container_node = document.createElement("div");
    this.image_node = document.createElement("div");
    this.text_node = document.createElement("p");

    this.container_node.style.position = "absolute";

    this.image_container_node.style.backgroundImage =
      "linear-gradient(135deg, rgb(115, 115, 115) 45%, rgb(156, 156, 156))";
    this.image_container_node.style.width = "100%";

    this.image_node.style.backgroundPosition = "center center";
    this.image_node.style.backgroundSize = "cover";
    this.image_node.style.width = "100%";

    this.text_node.style.padding = "0.5rem 0";
    this.text_node.innerText = this.text;

    this.container_node.appendChild(this.image_container_node);
    this.container_node.appendChild(this.text_node);

    this.image_container_node.appendChild(this.image_node);
  }

  load() {
    this.image_node.style.backgroundImage = `url(${this.image_url})`;
  }

  get container() {
    return this.container_node;
  }

  get width() {
    return this.container_node.getBoundingClientRect().width;
  }

  resize(p_viewport_width, p_fullwidth) {
    this.container_node.style.width = `${
      p_fullwidth ? p_viewport_width : this.item_width
    }px`;

    this.image_node.style.height = p_fullwidth
      ? `${p_viewport_width * (this.image_height / this.item_width)}px`
      : `${this.image_height}px`;

    return this.container_node.getBoundingClientRect().height;
  }
}
