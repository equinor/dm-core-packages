// eslint-disable-next-line @typescript-eslint/no-var-requires

// JSDOM doesn't implement HTMLDialogElement.showModal/close.
// Polyfill them so EDS <Dialog> (which uses the native <dialog> element) works in tests.
if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.show) {
    HTMLDialogElement.prototype.show = function () {
      this.open = true
    }
  }
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true
    }
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.open = false
    }
  }
}

beforeEach(() => {
  window.sessionStorage.clear()
})
