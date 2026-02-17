class Store {
  constructor() {
    this.state = {
      user: null,
      currentWorkout: null,
      exercises: [],
      programs: []
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.listeners.forEach(cb => cb(this.state));
  }

  subscribe(cb) {
    this.listeners.push(cb);
  }
}

export const store = new Store();
