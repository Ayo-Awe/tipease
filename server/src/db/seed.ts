import { Country, Currency } from "@prisma/client";
import client from ".";

async function main() {
  const currencyData: Omit<Currency, "id">[] = [
    { code: "KES", name: "Kenyan Shilling", minimumTipAmount: 100 },
    { code: "GHS", name: "Ghanian Cedi", minimumTipAmount: 10 },
    { code: "NGN", name: "Nigerian Naira", minimumTipAmount: 500 },
    { code: "USD", name: "US Dollar", minimumTipAmount: 1 },
  ];

  const countryData: Omit<Country, "id">[] = [
    { code: "NG", name: "Nigeria", currencyCode: "NGN" },
    { code: "GH", name: "Ghana", currencyCode: "GHS" },
    // { code: "ZA", name: "South Africa", currencyCode: "ZAR" },
    { code: "KE", name: "Kenya", currencyCode: "KES" },
  ];

  await client.currency.createMany({
    data: currencyData,
    skipDuplicates: true,
  });

  await client.country.createMany({
    data: countryData,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
