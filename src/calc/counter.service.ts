export class CounterService {
  private count = 0;

  increment() {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}
