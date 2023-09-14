import { Currency } from "@prisma/client";
import client from ".";

async function main() {
  const currencyData: Omit<Currency, "id">[] = [
    { code: "KES", name: "Kenyan Shilling", minimumTipAmount: 100 },
    { code: "GHS", name: "Ghanian Cedi", minimumTipAmount: 10 },
    { code: "NGN", name: "Nigerian Naira", minimumTipAmount: 500 },
    { code: "USD", name: "US Dollar", minimumTipAmount: 1 },
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
