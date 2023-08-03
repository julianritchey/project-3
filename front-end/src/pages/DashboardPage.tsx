import {
  Box,
  Card,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Show,
} from "@chakra-ui/react";
import PageHeading from "../components/PageHeading";
import SortSelector from "../components/SortSelector";
import GenreList from "../components/StrategiesSidebar";
import DashboardSidebar from "../components/DashboardSidebar";
import { Address, useAccount } from "wagmi";

const DashboardPage = () => {
  const { address: userAddress } = useAccount();
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
          <DashboardSidebar userAddress={userAddress as Address} />
        </GridItem>
      </Show>
      <GridItem area="main" paddingX={5}>
        <Box>
          <PageHeading pageName="Dashboard" />
          <Card>
            <CardHeader>
              <Heading>Welcome to Investor's Dream!</Heading>
            </CardHeader>
          </Card>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default DashboardPage;
