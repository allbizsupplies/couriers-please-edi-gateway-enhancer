document.body.style.border = "5px solid red";

const CALCULATED_TEXT_INPUTS = [
  "cd_items",
  "cd_deadweight",
  "cd_volume",
  "cd_dimension0",
  "cd_dimension1",
  "cd_dimension2",
];
const PARCEL_SERVICE_CODE = "L55";

const removeGeneratedElements = () => {
  const generatedElementIds = [
    "ezyfreight-consignment-parcels-form",
    "ezyfreight-consignment-satchels-form",
  ];

  for (let id of generatedElementIds) {
    let element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  }
};

const getTableRowFor = (id) =>
  document.getElementById(id).parentElement.parentElement;

const disableCalculatedTextInputs = (form) => {
  CALCULATED_TEXT_INPUTS.forEach((name) => {
    const element = form[name];
    element.setAttribute("readonly", true);
    element.setAttribute("style", "background-color: silver");
  });
};

const enableCalculatedTextInputs = () => {
  CALCULATED_TEXT_INPUTS.forEach((id) => {
    const element = document.getElementById(id);
    element.removeAttribute("readonly");
    element.setAttribute("style", "");
  });
};

const hideTableRowFor = (id) => {
  const tableRow = getTableRowFor(id);
  tableRow.setAttribute("style", "display:none;");
};

const showTableRowFor = (id) => {
  const tableRow = getTableRowFor(id);
  tableRow.setAttribute("style", "");
};

(() => {
  const form = document.getElementById("consignmentForm");
  const content = document.getElementById("content");
  if (form === null) {
    return;
  }

  // Remove elements we may have generated previously.
  removeGeneratedElements();

  // Disable inputs we're setting programmatically.
  disableCalculatedTextInputs(form);
  // Hide volume calculator button.
  document.querySelector(`input[value="Calculate ->"]`).remove();

  // Add ParcelsForm and SatchelsForm.
  const tbody = content.getElementsByTagName("tbody")[0];
  const parcelsForm = new ParcelsForm(form);
  const satchelsForm = new SatchelsForm(form);
  tbody.insertBefore(parcelsForm.build(), getTableRowFor("cd_items"));
  tbody.insertBefore(satchelsForm.build(), getTableRowFor("cd_items"));

  // Hide/show forms depending on value of service code.
  const handleServiceCodeChange = (serviceCode) => {
    if (serviceCode === PARCEL_SERVICE_CODE) {
      satchelsForm.hide();
      parcelsForm.show();
    } else {
      parcelsForm.hide();
      satchelsForm.show();
    }
  };

  form["xx_pricecode"].onchange = (event) => {
    handleServiceCodeChange(event.target.value);
  };

  handleServiceCodeChange(form["xx_pricecode"].value);

  // Mark goods for air transport.
  document.getElementById("dgAir").checked = true;
})();
