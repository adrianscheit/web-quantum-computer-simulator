export class C {
    constructor(public r: number = 0, public i: number = 0) { }

    new(): C {
        return new C(this.r, this.i);
    }

    plus(c: C): C {
        this.r += c.r;
        this.i += c.i;
        return this;
    }

    absSqer(): number {
        return this.r * this.r + this.i * this.i;
    }

    mul(c: C): C {
        const r = this.r * c.r - this.i * c.i;
        this.i = this.r * c.i + this.i * c.r;
        this.r = r;
        return this;
    }

    private static toDecimal(v: number): string {
        return `${Math.round(v * 1000) / 1000}`;
    }

    private iToString(): string {
        return `${this.i === 1 ? '' : this.i === -1 ? '-' : C.toDecimal(this.i)}i`;
    }

    toString(): string {
        if (this.r === 0 && this.i === 0) {
            return '0';
        }
        if (this.i === 0) {
            return C.toDecimal(this.r);
        }
        if (this.r === 0) {
            return this.iToString();
        }
        return `${C.toDecimal(this.r)}${this.i > 0 ? '+' : ''}${this.iToString()}`
    }
}
