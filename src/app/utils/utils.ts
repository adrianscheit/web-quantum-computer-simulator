export class Utils {
    static eventTargetValue(event: Event): string {
        return (event.target as unknown as ({ value: string })).value;
    }

    static getIndexes(length: number): number[] {
        return Array(length).fill(0).map((_, index) => index);
    }
}
