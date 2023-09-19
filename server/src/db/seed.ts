import { Currency } from "@prisma/client";
import client from ".";

async function main() {
  const currencyData: Omit<Currency, "id">[] = [
    {
      code: "KES",
      name: "Kenyan Shilling",
      defaultTipAmount: 100,
      allowedTipAmounts: [100, 200, 300, 400, 500],
      country: "Kenya",
      countryCode: "KE",
    },
    {
      code: "GHS",
      name: "Ghanian Cedi",
      defaultTipAmount: 10,
      allowedTipAmounts: [10, 20, 30, 40, 50],
      country: "Ghana",
      countryCode: "GH",
    },
    {
      code: "NGN",
      name: "Nigerian Naira",
      defaultTipAmount: 500,
      allowedTipAmounts: [500, 1000, 1500, 2000, 2500],
      country: "Nigeria",
      countryCode: "NG",
    },
    // { code: "USD", name: "US Dollar", minimumTipAmount: 1 },
  ];

  await client.currency.createMany({
    data: currencyData,
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
