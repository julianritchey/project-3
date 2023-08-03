import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, useContractWrite, usePrepareContractWrite } from "wagmi";
import { z } from "zod";
import { tokenAbi } from "../data/tokenAbi";
import Balance from "../entities/Balance";
import Token from "../entities/Token";

interface Props {
  addressBalance: Balance | undefined;
  token: Token | undefined;
  onSubmit: (data: any) => void;
  userAddress: Address;
}

const schema = z.object({
  toAddress: z.string({ invalid_type_error: "'To' address is required." }),
  transferAmount: z
    .number({ invalid_type_error: "'Amount' is required." })
    .min(0.000000000000000001),
});

type TokenFormData = z.infer<typeof schema>;

const GetTokensForm = ({
  addressBalance,
  token,
  onSubmit,
  userAddress,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
    setValue,
  } = useForm<TokenFormData>({ resolver: zodResolver(schema) });

  const [transferValue, setTransferValue] = useState<bigint>(0n);
  const [transferAddress, setTransferAddress] = useState<Address>(`0x`);

  const { config, error } = usePrepareContractWrite({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "transfer",
    gas: 3000000n,
    chainId: 0,
    args: [transferAddress, transferValue],
  });

  const { write } = useContractWrite(config);

  const handleToOnChange = (event: any) => {
    setValue("toAddress", event.target.value as Address);
    setTransferAddress(event.target.value as Address);
  };

  const handleAmountOnChange = (event: any) => {
    setValue("transferAmount", event.target.value);
    if (token?.decimals) {
      const value = BigInt(event.target.value * 10 ** token?.decimals);
      setTransferValue(value);
    }
  };
  console.log(transferAddress);
  console.log(transferValue);

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          if (data) {
            console.log(config);
            write?.();
            onSubmit(data);
            reset();
          }
        })}
      >
        <FormControl paddingBottom={5}>
          <FormLabel htmlFor="toAddress">To</FormLabel>
          <Input
            {...register("toAddress")}
            id="toAddress"
            onChange={(event) => handleToOnChange(event)}
          ></Input>
          {errors.toAddress && (
            <Text color="red">{errors.toAddress.message}</Text>
          )}
        </FormControl>
        <FormControl paddingBottom={5}>
          <FormLabel htmlFor="transferAmount">Amount</FormLabel>
          <InputGroup>
            <Input
              {...register("transferAmount", { valueAsNumber: true })}
              id="transferAmount"
              onChange={(event) => handleAmountOnChange(event)}
              step="0.000000000000000001"
              type="number"
            ></Input>
            <InputRightAddon>IDT</InputRightAddon>
          </InputGroup>
          {errors.transferAmount && (
            <Text color="red">{errors.transferAmount.message}</Text>
          )}
        </FormControl>
        <Flex>
          <Button colorScheme="red" type="reset" variant="outline">
            Reset
          </Button>
          <Spacer />
          <Button colorScheme="blue" type="submit">
            Transfer
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default GetTokensForm;
