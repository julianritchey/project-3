import { Box, HStack, Switch, useColorMode } from "@chakra-ui/react";
import { BsMoon } from "react-icons/bs";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <HStack>
      <Switch
        colorScheme="green"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      <Box children={<BsMoon />} />
    </HStack>
  );
};

export default ColorModeSwitch;
