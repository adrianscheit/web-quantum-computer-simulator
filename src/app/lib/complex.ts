export class Complex {
    constructor(public re: number, public im: number = 0.0) { }
    new(): Complex {
        return new Complex(this.re, this.im);
    }

    plus(c: Complex): Complex {
        this.re += c.re;
        this.im += c.im;
        return this;
    }

    absSqr(): number {
        return this.re * this.re + this.im * this.im;
    }
}
