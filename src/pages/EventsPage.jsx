import React, { useContext } from "react";
import {
  Heading,
  Button,
  Box,
  Input,
  Select,
  Image,
  Text,
  Flex,
  Grid,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CategoriesContext } from "../components/CategoriesContext";

export const EventsPage = () => {
  // Setting up stage to hold the fetched events and categories
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Keep track of the search term
  const [filteredCategory, setFilteredCategory] = useState(""); // Keep track of the filtered category

  // Get categories from the context
  const { categories } = useContext(CategoriesContext);

  // fetching the events
  useEffect(() => {
    async function fetchData() {
      const eventsResponse = await fetch("http://localhost:3000/events");
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
    }

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilteredCategory(event.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearchTerm =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filteredCategory || event.categoryIds.includes(Number(filteredCategory));

    return matchesSearchTerm && matchesCategory;
  });

  // Function to map category id to names
  const getCategoryNames = (categoryIds = []) => {
    if (!Array.isArray(categoryIds)) {
      console.error("categoryIds is not an array:", categoryIds);
      return "";
    }

    return categoryIds
      .map((id) => {
        const category = categories.find((cat) => cat.id === id);
        return category ? category.name : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr || typeof dateTimeStr !== "string") return "N/A";
    const [date, time] = dateTimeStr.split("T");
    if (!date || !time) return "N/A"; // Added check for added safety
    const [hour, minute] = time.split(":");
    return `${date} ${hour}:${minute}`;
  };

  return (
    <Box p={5}>
      <Heading mb={4}>List of events</Heading>

      {/* Search field and Filter by Categories */}
      <Flex justifyContent="start" alignItems="center" mb={5}>
        {/* Search field */}
        <Input
          width="50%"
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
          mr={2}
        />

        {/* Category filter dropdown */}
        <Select
          width="25%"
          value={filteredCategory}
          onChange={handleCategoryChange}
          mr={2} // Added margin right for spacing
        >
          <option value="">Filter by Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        {/*Add new event button  */}
        <Button colorScheme="blue" as={Link} to="/event/new">
          Add Event
        </Button>
      </Flex>

      {/* Events Listing */}
      {filteredEvents.length === 0 ? (
        <Text>No results found</Text>
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              maxW="md"
              _hover={{ textDecoration: "none", transform: "translateY(-5px)" }}
              transition="transform 0.2s"
              height="55vh"
            >
              <Link to={`/event/${event.id}`}>
                <Image
                  src={event.image}
                  alt={event.title}
                  width="100%"
                  height="50%"
                  objectFit="cover"
                  mb={4}
                />
                <Box p={4}>
                  <Heading
                    mt="1"
                    fontWeight="semibold"
                    as="h2"
                    size="md"
                    lineHeight="tight"
                    noOfLines={1}
                  >
                    {event.title}
                  </Heading>
                  <Text mb={2}>{event.description}</Text>
                  <Text mb={2}>
                    Date: {formatDateTime(event.startTime)} -{" "}
                    {formatDateTime(event.endTime)}
                  </Text>
                  <Badge colorScheme="teal" px={2} py={1}>
                    {getCategoryNames(event.categoryIds)}
                  </Badge>
                </Box>
              </Link>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};
