import {
  Avatar,
  Button,
  Card,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  HiCurrencyDollar,
  HiHeart,
  HiMiniCurrencyDollar,
} from "react-icons/hi2";
import useUser from "../hooks/useUser";
import usePage from "../hooks/usePage";
import useTipSummary from "../hooks/useTipSummary";
import { useState } from "react";
import { getCurrencySymbol, getHostUrl } from "../utils";
import useGetTips from "../hooks/useGetTips";
import moment from "moment";
import toast from "react-hot-toast";

const Home = () => {
  const user = useUser();
  const tipSummary = useTipSummary();
  const [earnings, setEarnings] = useState(0);
  const tips = useGetTips();

  return (
    <>
      <div className="border rounded-xl mb-8">
        <div className="flex justify-between p-6 items-center">
          <div className="flex items-center">
            <Avatar
              className="h-20 w-20 mr-8 bold"
              src={user.data?.page.profileImage}
            />
            <div>
              <p className="font-bold text-lg">
                Hi {user.data?.firstName + " " + user.data?.lastName}
              </p>
              <p className="text-[#a1a1aa]">
                tipease.live/{user.data?.page.slug}
              </p>
            </div>
          </div>
          <Button
            className="rounded-3xl "
            color="primary"
            onClick={() => {
              navigator.clipboard.writeText(
                `${getHostUrl()}/${user.data?.page.slug}`
              );
              toast("Copied to clipboard");
            }}
          >
            Copy Link
          </Button>
        </div>
        <Divider className="max-w-3xl mx-auto" />
        <div className="p-6">
          <div className="flex">
            <h2 className="font-semibold text-2xl mr-4">Earnings</h2>
            <Select
              className="max-w-[8rem]"
              labelPlacement="outside"
              onChange={(e) => setEarnings(e.target.value.split("-")[1])}
            >
              {tipSummary.data &&
                Object.entries(tipSummary.data?.earningsSummary).map(
                  ([key, value]) => (
                    <SelectItem key={key + "-" + value} value={value}>
                      {key}
                    </SelectItem>
                  )
                )}
            </Select>
          </div>
          <h2 className="text-4xl mt-4 font-semibold">
            {user.data && getCurrencySymbol(user.data.paymentCurrency.code)}{" "}
            {earnings}
          </h2>
        </div>
      </div>
      <div className="border rounded-xl flex justify-center flex-col items-center p-12">
        {tips.data && tips.data.length > 0 ? (
          tips.data.map((tip) => (
            <Card className="grid grid-cols-3 w-full p-4 items-center my-4">
              <Avatar size="lg" />
              <p className="text-lg">
                {getCurrencySymbol(tip.currency.code)} {tip.amount}
              </p>
              <p>
                {moment(tip.createdAt).calendar(null, {
                  sameDay: "[Today]",
                  nextDay: "[Tomorrow]",
                  lastDay: "[Yesterday]",
                  lastWeek: "[Last] dddd",
                  sameElse: "MMMM D, YYYY", // Custom format without time
                })}
              </p>
            </Card>
          ))
        ) : (
          <>
            <HiCurrencyDollar className="text-4xl" />
            <p className="text-lg font-semibold text-center">
              You don't have any tips yet
            </p>
            <p className="text-[#a1a1aa] text-center">
              Share your page with your customers to get started
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
