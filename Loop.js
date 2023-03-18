export class Loop {

  constructor() {
    this.updatables = new Set();

    const MS_PER_UPDATE = 4;
    let [rAF, elapsed, previous, lag] = [null, 0, 0, 0];

    const tick = (current) => {

      elapsed = current - previous;
      previous = current;
      lag += elapsed;

      // Update or simulate
      while (lag > MS_PER_UPDATE) {
        for (const object of this.updatables) {
          object.update(MS_PER_UPDATE / 1000);
        }
        lag -= MS_PER_UPDATE;
      }

      // Render
      for (const object of this.updatables) {
        object.draw(lag / MS_PER_UPDATE);
      }

      rAF = requestAnimationFrame(tick);
    };

    rAF = requestAnimationFrame(tick);
  }

  add(instance) {
    this.updatables.add(instance);
  }

}
