import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import AvatarInput from "../components/AvatarInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSlug from "../hooks/useSlug";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import useCreatePage from "../hooks/useCreatePage";
import { useNavigate } from "react-router-dom";
import useUserPage from "../hooks/useUserPage";
import { useEffect } from "react";

const formSchema = z.object({
  tipeaseLink: z
    .string({
      invalid_type_error: "Must be a string",
      required_error: "Required",
    })
    .regex(/^[\w-]+$/, "Must contain only the characters a-z, A-Z, 0-9, _, -")
    .min(4, "Must be at least 4 characters"),
  about: z
    .string({
      invalid_type_error: "About must be a string",
      required_error: "About is required",
    })
    .nonempty(),
  websiteUrl: z
    .string({
      invalid_type_error: "Please provide a valid url",
    })
    .url("Please provide a valid url"),

  profileImage: z
    .custom((v) => v[0] instanceof File, {
      message: "Profile image is required",
    })
    .transform((v) => v[0]),
});

const CreatePageForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { isLoading, data: isAvailable } = useSlug(watch("tipeaseLink"));
  const { isLoading: isSubmitting, mutate } = useCreatePage();
  const { data: page } = useUserPage();
  const navigate = useNavigate();

  useEffect(() => {
    if (page) {
      navigate("/dashboard");
    }
  }, [page]);

  function onSubmit(data) {
    const formdata = new FormData();
    formdata.append("profile", data.profileImage);
    formdata.append("slug", data.tipeaseLink);
    formdata.append("bio", data.about);
    formdata.append("websiteUrl", data.websiteUrl);
    mutate(formdata);
  }

  useEffect(() => console.log(errors), [errors]);

  return (
    <>
      <div className="max-w-xs md:max-w-sm m-auto py-8">
        <h2 className="text-center font-semibold mb-10 text-2xl">
          Complete Your Page
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" mb-8">
            <AvatarInput
              className="m-auto w-28 h-28"
              errorMessage={errors.profileImage?.message}
              {...register("profileImage")}
            />
            <h2 className="text-center font-semibold mt-4">Add Photo</h2>
          </div>

          <Input
            label="Tipease link"
            variant="flat"
            className="my-4"
            labelPlacement="outside"
            errorMessage={errors.tipeaseLink?.message}
            isInvalid={!!errors.tipeaseLink}
            {...register("tipeaseLink")}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">
                  tipease.live/
                </span>
              </div>
            }
            endContent={
              isLoading ? (
                <Spinner />
              ) : isAvailable ? (
                <HiCheckCircle className={`text-green-400 text-2xl`} />
              ) : (
                <HiXCircle className="text-red-400 text-2xl" />
              )
            }
          />
          <Textarea
            label="About"
            labelPlacement="outside"
            className="my-4"
            placeholder="Hi 👋 I just created a page here. You can now tip me!!!"
            errorMessage={errors.about?.message}
            isInvalid={!!errors.about}
            {...register("about")}
          />
          <Input
            type="url"
            label="Website or social link"
            variant="flat"
            className="my-4"
            labelPlacement="outside"
            placeholder="https://example.com"
            errorMessage={errors.websiteUrl?.message}
            isInvalid={!!errors.websiteUrl}
            {...register("websiteUrl", { required: true })}
          />
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isAvailable}
          >
            Continue
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreatePageForm;
