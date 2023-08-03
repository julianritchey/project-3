import { Button, List, ListItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Address } from "wagmi";

interface Props {
  userAddress: Address;
}

const StrategiesSidebar = ({ userAddress }: Props) => {
  return (
    <>
      <List paddingLeft={5}>
        <ListItem key="getTokens" paddingY="5px">
          <NavLink to="/tokens/get">
            <Button colorScheme="green" variant="outline" width="100%">
              Get tokens
            </Button>
          </NavLink>
        </ListItem>
        <ListItem key="transferTokens" paddingY="5px">
          <NavLink to="/tokens/transfer">
            <Button colorScheme="green" variant="outline" width="100%">
              Transfer tokens
            </Button>
          </NavLink>
        </ListItem>
        {userAddress === import.meta.env.VITE_IDT_OWNER_ADDRESS && (
          <ListItem key="adminTokens" paddingY="5px">
            <NavLink to="/tokens/admin">
              <Button colorScheme="green" variant="outline" width="100%">
                Admin
              </Button>
            </NavLink>
          </ListItem>
        )}
      </List>
    </>
  );
};

export default StrategiesSidebar;
