const EventBus = (function () {
  const events = Object.create(null);
  return class EventBus {
    emit(event, ...args) {
      const handler = events[event];
      if (handler) {
        handler(...args);
      }
    }

    addListener(type, func) {
      const e = events[type];
      if (!e) {
        events[type] = func;
      }
    }

    removeListener(type) {
      if (events[type]) {
        delete events[type];
      }
    }
  };
}());

const eventBus = new EventBus();
export default eventBus;
