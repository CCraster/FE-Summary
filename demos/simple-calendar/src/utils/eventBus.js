let eventBus = {};
eventBus.on = (eventName, callback) => {
  document.addEventListener(eventName, callback);
};
eventBus.trigger = (eventName, data) => {
  document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
};

window.$eventBus = eventBus;
