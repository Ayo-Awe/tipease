import { Button, Select, SelectItem, Input, Card } from "@nextui-org/react";
import { useEffect } from "react";
import useBanks from "../hooks/useBanks";
import useCurrencies from "../hooks/useCurrencies";
import useResolveBankAccount from "../hooks/useResolveBankAccount";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useConnectAccount from "../hooks/useConnectAccount";

const formSchema = z.object({
  currency: z.string({
    required_error: "Please select a currency",
  }),
  bankCode: z.string({
    required_error: "Please selected a bank",
  }),
  accountNumber: z.string({
    required_error: "Please provide an account number",
  }),
});

const ConnectAccountForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const currencies = useCurrencies();
  const banks = useBanks({ currency: watch("currency") });
  const resolveAccount = useResolveBankAccount();
  const connectAccount = useConnectAccount();

  useEffect(() => {
    const { unsubscribe } = watch((data, { name, type }) => {
      const refetch =
        (name === "bankCode" || name === "currency") && data.accountNumber;
      if (refetch) {
        resolveAccount.mutate(data);
      }
    });

    return () => unsubscribe();
  }, [watch]);

  return (
    <>
      <div className="max-w-xs md:max-w-sm m-auto py-8">
        <h2 className="text-center font-semibold mb-10 text-2xl">
          How would you like to get paid?
        </h2>

        <form onSubmit={handleSubmit(connectAccount.mutate)}>
          <Select
            label="Choose your currency"
            labelPlacement="outside"
            placeholder=" "
            className="my-4"
            errorMessage={errors.currency?.message}
            isInvalid={!!errors.currency}
            isLoading={currencies.isLoading}
            {...register("currency")}
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
            errorMessage={errors.bankCode?.message}
            isInvalid={!!errors.bankCode}
            isLoading={banks.isLoading}
            {...register("bankCode")}
          >
            {banks.data?.map((bank) => (
              <SelectItem key={bank.code} value={bank.code}>
                {bank.name}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Bank account number"
            variant="flat"
            className="my-4"
            labelPlacement="outside"
            placeholder="0123456789"
            errorMessage={errors.accountNumber?.message}
            isInvalid={!!errors.accountNumber}
            {...register("accountNumber")}
            onFocusChange={(isFocused) => {
              if (!isFocused) {
                const [accountNumber, bankCode] = getValues([
                  "accountNumber",
                  "bankCode",
                ]);
                resolveAccount.mutate({
                  accountNumber,
                  bankCode,
                });
              }
            }}
          />

          {!resolveAccount.isIdle && (
            <Card className="py-6 my-4">
              {resolveAccount.data && (
                <p className="text-center font-bold">
                  {resolveAccount.data.accountName}
                </p>
              )}
              {resolveAccount.error && (
                <p className="text-center font-bold text-red-500">
                  Couldn't resolve account
                </p>
              )}
            </Card>
          )}

          <Button
            className="w-full"
            color="primary"
            type="submit"
            isDisabled={!resolveAccount.isSuccess}
          >
            Continue
          </Button>
        </form>
      </div>
    </>
  );
};

export default ConnectAccountForm;
