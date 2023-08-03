import React from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { tokenAbi } from "../data/tokenAbi";
import { Button } from "@chakra-ui/react";

interface Props {
  buyValue: bigint;
}

const PurchaseTokensButton = ({ buyValue }: Props) => {
  if (buyValue !== 0n) {
    const { config, error } = usePrepareContractWrite({
      address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: "buyTokens",
      gas: 3000000n,
      value: buyValue,
      chainId: 0,
    });

    const { write } = useContractWrite(config);

    return (
      <Button colorScheme="blue" onClick={write} type="submit">
        Purchase
      </Button>
    );
  }
  return (
    <Button colorScheme="blue" type="submit">
      Purchase
    </Button>
  );
};

export default PurchaseTokensButton;
