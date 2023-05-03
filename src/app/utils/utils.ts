export class Utils {
    static eventTargetValue(event: Event): string {
        return (event.target as any).value;
    }
}
