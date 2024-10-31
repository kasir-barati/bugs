export function getHeightOfDocument() {
  return (
    document.body.offsetHeight ||
    document.documentElement.scrollHeight
  );
}
export function getHeightOfViewport() {
  return window.innerHeight || document.documentElement.clientHeight;
}
export function isEndOfThePage() {
  return (
    getHeightOfViewport() + getScrollTop() === getHeightOfDocument()
  );
}
export function getScrollTop(): number {
  return Math.ceil(
    window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0,
  );
}

// BUGGY?
// function isCloseToTheEndOfThePage() {
//   return (
//     getHeightOfDocument() + getScrollTop() >=
//     getHeightOfDocument() - 200
//   );
// }
// function isCloseToTheTopOfThePage() {
//   return getScrollTop() <= 200;
// }
