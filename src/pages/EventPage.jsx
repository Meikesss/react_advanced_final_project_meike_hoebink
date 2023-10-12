import React, { useState } from "react";
import {
  Heading,
  Box,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { EventEditForm } from "./EventEditForm";

// Loader function to fetch and return event %user data
export const loader = async ({ params }) => {
  //  Fetch the events
  const eventResponse = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const event = await eventResponse.json();

  // Fetch the categories
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const categories = await categoriesResponse.json();

  //  Fetch the users
  const usersResponse = await fetch("http://localhost:3000/users/");
  const users = await usersResponse.json();

  return {
    event,
    categories,
    users,
  };
};

export const EventPage = () => {
  const { event: initialEvent, users, categories } = useLoaderData();
  const [event, setEvent] = useState(initialEvent);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const updateEvent = async (formData) => {
    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error("Failed to update event.");
      return false;
    } else {
      return true;
    }
  };
  if (!event || !users) return <div>Loading event...</div>;

  const createdByUser = users.find((user) => user.id === event.createdBy);

  const categoriesForEvent = (event.categoryIds || [])
    .map((categoryId) => {
      const foundCategory = categories.find(
        (category) => category.id === categoryId
      );
      return foundCategory ? foundCategory.name : null;
    })
    .filter(Boolean);

  // Function to format the datetime for better readability
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr || typeof dateTimeStr !== "string") return "N/A";
    const [date, time] = dateTimeStr.split("T");
    const [hour, minute] = time.split(":");
    return `${date} ${hour}:${minute}`;
  };

  // Function to redirect user to the EventsPage
  const redirect = useNavigate();

  // Funcion to delete an event
  const handleDelete = async (eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Failed to delete event.");
      return false;
    }

    // Redirect to EventsPage after successful deletion
    redirect("/");
    return true;
  };

  return (
    <Flex
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        className="event-detail"
        padding={4}
        borderWidth="1px"
        borderRadius="lg"
        direction="column"
        justifyContent="flex-start"
        maxWidth="100vh"
      >
        <Button
          onClick={() => navigate("/")}
          colorScheme="blue"
          alignSelf="flex-start"
          mb={2}
          variant="ghost"
        >
          Back to All Events
        </Button>

        <Image
          src={event.image}
          alt={event.title}
          width="100%"
          maxH="30vh"
          objectFit="cover"
        />
        <Box
          mt={4}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
        >
          <Heading mt={0} mb={2} textAlign="left">
            {event.title}
          </Heading>
          <Badge colorScheme="blue" mt={2}>
            {categoriesForEvent}
          </Badge>

          <Text mb={2}>{event.description}</Text>
          <Box>
            <Text>Start Time: {formatDateTime(event.startTime)}</Text>
            <Text>End Time: {formatDateTime(event.endTime)}</Text>
          </Box>
        </Box>
        <Box mt={4}>
          <Text mb={1}>Created by:</Text>
          {createdByUser && (
            <VStack spacing={2} alignItems="flex-start">
              <Image
                src={createdByUser.image}
                alt={createdByUser.name}
                width={["60px", "40px"]}
                borderRadius="full"
              />
              <Text>{createdByUser.name}</Text>
            </VStack>
          )}
        </Box>
        <Button
          onClick={onOpen}
          mt={4}
          colorScheme="blue"
          alignSelf="flex-end"
          size="sm"
        >
          Edit Event
        </Button>

        {/* Modal for editing event */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EventEditForm
                event={event}
                onClose={onClose}
                updateEvent={updateEvent}
                setEvent={setEvent}
                users={users}
                categories={categories}
                deleteEvent={handleDelete}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};
