import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Address } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-address-card",
  standalone: false,
  templateUrl: "./address-card.html",
  styleUrls: ["./address-card.scss"],
})
export class AddressCard {
  @Input() address!: Address;
  @Output() edit = new EventEmitter<Address>();
  @Output() delete = new EventEmitter<string>();
  @Output() setDefault = new EventEmitter<string>();
}
