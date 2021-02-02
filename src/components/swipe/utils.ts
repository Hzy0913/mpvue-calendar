export function hasTransitions() {
  const element = document.createElement('div');
  const property = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];

  for (let value of property) {
    if ((element.style as any)[value] !== undefined) return true;
  }

  return false;
}
