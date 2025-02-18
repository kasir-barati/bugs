import { EventEmitter } from "events";

class MyClass extends EventEmitter {
  private beforeEvent?: string;
  private params: { b: number };

  constructor() {
    super();
    this.params = { b: 0 };
  }

  public once(
    event: "before",
    listener: (params: { b: number }) => void
  ): this {
    this.beforeEvent = event;

    return super.once(event, listener);
  }

  async updateData() {
    console.log("some code");
    this.emitBefore();
    await sleep();
    console.log(this.params.b);
    console.log("some other code");
  }

  private emitBefore() {
    if (this.beforeEvent) {
      this.emit(this.beforeEvent, this.params);
    }
  }
}

// Usage example
const myClass = new MyClass();

myClass.once("before", (params) => (params.b = 12));

myClass.updateData();

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}
