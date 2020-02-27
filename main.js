import Carousel from "./uni-carousel/Carousel";
import CarouselItemBgImageText from "./uni-carousel/CarouselItemBgImageText";

//
const images_data = [
  {
    src: "images/0.jpg",
    text:
      "Eu consequat fugiat officia deserunt mollit velit ipsum enim ad occaecat."
  },
  {
    src: "images/1.jpg",
    text: "Ipsum est anim ad aliqua culpa."
  },
  {
    src: "images/2.jpg",
    text: "Officia tempor magna nostrud laboris labore."
  },
  {
    src: "images/3.jpg",
    text:
      "Esse incididunt anim do adipisicing deserunt qui veniam tempor veniam labore do."
  },
  {
    src: "images/4.jpg",
    text:
      "Mollit amet deserunt officia labore qui irure qui irure tempor occaecat esse ut."
  },
  {
    src: "images/5.jpg",
    text:
      "Dolor nulla pariatur tempor duis labore exercitation velit consequat qui aute mollit."
  },
  {
    src: "images/6.jpg",
    text:
      "Deserunt officia incididunt cupidatat nostrud dolore consequat dolor voluptate est."
  },
  {
    src: "images/7.jpg",
    text:
      "Tempor Lorem velit laboris nulla cupidatat consequat anim exercitation consequat enim do."
  }
];

//

const mounting_points = document.querySelectorAll(".carousel-viewport");

new Carousel(
  mounting_points[0],
  images_data.map(
    item => new CarouselItemBgImageText(item.src, item.text, 192, 128)
  ),
  document.querySelector(".carousel-viewport:nth-child(1) > .carousel-UI-left"),
  document.querySelector(".carousel-viewport:nth-child(1) > .carousel-UI-right")
);

new Carousel(
  mounting_points[1],
  images_data.map(
    item => new CarouselItemBgImageText(item.src, item.text, 192, 128)
  ),
  document.querySelector(".carousel-viewport:nth-child(2) > .carousel-UI-left"),
  document.querySelector(
    ".carousel-viewport:nth-child(2) > .carousel-UI-right"
  ),
  { full_width: false }
);

new Carousel(
  mounting_points[2],
  images_data.map(
    item => new CarouselItemBgImageText(item.src, item.text, 192, 128)
  ),
  document.querySelector(".carousel-viewport:nth-child(3) > .carousel-UI-left"),
  document.querySelector(
    ".carousel-viewport:nth-child(3) > .carousel-UI-right"
  ),
  { full_width: false, loop: false }
);
