import numeral = require("numeral");

export interface RuntimeLog {
  name: string;
  startAt: number;
  endAt: number;
  spend: number;
  steps: RuntimeLog[];
}

export class RuntimeTracker {
  public endAt?: number = null;
  public readonly startAt: number = Date.now();
  public readonly lowers: RuntimeTracker[] = [];
  public constructor(public name: string, public upper?: RuntimeTracker) {}

  public get spend(): number {
    return (this.endAt || Date.now()) - this.startAt;
  }

  public toString(
    space: string = "   ",
    prefix: string = "",
    isEndRow: boolean = false
  ): string {
    let headerSymbol = isEndRow ? "└ " : "├ ";
    let headerPrefix = !!prefix ? prefix + headerSymbol : "";
    let spendStr = numeral(this.spend).format(",");
    let row = `${headerPrefix}[${this.name}]: ${spendStr} ms`;
    let rows = [row].concat(
      this.lowers.map((lower, index) => {
        let isEnd = index == this.lowers.length - 1;
        let nextPrefix: string;
        if (prefix) {
          nextPrefix = prefix + (isEndRow ? space : "│" + space);
        } else {
          nextPrefix = space;
        }
        return lower.toString(space, nextPrefix, isEnd);
      })
    );
    return rows.join("\n");
  }

  public toJSON(): RuntimeLog {
    return {
      name: this.name,
      startAt: this.startAt,
      endAt: this.endAt,
      spend: this.spend,
      steps: this.lowers.map((lower) => lower.toJSON()),
    };
  }

  public step(lowerName: string): RuntimeTracker {
    if (!!this.endAt) {
      throw new Error(
        "this RuntimeTracker is ended. It will not allow to create sub-RuntimeTracker."
      );
    }
    let existedTracker = this.getLowerByName(lowerName);
    if (!!existedTracker) {
      return existedTracker;
    }
    let lower = new RuntimeTracker(lowerName, this);
    this.lowers.push(lower);
    return lower;
  }

  public end(endAt: number = Date.now()): void {
    this.lowers.forEach((lower) => lower.end());
    if (!!this.endAt) return;
    this.endAt = endAt;
  }

  public endStep(lowerName: string): void {
    let tracker = this.getLowerByName(lowerName);
    if (!tracker) return;
    tracker.end();
  }

  private getLowerByName(lowerName: string): RuntimeTracker {
    return this.lowers.find((lower) => lower.name == lowerName);
  }
}
