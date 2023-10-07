import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {
  HiCheckCircle,
  HiCurrencyDollar,
  HiHeart,
  HiXCircle,
} from "react-icons/hi2";
import CircularSelectItem from "../components/CircularSelectItem";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";

const Settings = () => {
  const user = useUser();
  return (
    <>
      <div className="border rounded-xl mb-8 p-4">
        <h2 className="font-semibold text-xl mb-2">Connect Account</h2>
        <p className="text-[#a1a1aa] mb-4">Choose how you'd like to get paid</p>

        {user.data?.activatedAt && (
          <Card className="max-w-xs p-4">
            <h2 className="font-semibold text-xl">{user.data?.bankName}</h2>
            <p className="text-[#a1a1aa]">{user.data?.accountNumber}</p>
          </Card>
        )}

        {user.data && !user.data.activatedAt && (
          <Link to={"/connect-withdrawal-account"}>
            <Button color="primary" className="mt-4">
              Connect Account
            </Button>
          </Link>
        )}

        <Divider className="my-4" />

        <h2 className="font-semibold text-xl mb-2">My page link</h2>
        <p className="text-[#a1a1aa] mb-4">
          Change your page link to anything of your choice
        </p>
        {/* <Input
          variant="flat"
          className="my-4"
          labelPlacement="outside"
          isDisabled
          //   errorMessage={errors.tipeaseLink?.message}
          //   isInvalid={!!errors.tipeaseLink}
          //   {...register("tipeaseLink")}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">tipease.live/</span>
            </div>
          }
          endContent={
            false ? (
              <Spinner />
            ) : true ? (
              <HiCheckCircle className={`text-green-400 text-2xl`} />
            ) : (
              <HiXCircle className="text-red-400 text-2xl" />
            )
          }
        /> */}
        <p className="text-lg text-center">Coming Soon!!!</p>

        {/* <Button
          className="w-full rounded-3xl mt-4"
          color="primary"
          isDisabled
        ></Button> */}
      </div>
      {/* <div className="border border-red-500 rounded-xl mb-8 p-8">
        <h2 className=" text-red-500 font-semibold text-xl mb-2">
          Disable Page
        </h2>
        <div className="flex justify-between">
          <p className="max-w-md text-red-100">
            Your page will be temporarily disable and will not be accessible to
            the public
          </p>
          <Button className="bg-red-500 font-semibold">Disable</Button>
        </div>
      </div> */}
    </>
  );
};

export default Settings;
