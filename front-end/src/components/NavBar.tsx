import { Box, Button, Center, Divider, HStack, Image } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import logo from "../assets/logotype_id_dark_30.svg";
import useUser from "../hooks/useUser";
import ColorModeSwitch from "./ColorModeSwitch";
import LoginModal from "./LoginModal";
import UserMenu from "./UserMenu";

const NavBar = () => {
  const user = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const connected = useUser(user.address!);

  return (
    <HStack justifyContent={"space-between"} paddingX={3}>
      <HStack spacing={5}>
        <NavLink to="/">
          <Image src={logo} objectFit="cover" paddingX={3} paddingY={4} />
        </NavLink>
        {user.isConnected && (
          <>
            <Center height="30px">
              <Divider orientation="vertical" />
            </Center>
            <NavLink to="/dashboard">
              <Button colorScheme="blue" variant="link">
                Dashboard
              </Button>
            </NavLink>
            <NavLink to="/strategies">
              <Button colorScheme="blue" variant="link">
                Strategies
              </Button>
            </NavLink>
            <NavLink to="/tokens">
              <Button colorScheme="blue" variant="link">
                Tokens
              </Button>
            </NavLink>
          </>
        )}
      </HStack>
      <HStack whiteSpace="normal" paddingX={3}>
        {user.isConnected ? (
          <UserMenu userAddress={user.address} />
        ) : (
          <LoginModal />
        )}
        <Box paddingLeft={5}>
          <ColorModeSwitch />
        </Box>
      </HStack>
    </HStack>
  );
};

export default NavBar;
