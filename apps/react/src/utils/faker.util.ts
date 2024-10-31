export function fakeFetch<T>(data: T, delay: number) {
  return new Promise<T>((resolve, _reject) => {
    setTimeout(() => resolve(data), delay);
  });
}

export function fakeSleep(milliseconds: number) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, milliseconds);
  });
}
