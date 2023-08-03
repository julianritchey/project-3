import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  HStack,
  Show,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Address,
  useAccount,
  useBalance,
  useContractInfiniteReads,
  useContractRead,
  useToken,
} from "wagmi";
import PageHeading from "../components/PageHeading";
import TokensSidebar from "../components/TokensSidebar";
import TransferTokensForm from "../components/TransferTokensForm";
import { contractAbi } from "../data/contractAbi";
import { tokenAbi } from "../data/tokenAbi";

const TransferTokensPage = () => {
  const contractAddress = import.meta.env.VITE_IDT_TOKEN_ADDRESS;
  const [config, setConfig] = useState(null);
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
        <PageHeading pageName="Transfer tokens" />
        <Card marginBottom={5}>
          <CardBody>
            <Flex paddingBottom={5}>
              <Box>
                <Text as="b">From (your address)</Text>
                <Text>{userAddress}</Text>
              </Box>
              <Spacer />
              <Box>
                <Text as="b">Your account balance</Text>
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
            </Flex>
            <TransferTokensForm
              addressBalance={addressBalance}
              token={tokenData}
              onSubmit={(tokenFormData) => onSubmit(tokenFormData)}
              userAddress={userAddress as Address}
            />
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default TransferTokensPage;
