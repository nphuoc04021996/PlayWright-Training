import { Utils } from "./utils";

export class StringHelper {
  public static compareProductName(actual: string, expected: string): boolean {
    let normalizedActual = Utils.normalize(actual).toLowerCase();
    let normalizedExpected = Utils.normalize(expected).toLowerCase();

    normalizedActual = normalizedActual.replace(/×\s*\d+$/, '').trim();

    return normalizedActual == normalizedExpected;
  }

  public static extractTotal(total: string): string {
    const match = total.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/);
    return match ? match[0] : '';
  }
}