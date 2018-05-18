
class AddressParser {
  constructor(consignmentForm) {
    this.consignmentForm = consignmentForm

    this.streetAddressFields = [
      this.consignmentForm['cd_delivery_addr1'],
      this.consignmentForm['cd_delivery_addr2'],
      this.consignmentForm['cd_delivery_addr3'],
    ]

    this.suburbSearchField = this.consignmentForm['delivery_subsearch']
    this.suburbSearchButton = this.consignmentForm['delivery_subsearch_button']
  }

  build() {
    const id = 'ezyfreight-consignment-address-parser'
    // Create wrapper.
    this.wrapper = document.createElement('tr')
    this.wrapper.id = id

    // Add label column.
    let labelColumn = document.createElement('th')
    let label = document.createElement('label')
    label.innerHTML = 'Filemaker address:'
    labelColumn.appendChild(label)
    this.wrapper.appendChild(labelColumn)

    // Add form column.
    let formColumn = document.createElement('td')
    this.wrapper.appendChild(formColumn)

    // Add address field
    this.addressField = document.createElement('input')
    this.addressField.type = 'text'
    this.addressField.size = 60
    this.addressField.onchange = (e) => {
      const input = e.target.value

      if (!input)
        return
       
      const lines = e.target.value.split(";")

      // Clear previously-set street address values.
      for (let i = 0; i < 3; i++) {
        this.streetAddressFields[i].value = ''
      }

      // Apply new street address values.
      let streetAddress = lines[0].split(",", 2)
      for (let i = 0; i < streetAddress.length; i++) {
        this.streetAddressFields[i].value = streetAddress[i]
      }

      // Clear previously-set suburb
      this.suburbSearchField.value = ''

      // Separate the locality into components
      const localityComps = lines[1].split(" ")
      let suburbComps = []

      // Remove state and postcode
      for (let i = 0; i < localityComps.length; i++) {
        let comp = localityComps[i].toUpperCase()

        // Ignore this component if it's a state or postcode.
        const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]
        if (!( states.indexOf(comp) > 0 || /\d{4}/.test(comp) ))
          suburbComps.push(comp)
      }

      // Reassemble the remaining locality components
      // and apply to suburb search field. 
      const suburb = suburbComps.join(" ")
      this.suburbSearchField.value = suburb

      this.suburbSearchButton.click()

      // erase pasted address
      e.target.value = ''
    }
    formColumn.appendChild(this.addressField)

    return this.wrapper
  }
}