import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "egp", standalone: false })
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return "";
    return `EGP ${value.toLocaleString("en-EG")}`;
  }
}