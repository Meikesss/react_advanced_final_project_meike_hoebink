import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";
import { CategoriesProvider } from "../contexts/CategoriesContext";
import { UsersProvider } from "../contexts/UsersContext";

export const Root = () => {
  return (
    <CategoriesProvider>
      <UsersProvider>
        <Box mx={4}>
          <Navigation />
          <Outlet />
        </Box>
      </UsersProvider>
    </CategoriesProvider>
  );
};
