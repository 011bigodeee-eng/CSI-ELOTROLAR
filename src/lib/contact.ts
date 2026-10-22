/** Official public contact details supplied by the store owner. */
export const storeContact = {
  whatsappNumber: "5516997797959",
  phoneDisplay: "(16) 99779-7959",
  street: "Pedro Speranza, 73",
  city: "Dourado — São Paulo",
  postcode: "13593-062",
} as const;
export const storeWhatsappUrl = `https://wa.me/${storeContact.whatsappNumber}?text=${encodeURIComponent("Olá, C.S.I. EletroLar! Gostaria de conversar sobre meu projeto.")}`;
export const storeMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${storeContact.street}, Dourado, São Paulo, ${storeContact.postcode}`)}`;
