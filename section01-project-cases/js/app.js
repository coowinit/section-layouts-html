(() => {
  const root = document.querySelector('#section01');
  if (!root) return;

  const buttons = [...root.querySelectorAll('.nav-item[data-target]')];
  const panels = [...root.querySelectorAll('.panel[data-panel]')];

  const activate = (target) => {
    buttons.forEach((button) => {
      const active = button.dataset.target === target;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== target;
    });
  };

  if (buttons.length) {
    activate(buttons[0].dataset.target);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => activate(button.dataset.target));
  });
})();
