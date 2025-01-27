"use client";
import { useCurrency } from "../hooks/useCurrency";
import Image from "next/image";
import Select from "react-select";
import { useState } from "react";
// import { NATIVE_TOKEN } from '../utils/address';


export type CurrencySelectValue = {
  value: string;
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  }
  address: string
};

interface CountrySelectProps {
   value: CurrencySelectValue | undefined
   onChange: (selectedOption: CurrencySelectValue | null) => void
}

export default function CurrencySelect({
    value,
    onChange,
  }: CountrySelectProps) {
  const { formattedCurrency, isLoading, error } = useCurrency();
  // const [selectedCurrency, setSelectedCurrency] = useState<CurrencySelectValue | null>(null);
//  const {selectedCurrency, setSelectedCurrency} = useSelectedCurrency()



  // const formattedCurrency = useMemo(() => {
  //   currency.map((item) => item.address === "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" ? {...item, address: NATIVE_TOKEN} : item )
  // }, [currency])

  return (
    <div className="">
      <Select
        required
        placeholder="Currency"
        isClearable
        isLoading={isLoading}
        options={formattedCurrency}
        value={value}
        onChange={(selectedOption) => onChange(selectedOption as CurrencySelectValue | null)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3">
            <Image src={option.image.thumb} alt={option.symbol} width={24} height={24} />
            <div>
              {option.symbol.toUpperCase()}
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-2 border-2 border-gray-300",
          input: () => "text-sm placeholder:text-sm",
          option: () => "text-sm",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary25: "#ffe4e4",
            primary: "black",
          }
        })}
      />
      
    </div>
  );
}

