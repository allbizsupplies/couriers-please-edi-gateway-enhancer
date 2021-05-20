class ParcelsForm {
  constructor(consignmentForm) {
    this.consignmentForm = consignmentForm;

    this.totalQtyField = this.consignmentForm["cd_items"];
    this.totalWeightField = this.consignmentForm["cd_deadweight"];
    this.totalVolField = this.consignmentForm["cd_volume"];
  }

  build() {
    const id = "ezyfreight-consignment-parcels-form";
    // Create wrapper.
    this.wrapper = document.createElement("tr");
    this.wrapper.id = id;

    // Add label column.
    let labelColumn = document.createElement("th");
    let label = document.createElement("label");
    label.innerHTML = "Parcels:";
    labelColumn.appendChild(label);
    this.wrapper.appendChild(labelColumn);

    // Add form column.
    let formColumn = document.createElement("td");
    this.wrapper.appendChild(formColumn);

    // Add item container.
    this.itemContainer = document.createElement("div");
    formColumn.appendChild(this.itemContainer);

    // Add item.
    this.items = [];
    this.nextItemId = 0;
    this.addItem();

    // Add actions container.
    let actionsContainer = document.createElement("div");
    formColumn.appendChild(actionsContainer);

    // Add "add item" button.
    let action = new ParcelsFormAction({
      onClick: () => {
        this.addItem();
      },
    });
    actionsContainer.appendChild(action.build());

    return this.wrapper;
  }

  addItem() {
    const item = new ParcelsFormItem(this.nextItemId, {
      onChange: () => {
        this.updateTotals();
      },
      remove: (id) => {
        this.removeItem(id);
      },
    });
    this.itemContainer.appendChild(item.build());
    this.items.push(item);
    this.nextItemId++;
  }

  removeItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        this.items[i].remove();
        this.items.splice(i, 1);
        break;
      }
    }

    if (this.items.length == 0) this.addItem();

    updateTotals();
  }

  updateTotals() {
    let totalQty = 0;
    let totalWeight = 0;
    let totalVolume = 0;

    for (let i = 0; i < this.items.length; i++) {
      totalQty += this.items[i].getQuantity();
      totalWeight += this.items[i].getWeight();
      totalVolume += this.items[i].getVolume();
    }
    
    this.totalQtyField.value = totalQty || "";
    this.totalWeightField.value = totalWeight || "";
    this.totalVolField.value = totalVolume || "";
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

class ParcelsFormItem {
  constructor(id, props) {
    this.id = id;
    this.props = props;

    this.presets = [
      { label: "A4 Box", w: 23, d: 32, h: 25 },
      { label: "A3 Box", w: 45, d: 31, h: 17 },
      { label: "Label Box", w: 23, d: 32, h: 2 },
    ];
  }

  build() {
    // Create wrapper.
    this.wrapper = document.createElement("div");

    // Add top row.
    let topRow = document.createElement("p");
    this.wrapper.appendChild(topRow);

    // Add preset selector to top row.
    topRow.appendChild(this.buildPresetSelector(this.presets));

    // Add a times symbol after the preset selector.
    topRow.appendChild(document.createTextNode(" x "));

    // Add quantity field to top row.
    this.qtyField = this.buildIntegerField();
    this.qtyField.placeholder = "Qty";
    this.qtyField.value = 1;
    topRow.appendChild(this.qtyField);

    // Add a space after the qty field.
    topRow.appendChild(document.createTextNode(" "));

    // Add remove button to top row
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Remove this item";
    button.onclick = () => {
      this.props.remove(this.id);
    };
    topRow.appendChild(button);

    // Add bottom row.
    let bottomRow = document.createElement("p");
    this.wrapper.appendChild(bottomRow);

    // Add dimensions fields to bottom row.
    this.dimFields = [];
    for (let i = 0; i < 3; i++) {
      let field = this.buildIntegerField();
      bottomRow.appendChild(field);
      this.dimFields.push(field);

      if (i < 2) bottomRow.appendChild(document.createTextNode(" x "));
      else bottomRow.appendChild(document.createTextNode(" cm "));
    }

    // Add weight field to bottom row.
    this.weightField = this.buildIntegerField();
    bottomRow.appendChild(this.weightField);

    bottomRow.appendChild(document.createTextNode(" kg (per item)"));

    // apply the first preset
    this.applyPreset(1);

    return this.wrapper;
  }

  buildIntegerField() {
    let field = document.createElement("input");
    field.type = "text";
    field.size = 3;
    field.onchange = () => {
      this.props.onChange();
    };
    return field;
  }

  buildPresetSelector(presets) {
    // Add parcel preset selector.
    let presetSelector = document.createElement("select");
    presetSelector.onchange = (e) => {
      this.applyPreset(e.target.value);
      this.props.onChange();
    };

    // Attach options to select list.
    for (let i = 0; i < presets.length; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = presets[i].label;
      presetSelector.appendChild(option);
    }

    // Add custom option to select list.
    let defOption = document.createElement("option");
    defOption.value = -1;
    defOption.text = "Custom size";
    presetSelector.appendChild(defOption);

    return presetSelector;
  }

  remove() {
    this.wrapper.remove();
  }

  applyPreset(id) {
    if (id >= 0) {
      // Set dimension values.
      this.dimFields[0].value = this.presets[id].w;
      this.dimFields[1].value = this.presets[id].d;
      this.dimFields[2].value = this.presets[id].h;
    }

    const readOnly = id >= 0;
    for (let i = 0; i < 3; i++) {
      this.dimFields[i].readOnly = readOnly;

      if (readOnly) this.dimFields[i].style.color = "grey";
      else this.dimFields[i].style.color = "inherit";
    }
  }

  getQuantity() {
    const quantity = parseInt(this.qtyField.value);
    return quantity || 0;
  }

  getDim(index) {
    const value = this.dimFields[index].value;
    if (!value || isNaN(value)) {
      return 0;
    }
    return parseInt(value);
  }

  getVolume() {
    let volume = 1;
    for (let i = 0; i < 3; i++) {
      const dim = this.getDim(i);
      volume = (volume * dim) / 100;
    }
    const totalVolume = volume * this.getQuantity();
    return parseFloat(totalVolume.toFixed(3));
  }

  getWeight() {
    const weight = parseInt(this.weightField.value);
    if (!weight || isNaN(weight)) {
      return 0;
    }
    const totalWeight = weight * this.getQuantity();
    return parseInt(totalWeight);
  }
}

class ParcelsFormAction {
  constructor(props) {
    this.props = props;
  }

  build() {
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Add another item";
    button.onclick = () => {
      this.props.onClick();
    };

    return button;
  }
}
