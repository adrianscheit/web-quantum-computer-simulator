export class C {
    constructor(public re: number = 0, public im: number = 0) { }

    new(): C {
        return new C(this.re, this.im);
    }

    plus(c: C): C {
        this.re += c.re;
        this.im += c.im;
        return this;
    }

    absSqer(): number {
        return this.re * this.re + this.im * this.im;
    }

    mul(c: C): C {
        const r = this.re * c.re - this.im * c.im;
        this.im = this.re * c.im + this.im * c.re;
        this.re = r;
        return this;
    }

    private static toDecimal(v: number): string {
        return `${Math.round(v * 1000) / 1000}`;
    }

    toString(): string {
        return `${C.toDecimal(this.re)}${this.im === 0 ? '' : this.im === 1 ? '+i' : this.im === -1 ? '-i' : `${this.im > 0 ? '+':''}${C.toDecimal(this.im)}i`}`;
    }
}
