export class Stack<T> {
  private data: T[] = [];
  private top: number = 0;

  constructor() {
  }

  public push(element: T) {
      this.data[this.top] = element;
      this.top = this.top + 1;
  }

  public length(): number {
      return this.top;
  }

  public peek(offset?: number): T | undefined {
      const delta = offset ? offset + 1 : 1;
      const ix = this.top - delta;
      if (ix < 0)
          return;

      return this.data[ix];
  }

  public clear(): void {
      this.data.length = this.top = 0;
  }

  public pop(): T | undefined {
      if (this.top === 0)
          return;

      this.top = this.top - 1;
      return this.data.pop();
  }

  public getAll(): T[] {
      return this.data;
  }
}
