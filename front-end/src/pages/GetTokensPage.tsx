import {
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Show,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import {
  Address,
  useAccount,
  useBalance,
  useContractInfiniteReads,
  useContractRead,
  useToken,
} from "wagmi";
import GetTokensForm from "../components/GetTokensForm";
import PageHeading from "../components/PageHeading";
import TokensSidebar from "../components/TokensSidebar";
import { contractAbi } from "../data/contractAbi";
import { tokenAbi } from "../data/tokenAbi";

const GetTokensPage = () => {
  const contractAddress = import.meta.env.VITE_IDT_TOKEN_ADDRESS;
  const { address: userAddress } = useAccount();

  const { data: addressBalance } = useBalance({
    address: userAddress,
  });
  const idtContractConfig = {
    address: contractAddress,
    abi: tokenAbi,
  };
  const { data: tokenData } = useToken({
    address: contractAddress,
  });
  const { data: tokenBalanceData } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [userAddress as Address],
  });
  const { data, fetchNextPage } = useContractInfiniteReads({
    cacheKey: "idtAttributes",
    contracts(param = 0) {
      const args = [param] as const;
      return [
        // { ...idtContractConfig, functionName: "addMinter", args },
        // { ...idtContractConfig, functionName: "buyTokens" },
        // { ...idtContractConfig, functionName: "fallback" },
        // { ...idtContractConfig, functionName: "renounceMinter" },
        // { ...idtContractConfig, functionName: "setTokenPrice", args },
        // { ...idtContractConfig, functionName: "withdraw", args },
        // { ...idtContractConfig, functionName: "isMinter", args },
        { ...idtContractConfig, functionName: "owner" },
        { ...idtContractConfig, functionName: "tokenPrice" },
      ];
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

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
        <PageHeading pageName="Get tokens" />
        <Card marginBottom={5}>
          <CardBody>
            <SimpleGrid spacing={3}>
              <Box>
                <Text as="b">Your address</Text>
                <Text>{userAddress}</Text>
              </Box>
              <Box>
                <Text as="b">Your account balance</Text>
                <HStack>
                  <Text>{addressBalance?.symbol}:</Text>
                  <Text>
                    {parseFloat(
                      addressBalance?.formatted as string
                    ).toPrecision(10)}
                  </Text>
                </HStack>
                <HStack>
                  <Text>{tokenData?.symbol}:</Text>
                  <Text>
                    {tokenBalanceData && tokenData
                      ? (
                          Number(tokenBalanceData) /
                          10 ** tokenData.decimals
                        ).toLocaleString()
                      : 0}
                  </Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <GetTokensForm
              addressBalance={addressBalance}
              token={tokenData}
              tokenPrice={data?.pages[0][1].result}
              onSubmit={(tokenFormData) => onSubmit(tokenFormData)}
              userAddress={userAddress as Address}
            />
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default GetTokensPage;
