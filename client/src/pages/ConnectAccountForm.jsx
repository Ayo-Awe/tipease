import { Button, Select, SelectItem, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AccountVerificationCard from "../components/AccountVerificationCard";
import useBanks from "../hooks/useBanks";
import useCurrencies from "../hooks/useCurrencies";

const ConnectAccountForm = () => {
  const currencies = useCurrencies();
  const banks = useBanks();
  const resolvedAccount = {
    accountNumber: "0123456789",
    accountName: "BOLU AJIBADE",
  };

  useEffect(() => console.log(currencies.data), [currencies.data]);

  return (
    <>
      <div className="max-w-xs md:max-w-sm m-auto py-8">
        <h2 className="text-center font-semibold mb-10 text-2xl">
          How would you like to get paid?
        </h2>

        {/* <AccountVerificationCard {...resolvedAccount} /> */}

        <Select
          label="Choose your currency"
          labelPlacement="outside"
          placeholder=" "
          className="my-4"
          isLoading={currencies.isLoading}
        >
          {currencies.data?.map((currency) => (
            <SelectItem key={currency.id} value={currency.name}>
              {currency.code.toUpperCase() + " - " + currency.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Select a bank"
          labelPlacement="outside"
          placeholder=" "
          className="my-4"
          isLoading={banks.isLoading}
        >
          {banks.data?.map((bank) => (
            <SelectItem key={bank.id} value={bank.code}>
              {bank.name}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="url"
          label="Bank account number"
          variant="flat"
          className="my-4"
          labelPlacement="outside"
          placeholder="0123456789"
        />

        <Button className="w-full" color="primary">
          Continue
        </Button>
      </div>
    </>
  );
};

export default ConnectAccountForm;
