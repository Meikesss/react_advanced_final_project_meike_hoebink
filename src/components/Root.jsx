import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";
import { CategoriesProvider } from "./CategoriesContext";

export const Root = () => {
  return (
    <CategoriesProvider>
      <Box mx={4}>
        <Navigation />
        <Outlet />
      </Box>
    </CategoriesProvider>
  );
};
