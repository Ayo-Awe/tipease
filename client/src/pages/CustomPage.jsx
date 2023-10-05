import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePage from "../hooks/usePage";
import { Avatar, Button, Divider, Input, Textarea } from "@nextui-org/react";
import { HiCake, HiLink } from "react-icons/hi2";
import CircularSelectItem from "../components/CircularSelectItem";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTip from "../hooks/useTip";
import { nanoid } from "nanoid";
import { getHostUrl } from "../utils";

const formSchema = z.object({
  tokenCount: z.number().int().min(1).default(1),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email"),
  message: z
    .string()
    .optional()
    .transform((mes) => (mes === "" ? undefined : mes)),
});

const CustomPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = usePage(slug);
  const defaultTipValues = [1, 3, 5];
  const location = useLocation();
  const tipMutation = useTip(slug, {
    onSuccess: (link) => (window.location.href = link),
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { tokenCount: 1 },
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    // render 404
    return <div>404</div>;
  }

  function onSubmit(data) {
    const reference = nanoid(12);
    const redirectUrl = getHostUrl();
    console.log(redirectUrl);
    tipMutation.mutate({ ...data, reference, redirectUrl });
  }

  return (
    <div className="py-10 px-6">
      <div className="text-center py-4">
        <Avatar src={data.profileImage} className="m-auto w-32 h-32" />
        <p className="text-3xl font-bold mt-4">
          {data.user.lastName + " " + data.user.firstName}
        </p>
      </div>
      <Divider />
      <div className="grid md:grid-cols-7 grid-cols-1  my-6 max-w-4xl mx-auto  gap-8">
        <div className="md:col-span-4 border p-8 rounded-lg order-1 md:-order-none max-w-lg mx-auto w-full  h-fit">
          <p className="text-lg mb-8">{data.bio}</p>
          <a href={data.websiteUrl}>
            <HiLink className="text-2xl font-bold" />
          </a>
        </div>
        <div className="md:col-span-3 border rounded-lg p-8 max-w-lg mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6">
            Tip{" "}
            <span className="text-[#a1a1aa]">
              {data.user.lastName + " " + data.user.firstName}
            </span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 text-center border py-6 px-1 rounded-md">
              <HiCake className="inline-block text-3xl" />{" "}
              <span className="font-bold mx-2">X</span>
              {defaultTipValues.map((value) => (
                <CircularSelectItem
                  value={value}
                  isSelected={watch("tokenCount") === value}
                  onSelect={() =>
                    setValue("tokenCount", value, { shouldValidate: true })
                  }
                />
              ))}
              <input
                className="w-8 h-8 md:w-10 md:h-10 text-center mx-1 rounded-lg"
                type="number"
                min={1}
                max={1000}
                placeholder="5"
                {...register("tokenCount", { valueAsNumber: true })}
              />
            </div>
            <Input
              type="email"
              placeholder="hello@tipease.com"
              className="mb-2"
              {...register("email")}
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
            />

            <Textarea
              className="mb-4"
              placeholder="Say something nice (optional)"
              {...register("message")}
            />
            <Button
              color="primary"
              className="w-full rounded-2xl font-bold"
              type="submit"
              isDisabled={!isValid}
              isLoading={tipMutation.isLoading}
            >
              Support{" "}
              {Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: data.user.paymentCurrency.code,
              }).format(data.user.pricePerToken * (watch("tokenCount") || 1))}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
