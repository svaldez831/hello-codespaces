// navigation.js
let navigateFn = null

export function setNavigate(fn) {
  navigateFn = fn
}

export function navigate(path) {
  if (navigateFn) {
    navigateFn(path)
  } else {
    console.warn('navigate() called before React Router was ready')
  }
}
