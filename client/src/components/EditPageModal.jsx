import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import AvatarInput from "./AvatarInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserPage from "../hooks/useUserPage";
import useEditPage from "../hooks/useEditPage";
import toast from "react-hot-toast";

const formSchema = z.object({
  about: z
    .string({
      invalid_type_error: "About must be a string",
      required_error: "About is required",
    })
    .nonempty()
    .optional(),
  websiteUrl: z
    .string({
      invalid_type_error: "Please provide a valid url",
    })
    .url("Please provide a valid url")
    .optional(),
  profileImage: z
    .custom((v) => v[0] === undefined || v[0] instanceof File, {
      message: "Profile image is required",
    })
    .optional()
    .transform((v) => v[0]),
});

const EditPageModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: page } = useUserPage();
  const mutation = useEditPage({
    onSuccess: () => {
      toast.success("Page saved successfully");
      onClose();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data) {
    const formdata = new FormData();
    formdata.append("profile", data.profileImage);
    formdata.append("bio", data.about);
    formdata.append("websiteUrl", data.websiteUrl);
    mutation.mutate(formdata);
  }

  if (!page) {
    return null;
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Edit Page
              </ModalHeader>
              <ModalBody>
                <AvatarInput
                  src={page.profileImage}
                  className="m-auto w-28 h-28"
                  errorMessage={errors.profileImage?.message}
                  {...register("profileImage")}
                />
                <Textarea
                  label="About"
                  labelPlacement="outside"
                  className="my-4"
                  placeholder="Hi 👋 I just created a page here. You can now tip me!!!"
                  errorMessage={errors.about?.message}
                  isInvalid={!!errors.about}
                  {...register("about", { value: page.bio })}
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
                  {...register("websiteUrl", {
                    required: true,
                    value: page.websiteUrl,
                  })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={mutation.isLoading}
                >
                  Save
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPageModal;
