export class Utils {
    static eventTargetValue(event: Event): string {
        return (event.target as unknown as ({ value: string })).value;
    }
}
