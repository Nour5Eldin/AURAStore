import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Address } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-address-selector",
  standalone: false,
  templateUrl: "./address-selector.html",
  styleUrls: ["./address-selector.scss"],
})
export class AddressSelector {
  @Input() addresses: Address[] = [];
  @Input() selectedId = "";
  @Output() select = new EventEmitter<string>();
}
