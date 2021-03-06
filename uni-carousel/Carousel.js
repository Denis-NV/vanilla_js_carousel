export default class {
  constructor(
    p_mount_point,
    p_items,
    p_btn_left = null,
    p_btn_right = null,
    p_settings = {}
  ) {
    this.items = p_items;
    this.container = p_mount_point;
    this.btn_left = p_btn_left;
    this.btn_right = p_btn_right;

    this.settings = {
      full_width: true,
      swipe: true,
      gap: 16,
      easing_factor: 0.15,
      easing_tolerance: 0.0001,
      loop: true,
      ...p_settings
    };

    this.state = {
      cur_offset: 0,
      targ_offset: 0,
      cur_phase: 0,
      cur_loop: false,
      max_offset: 1,
      animationId: null,
      drag_start_x: 0,
      drag_lock: false,
      full_carousel_width: 0
    };

    this.init();
  }

  init() {
    const scope = this;

    this.carousel = document.createElement("div");
    this.container.appendChild(this.carousel);

    this.carousel.style.boxSizing = "border-box";
    this.carousel.style.width = "100%";
    this.carousel.style.overflow = "hidden";
    this.carousel.style.position = "relative";

    if (this.btn_left)
      this.btn_left.addEventListener("click", function(event) {
        scope.onSlideRequest(true);
      });
    if (this.btn_right)
      this.btn_right.addEventListener("click", function(event) {
        scope.onSlideRequest(false);
      });

    if (this.settings.swipe) {
      this.carousel.addEventListener("touchstart", function(event) {
        scope.onDragStart(event);
      });
      this.carousel.addEventListener("touchend", function(event) {
        scope.onDragEnd(event);
      });
      this.carousel.addEventListener("touchmove", function(event) {
        scope.onDrag(event);
      });
      this.carousel.addEventListener("mousedown", function(event) {
        scope.onDragStart(event);
      });
      this.carousel.addEventListener("mouseup", function(event) {
        scope.onDragEnd(event);
      });
      this.carousel.addEventListener("mouseleave", function(event) {
        scope.onDragEnd(event);
      });
      this.carousel.addEventListener("mousemove", function(event) {
        scope.onDrag(event);
      });
    }

    window.addEventListener("resize", function(event) {
      scope.onResize();
    });

    this.items.forEach(item => {
      this.carousel.appendChild(item.container);
    });

    this.onResize();
  }

  render() {
    const cut_off = this.carousel.getBoundingClientRect().width;
    const cut_off_tail = this.state.full_carousel_width - cut_off;

    let static_x = 0;

    this.items.forEach((item, index) => {
      const offset_x = this.state.full_carousel_width * this.state.cur_phase;
      const prov_x = static_x + offset_x;
      const run_over_x = prov_x - cut_off;
      const final_x = prov_x > cut_off ? run_over_x - cut_off_tail : prov_x;

      item.x = final_x;
      item.container.style.transform = `translateX(${final_x}px)`;

      if (
        item.x <= cut_off &&
        item.x + item.width + this.settings.gap >= 0 &&
        !item.initialized
      ) {
        item.initialize();
        item.load();
      }

      static_x += item.width + this.settings.gap;
    });
  }

  startTransition() {
    if (!this.state.cur_loop)
      this.state.targ_offset = Math.min(
        0,
        Math.max(this.state.max_offset, this.state.targ_offset)
      );

    const transitionStep = timestamp => {
      const remaining_offset = this.state.targ_offset - this.state.cur_offset;
      const eased_remaining_offset =
        remaining_offset * this.settings.easing_factor;

      this.state.cur_offset += eased_remaining_offset;

      if (
        Math.abs(this.state.targ_offset - this.state.cur_offset) <
        this.settings.easing_tolerance
      )
        this.state.cur_offset = this.state.targ_offset;

      this.state.cur_phase = this.state.cur_offset % 1;
      this.state.cur_phase =
        this.state.cur_phase < 0
          ? 1 + this.state.cur_phase
          : this.state.cur_phase;

      this.render();

      if (this.state.targ_offset !== this.state.cur_offset)
        this.state.animationId = requestAnimationFrame(transitionStep);
    };

    if (this.state.animationId) cancelAnimationFrame(this.state.animationId);
    this.state.animationId = requestAnimationFrame(transitionStep);
  }

  // Handlers
  onSlideRequest(left) {
    this.state.targ_offset += this.getOffsetStep(
      left,
      this.items,
      this.state.full_carousel_width,
      this.settings.gap
    );

    this.startTransition();
  }

  onResize() {
    const viewport_width = this.carousel.getBoundingClientRect().width;
    const last_item_width = this.items[this.items.length - 1].width;

    let max_height = 0;

    this.state.full_carousel_width = 0;

    this.items.forEach(item => {
      max_height = Math.max(
        max_height,
        item.resize(viewport_width, this.settings.full_width)
      );

      this.state.full_carousel_width += item.width + this.settings.gap;
    });

    this.carousel.style.height = `${max_height}px`;

    this.state.cur_loop =
      this.settings.loop &&
      this.state.full_carousel_width - last_item_width > viewport_width;

    this.state.max_offset =
      (viewport_width - this.state.full_carousel_width + this.settings.gap) /
      this.state.full_carousel_width;

    if (!this.state.cur_loop) this.startTransition();

    //

    if (this.state.full_carousel_width <= viewport_width) {
      if (this.btn_left) this.btn_left.style.display = "none";
      if (this.btn_right) this.btn_right.style.display = "none";
    }

    this.render();
  }

  // UI Handlers

  onDragStart(event) {
    this.state.drag_lock = true;

    this.state.drag_start_x = this.unifyEvents(event).clientX;
  }

  onDragEnd(event) {
    if (this.state.drag_lock) {
      this.state.drag_lock = false;

      if (
        this.state.cur_loop ||
        (!this.state.cur_loop && this.state.targ_offset > this.state.max_offset)
      ) {
        this.state.targ_offset = this.getSnapTragetOffset(
          this.state.targ_offset,
          this.items,
          this.state.full_carousel_width,
          this.settings.gap
        );

        this.startTransition();
      }
    }
  }

  onDrag(event) {
    event.preventDefault();

    if (this.state.drag_lock) {
      const cur_x = this.unifyEvents(event).clientX;
      const diff = cur_x - this.state.drag_start_x;

      this.state.targ_offset += diff / this.state.full_carousel_width;

      this.startTransition();

      this.state.drag_start_x = cur_x;
    }
  }

  // Utils

  unifyEvents(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  getOffsetStep(p_left, p_items, p_full_carousel_width, p_gap) {
    let left_index = 0;
    let closest_gap = p_full_carousel_width;

    p_items.forEach((item, index) => {
      if (Math.abs(item.x) < closest_gap) {
        closest_gap = Math.abs(item.x);

        left_index = index;
      }
    });

    const step_index = p_left
      ? (p_items.length + left_index - 1) % p_items.length
      : left_index;
    const step = (p_items[step_index].width + p_gap) / p_full_carousel_width;

    return step * (p_left ? 1 : -1);
  }

  getSnapTragetOffset(p_targ_offset, p_items, p_full_carousel_width, p_gap) {
    if (p_targ_offset !== 0) {
      let static_x = 0;
      let offset_diff_mod = 2;
      let offset_diff = 2;

      const norm_target_offset = p_targ_offset % 1;

      for (let i = 0; i < p_items.length * 2 + 1; i++) {
        const index = i % p_items.length;
        const item = p_items[index];

        const items_snap_offset = static_x / p_full_carousel_width - 1;
        const items_offset_diff = Math.abs(
          norm_target_offset + items_snap_offset
        );

        if (items_offset_diff < offset_diff_mod) {
          offset_diff = norm_target_offset + items_snap_offset;
          offset_diff_mod = items_offset_diff;
        }

        static_x += item.width + p_gap;
      }

      return p_targ_offset - offset_diff;
    }

    return p_targ_offset;
  }
}
