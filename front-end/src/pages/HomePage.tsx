import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
import CreateStrategyImage from "../assets/create-strategy.jpg";

const HomePage = () => (
  <Grid
    templateColumns={{
      base: "1fr",
      lg: "1fr",
    }}
  >
    <GridItem area="main">
      <Box backgroundSize="100%" backgroundImage={CreateStrategyImage}>
        <Image src={CreateStrategyImage} alt="Background" />
      </Box>
    </GridItem>
  </Grid>
);

export default HomePage;
