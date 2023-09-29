import { Button, Select, SelectItem, Input, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AccountVerificationCard from "../components/AccountVerificationCard";
import useBanks from "../hooks/useBanks";
import useCurrencies from "../hooks/useCurrencies";
import useResolveBankAccount from "../hooks/useResolveBankAccount";
import { useAuth } from "@clerk/clerk-react";

const ConnectAccountForm = () => {
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [selectedBank, setSelectedBank] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const currencies = useCurrencies();
  const banks = useBanks(selectedCurrency?.country);
  const resolveAccount = useResolveBankAccount();

  return (
    <>
      <div className="max-w-xs md:max-w-sm m-auto py-8">
        <h2 className="text-center font-semibold mb-10 text-2xl">
          How would you like to get paid?
        </h2>

        <Select
          label="Choose your currency"
          labelPlacement="outside"
          placeholder=" "
          className="my-4"
          isLoading={currencies.isLoading}
          onChange={(e) => {
            setSelectedCurrency(
              currencies.data.find((curr) => curr.code === e.target.value)
            );
          }}
        >
          {currencies.data?.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
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
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          {banks.data?.map((bank) => (
            <SelectItem key={bank.code} value={bank.code}>
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
          onChange={(e) => {
            setAccountNumber(e.target.value);
            console.log(e.target.value);
            resolveAccount.mutate({
              accountNumber: e.target.value,
              bankCode: selectedBank,
            });
          }}
        />

        {resolveAccount.data && (
          <AccountVerificationCard {...resolveAccount.data} />
        )}

        <Button className="w-full" color="primary">
          Continue
        </Button>
      </div>
    </>
  );
};

export default ConnectAccountForm;
