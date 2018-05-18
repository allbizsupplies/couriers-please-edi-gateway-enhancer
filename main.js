// web-ext

const ids = [
  'ezyfreight-consignment-parcels-form',
  'ezyfreight-consignment-address-parser',
]

for (let i = 0; i < ids.length; i++) {
  let oldElem = document.getElementById(ids[i])
  if (oldElem) oldElem.remove()
}

init(
  document.getElementById('consignmentForm'),
  document.getElementById('content')
)

/**
 * Hides the parts of the form we don't want the user to see
 * and adds the custom widgets.
 */
function init(form, content) {
  // Abort if consignment form was not found
  if (!form) return

  const hiddenRows = [
    // Consignment fields
    1, // Add to manifest
    2, // empty row
    3, // Consignment number
    // Delivery fields
    10, // Address selector
    15, // Save address
    // Parcel fields
    // 30, // Parcel price code 
    31, // Items
    32, // Barcodes
    //33, // Dangerous Goods
    34, // Weight
    35, // Volume
  ]

  // Set defaults for form inputs where
  // we can anticipate the user's input
  setDefaultValues(form, [
    { name: 'dg', value: 'Air', }
  ])

  // Get the table body
  let tbody = content.getElementsByTagName('tbody')[0]

  // // Attach the address parser
  // let addressParser = new AddressParser(form)
  // tbody.insertBefore(
  //   addressParser.build(),
  //   content.getElementsByTagName('tr')[11]
  // )

  // Add ParcelsForm
  let parcelsForm = new ParcelsForm(form)
  tbody.insertBefore(
    parcelsForm.build(),
    content.getElementsByTagName('tr')[36]
  )

  function handleServiceCodeChange(serviceCode) {
    if (serviceCode == 'L55') {
      parcelsForm.show()
      hideRows(content, hiddenRows, true)
    }
    else {
      parcelsForm.hide()
      hideRows(content, hiddenRows, false)
    }
  }
    
  // Hide/show ParcelsForm depending on value of service code.
  form['xx_pricecode'].onchange = (e) => {
    const serviceCode = e.target.value
    handleServiceCodeChange(serviceCode)
  }

  handleServiceCodeChange(
    form['xx_pricecode'].value
  )
}

/**
 * Hides the table rows given by
 * their position in the table
 */
function hideRows(content, indices, hide) {
  // get the table rows
  rows = content.getElementsByTagName('tr')

  // hide the rows we don't want to use
  for (var i = 0; i < indices.length; i++) {
    display = hide ? 'none' : 'table-row'
    rows[indices[i]].style.display = display
    // For debugging
    //bgColor = hide ? 'darkgrey' : 'transparent'
    //rows[indices[i]].style.backgroundColor = bgColor
  }
}

/**
 * Sets default form values
 */
function setDefaultValues(form, defaults) {
  // set form values
  for (var i = 0; i < defaults.length; i++) {
    form.elements[defaults[i].name].value = defaults[i].value
  }
}