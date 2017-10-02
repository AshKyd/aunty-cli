const style = require('./ErrorBox.css');

function ErrorBox({ error }) {
  const el = (this.el = document.createElement('pre'));

  el.className = style;
  el.textContent = error.stack;

  (function logOnMount() {
    if (!el.parentNode) {
      return setTimeout(logOnMount, 100);
    }

    console.error(error);
  })();
}

module.exports = ErrorBox;
