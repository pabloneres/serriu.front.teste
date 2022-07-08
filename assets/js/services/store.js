let store = JSON.parse(localStorage.getItem("persist:root"));
let modules = {};

if (store) {
  Object.keys(store).forEach(function(key) {
    modules[key] = JSON.parse(store[key]);
  });
}

export default modules;
