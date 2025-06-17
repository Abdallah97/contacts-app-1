export interface Contact {
  id: string,
  icon:string,
  firstName: string,
  lastName: string,
  dateOfBirth: Date | null,
  favoritesRanking: number | null,
  personal: boolean,
  phones: Phone[],
  addresses: Address[],
  notes: string ,
}

export interface Phone {
  phoneNumber: string,
  phoneType: string,
  preferred: boolean,
}

export interface Address {
  streetAddress: string,
  city: string,
  state: string,
  postalCode: string,
  addressType: string,
}

export const phoneValueTypes = [{
  value:"mobile",
  label: "Mobile"
},{
  value:"work",
  label: "Work",
},{
  value:"other",
  label: "Other"
}];

export const addressValueTypes = [{
  value:"home",
  label: "Home"
},{
  value:"work",
  label: "Work",
},{
  value:"other",
  label: "Other"
}];

