import { Card, Divider } from "@nextui-org/react";
import { HiCheckCircle } from "react-icons/hi2";

const AccountVerificationCard = ({ accountNumber, accountName }) => {
  return (
    <Card className="p-2 my-4">
      <p className="text-center font-bold">{accountName}</p>
      <p className="text-center tracking-wider">{accountNumber}</p>
      <HiCheckCircle className="mx-auto mt-2 text-green-400" size={20} />
    </Card>
  );
};

export default AccountVerificationCard;
