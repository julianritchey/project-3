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
