import { Button, Input, Textarea } from "@nextui-org/react";
import AvatarInput from "../components/AvatarInput";

const CreatePageForm = () => {
  return (
    <>
      <div className="max-w-xs md:max-w-sm m-auto py-8">
        <h2 className="text-center font-semibold mb-10 text-2xl">
          Complete Your Page
        </h2>

        <div className=" mb-8">
          <AvatarInput className="m-auto w-28 h-28" />
          <h2 className="text-center font-semibold mt-4">Add Photo</h2>
        </div>

        <Input
          label="FirstName"
          variant="flat"
          className="my-4"
          labelPlacement="outside"
          placeholder="Enter your firstname"
        />
        <Input
          label="LastName"
          variant="flat"
          className="my-4"
          labelPlacement="outside"
          placeholder="Enter your lastname"
        />
        <Input
          label="Tipease link"
          variant="flat"
          className="my-4"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">tipease.live/</span>
            </div>
          }
        />
        <Textarea
          label="About"
          labelPlacement="outside"
          className="my-4"
          placeholder="Hi 👋 I just created a page here. You can now tip me!!!"
        />
        <Input
          type="url"
          label="Website or social link"
          variant="flat"
          className="my-4"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">https://</span>
            </div>
          }
        />
        <Button className="w-full" color="primary">
          Continue
        </Button>
      </div>
    </>
  );
};

export default CreatePageForm;
