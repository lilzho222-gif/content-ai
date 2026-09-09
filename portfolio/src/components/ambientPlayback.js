export function shouldPlayAmbient({ visible, hidden, reduced, paused, failed }) {
  return visible && !hidden && !reduced && !paused && !failed
}
