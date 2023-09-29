import { Card, Divider, Skeleton } from "@nextui-org/react";

const AccountVerificationCard = ({ accountName }) => {
  return (
    <Card className="py-6 my-4">
      <p className="text-center font-bold">{accountName}</p>
    </Card>
  );
};

export default AccountVerificationCard;
