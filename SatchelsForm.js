class SatchelsForm {
  constructor(consignmentForm) {
    this.consignmentForm = consignmentForm;

    this.totalQtyField = this.consignmentForm["cd_items"];
    this.totalWeightField = this.consignmentForm["cd_deadweight"];
    this.totalVolField = this.consignmentForm["cd_volume"];
    this.serviceCode = this.consignmentForm["xx_pricecode"];

    // Weights are defined in grams and volumes are defined in cubic centimetres
    // so that numbers are integers.
    this.satchelSizes = {
      Y0A: { weight: 500, volume: 2000 },
      Y1A: { weight: 1000, volume: 4000 },
      Y3A: { weight: 3000, volume: 12000 },
      Y5A: { weight: 5000, volume: 20000 },
    };
  }

  build() {
    const id = "ezyfreight-consignment-satchels-form";
    // Create wrapper.
    this.wrapper = document.createElement("tr");
    this.wrapper.id = id;

    // Add label column.
    const labelColumn = document.createElement("th");
    const label = document.createElement("label");
    label.innerHTML = "Satchels:";
    labelColumn.appendChild(label);
    this.wrapper.appendChild(labelColumn);

    // Add quantity field.
    this.quantityField = document.createElement("input");
    this.quantityField.type = "number";
    this.quantityField.size = 3;
    this.quantityField.min = 1;
    this.quantityField.value = 1;
    this.quantityField.onchange = (event) => {
      this.updateTotals();
    };

    // Add form column.
    const formColumn = document.createElement("td");
    formColumn.appendChild(this.quantityField);
    this.wrapper.appendChild(formColumn);

    return this.wrapper;
  }

  getSatchelSize() {
    return this.satchelSizes[this.serviceCode.value];
  }

  getQuantity() {
    const value = this.quantityField.value;
    return value ? parseInt(value) : 0;
  }

  getTotalWeight() {
    const quantity = this.getQuantity();
    const satchelSize = this.getSatchelSize();
    const totalWeight = (satchelSize.weight * quantity) / 1000;
    return totalWeight >= 1 ? totalWeight.toFixed(0) : totalWeight > 0 ? 1 : "";
  }

  getTotalVolume() {
    const quantity = this.getQuantity();
    const satchelSize = this.getSatchelSize();
    const totalVolume = (satchelSize.volume * quantity) / (100 * 100 * 100);
    return totalVolume > 0 ? totalVolume.toFixed(3) : "";
  }

  updateTotals() {
    this.totalQtyField.value = this.getQuantity();
    this.totalWeightField.value = this.getTotalWeight();
    this.totalVolField.value = this.getTotalVolume();
  }

  hide() {
    this.wrapper.style.display = "none";
    this.totalQtyField.value = "";
    this.totalWeightField.value = "";
    this.totalVolField.value = "";
  }

  show() {
    this.wrapper.style.display = "table-row";
    this.updateTotals();
  }
}
