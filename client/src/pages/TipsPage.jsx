import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { HiCurrencyDollar, HiHeart } from "react-icons/hi2";
import CircularSelectItem from "../components/CircularSelectItem";
import useTipSummary from "../hooks/useTipSummary";
import useUser from "../hooks/useUser";
import { getCurrencySymbol } from "../utils";
import useGetTips from "../hooks/useGetTips";
import moment from "moment";

const TipsPage = () => {
  const tipSummary = useTipSummary();
  const user = useUser();
  const tips = useGetTips();

  return (
    <>
      <div className="border rounded-xl mb-8 p-4">
        <Tabs aria-label="Options">
          <Tab key="tips" title="Tips">
            <div className="grid grid-cols-3 gap-8 ">
              <Card className="p-4">
                <h3 className="text-4xl">{tipSummary.data?.tipCount}</h3>
                <div className="mt-4 text-[#a1a1aa]">
                  <HiHeart className="inline mr-3" />
                  <span className="text-lg">Tips</span>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-4xl">
                  {user.data &&
                    getCurrencySymbol(user.data.paymentCurrency.code)}{" "}
                  {tipSummary.data?.earningsSummary.last30Days}
                </h3>
                <div className="mt-4 text-[#a1a1aa]">
                  <HiHeart className="inline mr-3" />
                  <span className="text-lg">Last 30 days</span>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-4xl">
                  {user.data &&
                    getCurrencySymbol(user.data.paymentCurrency.code)}{" "}
                  {tipSummary.data?.earningsSummary.last30Days}{" "}
                </h3>
                <div className="mt-4 text-[#a1a1aa]">
                  <HiHeart className="inline mr-3" />
                  <span className="text-lg ">All-time</span>
                </div>
              </Card>
            </div>
            <Divider className="my-8" />
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
          </Tab>
          {/* <Tab key="settings" title="Settings">
            <h2 className="font-semibold text-xl mb-2">Price per tip</h2>
            <p className="text-[#a1a1aa] mb-4">
              Change the default price of a tip to any amount of your choice
            </p>
            <div className="mb-4">
              <CircularSelectItem value={"$5"} />
              <CircularSelectItem value={"$5"} />
              <CircularSelectItem value={"$5"} isSelected={true} />
              <CircularSelectItem value={"$5"} />
            </div>
            <Button className="w-full rounded-3xl mt-4" color="primary">
              Save Changes
            </Button>
          </Tab> */}
        </Tabs>
      </div>
    </>
  );
};

export default TipsPage;
