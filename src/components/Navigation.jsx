import React from "react";
import { Link } from "react-router-dom";
import { Flex, Text, Box } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Flex alignItems="center" p={2} mt={6}>
      <Box ml={4}>
        <Link to="/">
          <Text fontWeight="bold" _hover={{ color: "blue.500" }}>
            All Events
          </Text>
        </Link>
      </Box>
      <Box ml={4}>
        <Link to="/event/1">
          <Text fontWeight="bold" _hover={{ color: "blue.500" }}>
            Event
          </Text>
        </Link>
      </Box>
      <Box ml={4}>
        <Link to="/event/new">
          <Text fontWeight="bold" _hover={{ color: "blue.500" }}>
            Add New Event
          </Text>
        </Link>
      </Box>
    </Flex>
  );
};
