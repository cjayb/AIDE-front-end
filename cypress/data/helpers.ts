export class Helpers {
    public static capitaliseWord(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    public static getSuccessRate(executions: number, failures: number): string {
        const result = (100 * (executions - failures)) / executions;
        if (Number.isNaN(result)) {
            return 0 + " %";
        } else {
            return result.toFixed(0) + " %";
        }
    }

    public static getTimeFormat(time: number): number {
        const minutes = Math.floor(time / 60);
        return minutes;
    }

    public static getDateFormat(date: Date): string {
        const d = new Date(date);
        return d.toLocaleDateString("en-GB");
    }
}
