export class Utils {
    private static numbers: number[] = [];

    public static generateRandomNumber(maxNumber: number): number {
        return Math.floor(Math.random() * maxNumber);
} 

    public static normalize(text: string): string { return text.replace(/\s+/g, ' ').trim(); } 

    public static normalizePrice(price: string): string { return price.replace(/\s/g, ''); }

    public static convertJsonDataToObject<T>(data: any): T {
        return data as T;
    }
}