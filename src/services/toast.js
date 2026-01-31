let toastInstance = null

export const setToast = (toast) => {
  toastInstance = toast
}

export const showToast = (options) => {
  if (!toastInstance) return
  toastInstance.add(options)
}
