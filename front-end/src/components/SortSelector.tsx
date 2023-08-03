import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { default as useStrategyQueryStore } from "../store";

const SortSelector = () => {
  const sortOrders = [
    { value: "-date_created", label: "Newest" },
    { value: "date_created", label: "Oldest" },
    { value: "name", label: "Name ascending" },
    { value: "-name", label: "Name descending" },
    // { value: "-metacritic", label: "Popularity" },
    // { value: "-rating", label: "Average rating" },
  ];

  const setSortOrder = useStrategyQueryStore((s) => s.setSortOrder);
  const sortOrder = useStrategyQueryStore((s) => s.strategyQuery.sortOrder);
  const currentSortOrder = sortOrders.find(
    (order) => order.value === sortOrder
  );

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        Order by: {currentSortOrder?.label}
      </MenuButton>
      <MenuList>
        {sortOrders.map((order) => (
          <MenuItem
            onClick={() => setSortOrder(order.value)}
            key={order.value}
            value={order.value}
          >
            {order.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortSelector;
