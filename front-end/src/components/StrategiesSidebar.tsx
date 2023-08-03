import { Button, List, ListItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const StrategiesSidebar = () => {
  return (
    <>
      <List paddingLeft={5}>
        <ListItem key="strategyList" paddingY="5px">
          <NavLink to="/strategies/list">
            <Button colorScheme="green" variant="outline" width="100%">
              Strategy list
            </Button>
          </NavLink>
        </ListItem>
        <ListItem key="createStrategy" paddingY="5px">
          <NavLink to="/strategies/create">
            <Button colorScheme="green" variant="outline" width="100%">
              Strategy creation
            </Button>
          </NavLink>
        </ListItem>
      </List>
    </>
  );
};

export default StrategiesSidebar;
