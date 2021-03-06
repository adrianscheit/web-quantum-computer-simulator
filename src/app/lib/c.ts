export class C {
    constructor(public r: number = 0, public i: number = 0) { }

    private static toDecimal(v: number): string {
        return `${Math.round(v * 1000) / 1000}`;
    }

    new(): C {
        return new C(this.r, this.i);
    }

    // plus(c: C): C {
    //     this.r += c.r;
    //     this.i += c.i;
    //     return this;
    // }

    muls(s: number): C {
        this.r *= s;
        this.i *= s;
        return this;
    }

    // mul(c: C): C {
    //     const r = this.r * c.r - this.i * c.i;
    //     this.i = this.r * c.i + this.i * c.r;
    //     this.r = r;
    //     return this;
    // }

    plusProductOf(c1: C, c2: C): C {
        this.r += c1.r * c2.r - c1.i * c2.i;
        this.i += c1.r * c2.i + c1.i * c2.r;
        return this;
    }

    absSqer(): number {
        return this.r * this.r + this.i * this.i;
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
        return `${C.toDecimal(this.r)}${this.i > 0 ? '+' : ''}${this.iToString()}`;
    }
}
