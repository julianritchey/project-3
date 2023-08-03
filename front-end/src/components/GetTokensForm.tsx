import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { round } from "mathjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { z } from "zod";
import { contractAbi } from "../data/contractAbi";
import Balance from "../entities/Balance";
import Token from "../entities/Token";
import { tokenAbi } from "../data/tokenAbi";

interface Props {
  addressBalance: Balance | undefined;
  token: Token | undefined;
  tokenPrice: bigint | undefined;
  onSubmit: (data: any) => void;
  userAddress: Address;
}

const schema = z.object({
  idtAmount: z
    .number({
      invalid_type_error: "IDT token amount is required.",
    })
    .min(0.000000000000000001)
    .max(2000000000),
  ethAmount: z
    .number({ invalid_type_error: "ETH token amount is required." })
    .min(0.000000000000000001),
});

type TokenFormData = z.infer<typeof schema>;

const GetTokensForm = ({
  addressBalance,
  token,
  tokenPrice,
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

  const { data: ownerBalance } = useContractRead({
    address: token?.address as Address,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [import.meta.env.VITE_IDT_OWNER_ADDRESS as Address],
  });
  console.log(ownerBalance);

  const [buyValue, setBuyValue] = useState<bigint>(0n);
  console.log(buyValue);

  const tokenPriceFormatted =
    Number(tokenPrice) / 10 ** Number(token?.decimals);

  const { config, error } = usePrepareContractWrite({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "buyTokens",
    gas: 3000000n,
    value: buyValue,
    chainId: 0,
  });

  const { write } = useContractWrite(config);

  const handleEthOnChange = (event: any) => {
    const multiplier = token?.decimals ? 10 ** token.decimals : 10 ** 18;
    setValue("idtAmount", parseFloat(event.target.value) / tokenPriceFormatted);
    const value = BigInt(round(event.target.value * multiplier));
    setBuyValue(value);
  };

  const handleIdtOnChange = (event: any) => {
    const multiplier = token?.decimals ? 10 ** token.decimals : 10 ** 18;
    setValue(
      "ethAmount",
      (parseFloat(event.target.value) * Number(tokenPrice)) / multiplier
    );
    const value = BigInt(round(event.target.value * Number(tokenPrice)));
    setBuyValue(value);
  };

  return (
    <>
      <Flex>
        <Box paddingBottom={3} marginRight={10}>
          <Text as="b">IDT token price:</Text>
          <HStack>
            <Text>{tokenPriceFormatted?.toString()}</Text>
            <Text>{addressBalance?.symbol}</Text>
          </HStack>
        </Box>
        <Box marginRight={10}>
          <Text as="b">Availability:</Text>
          <HStack>
            <Text>
              {(Number(ownerBalance) / 10 ** token?.decimals!).toLocaleString()}
            </Text>
            <Text>{token?.symbol}</Text>
          </HStack>
        </Box>
        <Box>
          <Text as="b">Total supply:</Text>
          <HStack>
            <Text>
              {parseInt(token?.totalSupply?.formatted!).toLocaleString()}
            </Text>
            <Text>{token?.symbol}</Text>
          </HStack>
        </Box>
      </Flex>
      <form
        onSubmit={handleSubmit((data) => {
          if (tokenPrice) {
            write?.();
            onSubmit(data);
            reset();
          }
        })}
      >
        <FormControl>
          <HStack>
            <FormControl paddingBottom={5}>
              <FormLabel htmlFor="idtAmount">IDT amount to buy</FormLabel>
              <InputGroup>
                <Input
                  {...register("idtAmount", { valueAsNumber: true })}
                  id="idtAmount"
                  onChange={(event) => handleIdtOnChange(event)}
                  step="0.000000000000000001"
                  type="number"
                ></Input>
                <InputRightAddon children="IDT"></InputRightAddon>
              </InputGroup>
              {errors.idtAmount && (
                <Text color="red">{errors.idtAmount.message}</Text>
              )}
            </FormControl>
            <FormControl paddingBottom={5}>
              <FormLabel htmlFor="ethAmount">ETH amount to spend</FormLabel>
              <InputGroup>
                <Input
                  {...register("ethAmount", { valueAsNumber: true })}
                  id="ethAmount"
                  onChange={(event) => handleEthOnChange(event)}
                  step="0.000000000000000001"
                  type="number"
                ></Input>
                <InputRightAddon>ETH</InputRightAddon>
              </InputGroup>
              {errors.ethAmount && (
                <Text color="red">{errors.ethAmount.message}</Text>
              )}
            </FormControl>
          </HStack>
          <Flex>
            <Button colorScheme="red" type="reset" variant="outline">
              Reset
            </Button>
            <Spacer />
            <Button colorScheme="blue" type="submit">
              Purchase
            </Button>
          </Flex>
        </FormControl>
      </form>
    </>
  );
};

export default GetTokensForm;
