import React, { useState, useEffect } from "react";
import { Form, redirect } from "react-router-dom";
import {
  Flex,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
} from "@chakra-ui/react";

export const action = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  //

  // Ensure that startTime and endTime have the correct format
  formData.startTime += ":00.000Z";
  formData.endTime += ":00.000Z";

  // Save the event
  const newId = await fetch("http://localhost:3000/events", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.id);

  return redirect(`/event/${newId}`);
};

export const NewEvent = () => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetches and sets the categories from the server
  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data); // Setting the categories state
    }

    fetchCategories();
  }, []);

  // Fetches and sets the users from the server. The assignment did not specify to add a new user.
  // Because I;m on a tight deadline, I decided to do this one the same as the categories,
  // so only fetching existing users.
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data); // Setting the users state
    }
    fetchUsers();
  }, []);

  return (
    <Flex width="100vw" alignItems="center" justifyContent="center" mt={20}>
      <Flex
        direction="column"
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        width={["90%", "70%", "60%", "50%"]}
      >
        <Heading mb={6}>New Event</Heading>

        <Form method="post" id="new-event-form">
          <VStack align="start" spacing={6}>
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Event title..."
                aria-label="Title"
                type="text"
                name="title"
                width="100%"
                required
              />
            </FormControl>

            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                aria-label="Description"
                rows="6"
                placeholder="Enter event description..."
                width="100%"
                required
              />
            </FormControl>

            <FormControl id="image">
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="URL to event image..."
                aria-label="Image"
                type="text"
                name="image"
                width="100%"
                required
              />
            </FormControl>

            <FormControl id="startTime">
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                aria-label="Start Time"
                width="100%"
                required
              />
            </FormControl>

            <FormControl id="endTime">
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                aria-label="End Time"
                width="100%"
                required
              />
            </FormControl>

            <FormControl id="category">
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                aria-label="Category"
                width="100%"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="createdBy">
              <FormLabel>User</FormLabel>
              <Select
                name="createdBy"
                aria-label="Created By"
                width="100%"
                required
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" colorScheme="blue" mt={4}>
              Save
            </Button>
          </VStack>
        </Form>
      </Flex>
    </Flex>
  );
};
