export class Dummy {
  private count = 0;

  increment() {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}
