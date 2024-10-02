export const inventoryTypes = [
  { value: "TSHIRT", label: "T-Shirt" },
  { value: "SHIRT", label: "Shirt" },
  { value: "PANTS", label: "Pants" },
  { value: "JACKET", label: "Jacket" },
  { value: "SWEATER", label: "Sweater" },
  { value: "DRESS", label: "Dress" },
  { value: "SKIRT", label: "Skirt" },
  { value: "SHORTS", label: "Shorts" },
  { value: "HOODIE", label: "Hoodie" },
  { value: "SUIT", label: "Suit" },
  { value: "COAT", label: "Coat" },
  { value: "UNDERWEAR", label: "Underwear" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "SHOES", label: "Shoes" },
];

export const sizes = [
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
  { value: "O", label: "One-size" },
];

export const status = [
  { value: "P", label: "Paid" },
  { value: "R", label: "Refund" },
  { value: "U", label: "Unpaid" },
];

export function DateConverter(timestamp) {
  const date = new Date(timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const brisbaneTimeOffset = 10 * 60;
  const brisbaneDate = new Date(
    date.getTime() + brisbaneTimeOffset * 60 * 1000
  );

  const day = brisbaneDate.getUTCDate();
  const month = brisbaneDate.getUTCMonth();
  const year = brisbaneDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function DateConverterWithBrisbaneTime(timestamp) {
  const date = new Date(timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const brisbaneTimeOffset = 10 * 60;
  const brisbaneDate = new Date(
    date.getTime() + brisbaneTimeOffset * 60 * 1000
  );

  const day = brisbaneDate.getUTCDate();
  const month = brisbaneDate.getUTCMonth();
  const year = brisbaneDate.getUTCFullYear();

  const hours = String(brisbaneDate.getUTCHours()).padStart(2, "0");
  const minutes = String(brisbaneDate.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
