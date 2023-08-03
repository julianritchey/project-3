import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Show,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useToken,
} from "wagmi";
import PageHeading from "../components/PageHeading";
import TokensSidebar from "../components/TokensSidebar";
import TransferTokensForm from "../components/TransferTokensForm";
import { tokenAbi } from "../data/tokenAbi";
import useAuth from "../hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const mintTokensSchema = z.object({
  mintTokenAmount: z
    .number({
      invalid_type_error: "Token amount is required.",
    })
    .min(0.000000000000000001),
});

type MintTokenFormData = z.infer<typeof mintTokensSchema>;

const setTokenPriceSchema = z.object({
  tokenPriceAmount: z
    .number({
      invalid_type_error: "Token amount is required.",
    })
    .min(0.000000000000000001),
});

type SetTokenPriceFormData = z.infer<typeof setTokenPriceSchema>;

const AdminTokensPage = () => {
  useAuth();
  const {
    register: mintTokenRegister,
    handleSubmit: mintTokenSubmit,
    formState: { errors: mintTokenErrors, isValid: mintTokenIsValid },
    reset: mintTokenReset,
  } = useForm<MintTokenFormData>({ resolver: zodResolver(mintTokensSchema) });

  const {
    register: setTokenPriceRegister,
    handleSubmit: setTokenPriceSubmit,
    formState: { errors: setTokenPriceErrors, isValid: setTokenPriceIsValid },
    reset: setTokenPriceReset,
  } = useForm<SetTokenPriceFormData>({
    resolver: zodResolver(setTokenPriceSchema),
  });

  const contractAddress = import.meta.env.VITE_IDT_TOKEN_ADDRESS;
  const [mintValue, setMintValue] = useState(0n);
  const [tokenPriceValue, setTokenPriceValue] = useState(0n);

  const { address: userAddress } = useAccount();

  const { data: tokenName } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "name",
  });

  const { data: tokenSymbol } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "symbol",
  });

  const { data: tokenDecimals } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "decimals",
  });

  const { data: tokenOwner } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "owner",
  });

  const { data: tokenTotalSupply } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "totalSupply",
  });

  const { data: tokenAvailableSupply } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [userAddress as Address],
  });

  const { data: tokenPrice } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "tokenPrice",
  });

  const { data: tokenMonthlySubscriptionFee } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "monthlySubscriptionFee",
  });

  const { data: tokenYearlySubscriptionFee } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "yearlySubscriptionFee",
  });

  const { config: mintTokensConfig, error: mintTokensError } =
    usePrepareContractWrite({
      address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: "mint",
      gas: 3000000n,
      chainId: 0,
      args: [userAddress as Address, mintValue],
    });

  const { write: mintTokensWrite } = useContractWrite(mintTokensConfig);

  const { config: setTokenPriceConfig, error: setTokenpriceError } =
    usePrepareContractWrite({
      address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: "setTokenPrice",
      gas: 3000000n,
      chainId: 0,
      args: [tokenPriceValue],
    });

  const { write: setTokenPriceWrite } = useContractWrite(setTokenPriceConfig);

  return (
    <Grid
      templateAreas={{
        base: `"main"`,
        lg: `"aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <Show above="lg">
        <GridItem area="aside">
          <TokensSidebar userAddress={userAddress as Address} />
        </GridItem>
      </Show>
      <GridItem area="main" paddingX={5}>
        <PageHeading pageName="Admin" />
        <Card marginBottom={5}>
          <CardHeader>
            <Heading size="lg">Token data</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={2}>
              <Box>
                <Box marginBottom={5}>
                  <Text as="b">Token name:</Text>
                  <Text>{tokenName}</Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token decimals:</Text>
                  <Text>{tokenDecimals}</Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token total supply (with decimals):</Text>
                  <Text>{Number(tokenTotalSupply).toLocaleString()}</Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token available supply (with decimals):</Text>
                  <Text>{Number(tokenAvailableSupply).toLocaleString()}</Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token price (in WEI):</Text>
                  <Text>{Number(tokenPrice).toLocaleString()}</Text>
                </Box>
              </Box>
              <Box>
                <Box marginBottom={5}>
                  <Text as="b">Token symbol:</Text>
                  <Text>{tokenSymbol}</Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token owner:</Text>
                  <Text>{tokenOwner}</Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token total supply (formatted):</Text>
                  <Text>
                    {(Number(tokenTotalSupply) / 10 ** 18).toLocaleString()}
                  </Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token available supply (formatted):</Text>
                  <Text>
                    {(Number(tokenAvailableSupply) / 10 ** 18).toLocaleString()}
                  </Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">Token price (in ETH):</Text>
                  <Text>
                    {parseFloat((Number(tokenPrice) / 10 ** 18).toString())}
                  </Text>
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
        <Card marginBottom={5}>
          <CardHeader>
            <Heading size="lg">Subscription data</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={2}>
              <Box>
                <Box marginBottom={5}>
                  <Text as="b">
                    Monthly base strategy subscription fee (with decimals):
                  </Text>
                  <Text>
                    {Number(tokenMonthlySubscriptionFee).toLocaleString()}{" "}
                    {tokenSymbol}
                  </Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">
                    Yearly base strategy subscription fee (with decimals):
                  </Text>
                  <Text>
                    {Number(tokenYearlySubscriptionFee).toLocaleString()}{" "}
                    {tokenSymbol}
                  </Text>
                </Box>
              </Box>
              <Box>
                <Box marginBottom={5}>
                  <Text as="b">
                    Monthly base strategy subscription fee (formatted):
                  </Text>
                  <Text>
                    {parseFloat(
                      (
                        Number(tokenMonthlySubscriptionFee) /
                        10 ** 18
                      ).toString()
                    )}{" "}
                    {tokenSymbol}
                  </Text>
                </Box>
                <Box marginBottom={5}>
                  <Text as="b">
                    Yearly base strategy subscription fee (formatted):
                  </Text>
                  <Text>
                    {parseFloat(
                      (Number(tokenYearlySubscriptionFee) / 10 ** 18).toString()
                    )}{" "}
                    {tokenSymbol}
                  </Text>
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
        <Card marginBottom={5}>
          <CardHeader>
            <Heading size="md">Mint tokens</Heading>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={mintTokenSubmit((data) => {
                console.log(mintValue);
                mintTokensWrite?.();
              })}
            >
              <FormControl marginBottom={5}>
                <FormLabel htmlFor="mintTokenAmount">Token amount</FormLabel>
                <InputGroup>
                  <Input
                    {...mintTokenRegister("mintTokenAmount", {
                      valueAsNumber: true,
                    })}
                    id="mintTokenAmount"
                    onChange={(event) =>
                      setMintValue(
                        BigInt(parseFloat(event.target.value) * 10 ** 18)
                      )
                    }
                  ></Input>
                  <InputRightAddon>IDT</InputRightAddon>
                </InputGroup>
                {mintTokenErrors.mintTokenAmount && (
                  <Text fontSize="sm" color="red.300">
                    {mintTokenErrors.mintTokenAmount.message}
                  </Text>
                )}
              </FormControl>
              <Flex>
                <Button colorScheme="red" type="reset" variant="outline">
                  Clear
                </Button>
                <Spacer />
                <Button colorScheme="teal" type="submit">
                  Mint
                </Button>
              </Flex>
            </form>
          </CardBody>
        </Card>
        <Card marginBottom={5}>
          <CardHeader>
            <Heading size="md">Set token price</Heading>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={setTokenPriceSubmit((data) => {
                console.log(data);
                setTokenPriceWrite?.();
              })}
            >
              <FormControl marginBottom={5}>
                <FormLabel htmlFor="tokenPriceAmount">Token amount</FormLabel>
                <InputGroup>
                  <Input
                    {...setTokenPriceRegister("tokenPriceAmount", {
                      valueAsNumber: true,
                    })}
                    id="tokenPriceAmount"
                    onChange={(event) =>
                      setTokenPriceValue(
                        BigInt(parseFloat(event.target.value) * 10 ** 18)
                      )
                    }
                  ></Input>
                  <InputRightAddon>IDT</InputRightAddon>
                </InputGroup>
                {setTokenPriceErrors.tokenPriceAmount && (
                  <Text fontSize="sm" color="red.300">
                    {setTokenPriceErrors.tokenPriceAmount.message}
                  </Text>
                )}
              </FormControl>
              <Flex>
                <Button colorScheme="red" type="reset" variant="outline">
                  Clear
                </Button>
                <Spacer />
                <Button colorScheme="teal" type="submit">
                  Set price
                </Button>
              </Flex>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default AdminTokensPage;
