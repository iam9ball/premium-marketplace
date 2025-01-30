"use client";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import Modal from "./Modal";
import { useCallback, useMemo, useState, useEffect } from "react";
import Heading from "../Heading";
import ToggleButton from "../ToggleButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { createListing } from "@/app/contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import CurrencySelect, { CurrencySelectValue } from "../CurrencySelect";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import { useRouter } from "next/navigation";
import { NATIVE_TOKEN } from "@/app/utils/address";
import { getListingType } from "@/app/contracts/listingInfo";
import { TimeHelper } from "@/app/utils/timeFormatter";
import useInfiniteScrollMutateStore from "@/app/hooks/useInfiniteScrollMutateStore";

enum STEPS {
  LISTINGPLAN,
  INFO,
}

enum LISTINGPLAN {
  BASIC,
  ADVANCED,
  PRO,
}

interface ListingTypeData {
  duration?: number;
  price?: string;
}

const CreateListingModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createListingModal = useCreateListingModal();
  const account = useActiveAccount();
  const [listingPlan, setListingPlan] = useState<LISTINGPLAN>();
  const [step, setStep] = useState(STEPS.LISTINGPLAN);
  const [isReserved, setIsReserved] = useState(false);
  const [selectedValue, setSelectedValue] = useState<CurrencySelectValue>();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listingPlan: null,
      assetAddress: "",
      assetId: null,
      assetPrice: null,
      currencyAddress: null,
      reserved: isReserved,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [basicData, setBasicData] = useState<ListingTypeData>({});
  const [advancedData, setAdvancedData] = useState<ListingTypeData>({});
  const [proData, setProData] = useState<ListingTypeData>({});
  const { marketplaceRefreshListings } = useInfiniteScrollMutateStore();

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    console.log(data.currencyAddress);
    if (account) {
      const listingData = {
        assetAddress: data.assetAddress,
        assetId: data.assetId,
        currencyAddress: data.currencyAddress,
        assetPrice: data.assetPrice,
        listingPlan: data.listingPlan,
        reserved: data.reserved,
      };

      if (!data.currencyAddress) {
        toast.error("Please select a currency");
        return;
      }

      setIsLoading(true);
      try {
        await createListing(listingData, account).then(async (data: any) => {
          if (data.success) {
            createListingModal.onClose();
            toast.success(data.message);
            reset();
            setListingPlan(undefined);
            setIsReserved(false);
            setSelectedValue(undefined);
            setStep(STEPS.LISTINGPLAN);
            await marketplaceRefreshListings?.(); // force a soft refresh of listing
          } else {
            toast.error(data.message);
          }
        });
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      createListingModal.onClose();
      showToast();
      //  connect wallet
    }
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const forwardLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Submit";
    } else {
      if (
        listingPlan == LISTINGPLAN.ADVANCED ||
        listingPlan == LISTINGPLAN.PRO ||
        listingPlan == LISTINGPLAN.BASIC
      ) {
        return "Next";
      } else {
        return undefined;
      }
    }
  }, [step, listingPlan]);

  const backwardLabel = useMemo(() => {
    if (step === STEPS.LISTINGPLAN) {
      return undefined;
    }
    return "Back";
  }, [step]);

  const setCustomValues = useCallback(
    (key: any, value: any) => {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const [basicResult, advancedResult, proResult] = await Promise.all([
          getListingType(LISTINGPLAN.BASIC),
          getListingType(LISTINGPLAN.ADVANCED),
          getListingType(LISTINGPLAN.PRO),
        ]);
        // Set the state with the fetched data
        setBasicData({
          duration: TimeHelper.secondsToMonths(Number(basicResult?.[0]!)),
          price: basicResult?.[1].toString(),
        });
        setAdvancedData({
          duration: TimeHelper.secondsToMonths(Number(advancedResult?.[0]!)),
          price: advancedResult?.[1].toString(),
        });
        setProData({
          duration: TimeHelper.secondsToMonths(Number(proResult?.[0]!)),
          price: proResult?.[1].toString(),
        });
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };

    fetchListingData();
  }, []);

  const handleToggle = (value: boolean) => {
    setIsReserved(value);
    setCustomValues("reserved", value);
  };

  const handleListingPlan = (type: LISTINGPLAN) => {
    setListingPlan(type);
    setCustomValues("listingPlan", type);
  };

  const handleCurrencySelect = (selectedOption: CurrencySelectValue | null) => {
    if (selectedOption) {
      // Set the currency field value to the entire selected option
      setSelectedValue(selectedOption);

      // Set the currency address field value
      setCustomValues("currencyAddress", selectedOption.address);
      console.log(selectedOption.address);
    } else {
      // Clear the values if no option is selected
      setSelectedValue(undefined);
      setCustomValues("currencyAddress", undefined);
    }
  };

  let bodyContent;

  //TOKENTYPE
  {
    step == STEPS.LISTINGPLAN &&
      (bodyContent = (
        <div className="flex flex-col gap-6 ">
          <Heading
            title="Choose Listing Plan"
            subtitle="Select the listing plan of your choice"
            titleClassName="text-xl font-bold ml-4"
            subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"
          />

          <div className="flex w-full justify-evenly items-center ">
            <div
              className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${
                listingPlan == LISTINGPLAN.BASIC && "bg-black text-white"
              }`}
              onClick={() => {
                handleListingPlan(LISTINGPLAN.BASIC);
              }}
            >
              <Heading
                title="Basic"
                subtitle={`$${basicData.price}`}
                center
                titleClassName={`md:text-xl font-bold ${
                  listingPlan == LISTINGPLAN.BASIC && "text-white"
                }`}
                subtitleClassName={`text-xs md:text-base font-light mt-1 ${
                  listingPlan == LISTINGPLAN.BASIC && "text-white"
                }`}
              />
              <div
                className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${
                  listingPlan == LISTINGPLAN.BASIC && "text-white"
                }`}
              >
                {TimeHelper.formatDuration(basicData.duration!)}
              </div>
            </div>

            <div
              className={`border border-gray-300 w-[35%] rounded-lg py-5 px-2 cursor-pointer ${
                listingPlan == LISTINGPLAN.ADVANCED && "bg-black text-white"
              }`}
              onClick={() => {
                handleListingPlan(LISTINGPLAN.ADVANCED);
              }}
            >
              <Heading
                title="Advanced"
                subtitle={`$${advancedData.price}`}
                center
                titleClassName={`md:text-xl font-bold ${
                  listingPlan == LISTINGPLAN.ADVANCED && "text-white"
                }`}
                subtitleClassName={`text-xs md:text-base font-light mt-1 ${
                  listingPlan == LISTINGPLAN.ADVANCED && "text-white"
                }`}
              />
              <div
                className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${
                  listingPlan == LISTINGPLAN.ADVANCED && "text-white"
                }`}
              >
                {TimeHelper.formatDuration(advancedData.duration!)}
              </div>
            </div>

            <div
              className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${
                listingPlan == LISTINGPLAN.PRO && "bg-black text-white"
              }`}
              onClick={() => {
                handleListingPlan(LISTINGPLAN.PRO);
              }}
            >
              <Heading
                title="Pro"
                subtitle={`$${proData.price}`}
                center
                titleClassName={`md:text-xl font-bold ${
                  listingPlan == LISTINGPLAN.PRO && "text-white"
                }`}
                subtitleClassName={`text-xs md:text-base font-light mt-1 ${
                  listingPlan == LISTINGPLAN.PRO && "text-white"
                }`}
              />
              <div
                className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${
                  listingPlan == LISTINGPLAN.PRO && "text-white"
                }`}
              >
                {TimeHelper.formatDuration(proData?.duration!)}
              </div>
            </div>
          </div>
        </div>
      ));
  }

  //INFO

  {
    step == STEPS.INFO &&
      (bodyContent = (
        <div className="flex flex-col  gap-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col ">
              <label
                htmlFor="assetContract"
                className="block text-xs md:text-sm font-medium text-gray-700"
              >
                Asset address
              </label>
              <input
                type="text"
                id="assetContract"
                className={`${
                  errors.assetAddress ? "border-red-500" : "border-gray-300"
                } mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`}
                {...register("assetAddress", {
                  required: true,
                })}
                placeholder="0x123...789"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="tokenId"
                  className="block text-xs md:text-sm font-medium text-gray-700"
                >
                  Token ID
                </label>
                <input
                  type="number"
                  id="tokenId"
                  {...register("assetId", {
                    required: true,
                  })}
                  className={`${
                    errors.assetId ? "border-red-500" : "border-gray-300"
                  } mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="0"
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="tokenPrice"
                  className="block text-xs md:text-sm font-medium text-gray-700"
                >
                  Token price
                </label>
                <input
                  type="number"
                  id="tokenPrice"
                  {...register("assetPrice", {
                    required: true,
                  })}
                  className={`${
                    errors.assetPrice ? "border-red-500" : "border-gray-300"
                  } mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="0"
                />
              </div>
            </div>

            <CurrencySelect
              value={selectedValue}
              onChange={handleCurrencySelect}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Reserve listing?
              </div>
              <div className="flex flex-end">
                <ToggleButton checked={isReserved} onChange={handleToggle} />
              </div>
            </div>
          </div>
        </div>
      ));
  }

  return (
    <Modal
      isOpen={createListingModal.isOpen}
      onClose={createListingModal.onClose}
      forward={handleSubmit(onSubmit)}
      forwardLabel={forwardLabel}
      backwardLabel={backwardLabel}
      backward={onBack}
      title="Create a Listing"
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default CreateListingModal;
