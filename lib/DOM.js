var DOM = {
  announcement: {
    el: document.getElementById('tron-menu-announcement'),
    flyInKlass: 'tron-menu-animate',
    flyOutKlass: 'tron-menu-nowhere',
  },
  instructions: {
    el: document.getElementById('tron-instructions'),
    display: 'block',
    undisplay: 'none'
  },
  instructionsButton: {
    el: document.getElementById('tron-menu-instructions'),
    flyInKlass: 'tron-menu-animate',
    flyOutKlass: 'tron-menu-nowhere',
  },
  instructionsBack: {
    el: document.getElementById('tron-instructions-back')
  },
  modalPauseHeader: {
    el: document.getElementById('tron-modal-pause-header'),
    flyInKlass: 'tron-modal-pause-header-animate',
    flyOutKlass: 'tron-modal-pause-header-nowhere'
  },
  modalPauseBody: {
    el: document.getElementById('tron-modal-pause-body'),
    flyInKlass: 'tron-modal-pause-body-animate',
    flyOutKlass: 'tron-modal-pause-body-nowhere'
  },
  newGameButton: {
    el: document.getElementById('tron-menu-new-game'),
    flyInKlass: 'tron-menu-animate',
    flyOutKlass: 'tron-menu-nowhere',
  },
  outerMenu: {
    el: document.getElementById('tron-outer-menu'),
    display: 'block',
    undisplay: 'none'
  }
}

module.exports = DOM;
