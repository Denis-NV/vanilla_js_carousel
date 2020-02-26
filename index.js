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

const carousel = document.createElement("div");
const btn_left = document.querySelector("#carousel-UI-left");
const btn_right = document.querySelector("#carousel-UI-right");
const settings = {
  full_width: true,
  item_width: 192,
  image_height: 128,
  gap: 16,
  easing_factor: 0.15,
  loop: true
};
const state = {
  cur_offset: 0,
  targ_offset: 0,
  cur_phase: 0,
  cur_loop: false,
  max_offset: 1,
  animationId: null,
  drag_start_x: 0,
  drag_lock: false,
  step: 0,
  full_item_width: 0,
  full_carousel_width: 0
};

const init = () => {
  document.querySelector("#carousel-root").appendChild(carousel);

  state.step = 1 / images_data.length;

  carousel.style.boxSizing = "border-box";
  carousel.style.width = "100%";
  carousel.style.overflow = "hidden";
  carousel.style.position = "relative";

  images_data.forEach(item => {
    item.contianer_node = document.createElement("div");
    item.image_node = document.createElement("div");
    item.text_node = document.createElement("p");

    item.contianer_node.style.position = "absolute";
    item.contianer_node.style.width = settings.full_width
      ? "100%"
      : `${settings.item_width}px`;

    item.image_node.style.backgroundImage = `url(${item.src})`;
    item.image_node.style.backgroundPosition = "center center";
    item.image_node.style.backgroundSize = "cover";
    item.image_node.style.width = "100%";

    item.text_node.style.padding = "0.5rem 0";
    item.text_node.innerText = item.text;

    item.contianer_node.appendChild(item.image_node);
    item.contianer_node.appendChild(item.text_node);

    carousel.appendChild(item.contianer_node);
  });

  onResize();
};

const render = () => {
  const cut_off = carousel.getBoundingClientRect().width;
  const cut_off_tail = state.full_carousel_width - cut_off;

  images_data.forEach((item, index) => {
    const static_x = index * state.full_item_width;
    const offset_x = state.full_carousel_width * state.cur_phase;
    const prov_x = static_x + offset_x;
    const run_over_x = prov_x - cut_off;
    const final_x = prov_x > cut_off ? run_over_x - cut_off_tail : prov_x;

    item.contianer_node.style.transform = `translateX(${final_x}px)`;
  });
};

const startTransition = () => {
  if (!state.cur_loop)
    state.targ_offset = Math.min(
      0,
      Math.max(state.max_offset, state.targ_offset)
    );

  const transitionStep = timestamp => {
    const remaining_offset = state.targ_offset - state.cur_offset;
    const eased_remaining_offset = remaining_offset * settings.easing_factor;

    state.cur_offset += eased_remaining_offset;

    if (Math.abs(state.targ_offset - state.cur_offset) < 0.0001)
      state.cur_offset = state.targ_offset;

    state.cur_phase = state.cur_offset % 1;
    state.cur_phase =
      state.cur_phase < 0 ? 1 + state.cur_phase : state.cur_phase;

    render();

    if (state.targ_offset !== state.cur_offset)
      state.animationId = requestAnimationFrame(transitionStep);
  };

  if (state.animationId) cancelAnimationFrame(state.animationId);
  state.animationId = requestAnimationFrame(transitionStep);
};

// Handlers
const onSlideRequest = left => event => {
  state.targ_offset += state.step * (left ? 1 : -1);

  startTransition();
};

const onResize = () => {
  const viewport_width = carousel.getBoundingClientRect().width;

  state.full_item_width =
    settings.gap + (settings.full_width ? viewport_width : settings.item_width);

  state.full_carousel_width = state.full_item_width * images_data.length;

  //

  let max_height = 0;

  images_data.forEach(item => {
    item.image_node.style.height = settings.full_width
      ? `${viewport_width * (settings.image_height / settings.item_width)}px`
      : `${settings.image_height}px`;

    max_height = Math.max(
      max_height,
      item.contianer_node.getBoundingClientRect().height
    );
  });

  carousel.style.height = `${max_height}px`;

  //

  state.cur_loop =
    settings.loop &&
    state.full_carousel_width - state.full_item_width > viewport_width;
  state.max_offset =
    (viewport_width - state.full_carousel_width + settings.gap) /
    state.full_carousel_width;

  if (!state.cur_loop) startTransition();

  //

  if (state.full_carousel_width <= viewport_width) {
    btn_left.style.display = "none";
    btn_right.style.display = "none";
  }

  render();
};

// UI Handlers

const unifyEvents = e => {
  return e.changedTouches ? e.changedTouches[0] : e;
};

const onDragStart = event => {
  state.drag_lock = true;

  state.drag_start_x = unifyEvents(event).clientX;
};

const onDragEnd = event => {
  state.drag_lock = false;

  if (
    state.cur_loop ||
    (!state.cur_loop && state.targ_offset > state.max_offset)
  ) {
    state.targ_offset = Math.round(state.targ_offset / state.step) * state.step;

    startTransition();
  }
};

const onDrag = event => {
  event.preventDefault();

  if (state.drag_lock) {
    const cur_x = unifyEvents(event).clientX;
    const diff = cur_x - state.drag_start_x;

    state.targ_offset += diff / state.full_carousel_width;

    startTransition();

    state.drag_start_x = cur_x;
  }
};

btn_left.addEventListener("click", onSlideRequest(true));
btn_right.addEventListener("click", onSlideRequest(false));

carousel.addEventListener("touchstart", onDragStart);
carousel.addEventListener("touchend", onDragEnd);
carousel.addEventListener("touchmove", onDrag);

carousel.addEventListener("mousedown", onDragStart);
carousel.addEventListener("mouseup", onDragEnd);
carousel.addEventListener("mouseleave", onDragEnd);
carousel.addEventListener("mousemove", onDrag);

window.addEventListener("resize", onResize);

//

init();
