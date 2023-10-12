import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
  Select,
  Textarea,
} from "@chakra-ui/react";

export const EventEditForm = ({
  event,
  onClose,
  updateEvent,
  setEvent,
  deleteEvent,
}) => {
  //   setting the states
  const [formData, setFormData] = useState({
    ...event,
    // Making the category an array, because otherwise I got an error in my events page.
    categoryIds: Array.isArray(event.categoryIds)
      ? event.categoryIds
      : [event.categoryIds],
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  //   fetch the users
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  //    fetch the categories
  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  //   Function to handle changes in the input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "createdBy" ? Number(value) : value,
    }));
  };

  //   Function to handle changes in the category field
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      categoryIds: [Number(value)],
    }));
  };

  //   Function that cleans up the formData to only include the fields I want
  const cleanFormData = (data) => {
    return {
      title: data.title || "",
      description: data.description || "",
      image: data.image || "",
      categoryIds: data.categoryIds || null,
      startTime: data.startTime || "",
      endTime: data.endTime || "",
      createdBy: data.createdBy || null,
      id: data.id || null,
    };
  };

  const toast = useToast();

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const cleanedData = cleanFormData(formData);
    const updateSuccessful = await updateEvent(cleanedData);
    if (updateSuccessful) {
      setEvent(cleanedData);

      toast({
        title: "Event updated",
        description: " Your event has been succesfully updated",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Update failed.",
        description: "There was a problem updating your event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  // Function to delete an event
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      const deleteSuccesful = await deleteEvent(event.id);
      if (deleteSuccesful) {
        toast({
          title: "Event deleted",
          description: "Your event has been successfully deleted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose(); // Close the modal after deleted
      } else {
        toast({
          title: "Deletion failed.",
          description: "There was a problem deleting your event.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      {/* Edit Title */}
      <FormControl id="title" mb={4}>
        <FormLabel>Title</FormLabel>
        <Input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Edit title"
        />
      </FormControl>

      {/* Edit Image*/}
      <FormControl id="image" mb={4}>
        <FormLabel>Image URL</FormLabel>
        <Input
          value={formData.image}
          type="text"
          name="image"
          onChange={handleInputChange}
          placeholder="Edit image URL"
        />
      </FormControl>

      {/* Edit Description */}
      <FormControl id="description" mb={4}>
        <FormLabel>Discription</FormLabel>
        <Textarea
          value={formData.description}
          type="text"
          name="description"
          onChange={handleInputChange}
          placeholder="Edit description"
        />
      </FormControl>

      {/* Edit Category */}
      <FormControl id="categoryIds" mb={4}>
        <FormLabel>Category</FormLabel>
        <Select
          name="categoryIds"
          value={formData.categoryIds}
          onChange={handleCategoryChange}
          aria-label="Category"
          width="100%"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Edit Start Time */}
      <FormControl id="startTime" mb={4}>
        <FormLabel>Start Time</FormLabel>
        <Input
          type="datetime-local"
          name="startTime"
          value={formData.startTime ? formData.startTime.split(".")[0] : ""}
          onChange={handleInputChange}
        />
      </FormControl>

      {/* Edit End Time */}
      <FormControl id="endTime" mb={4}>
        <FormLabel>End Time</FormLabel>
        <Input
          type="datetime-local"
          name="endTime"
          value={formData.endTime ? formData.endTime.split(".")[0] : ""}
          onChange={handleInputChange}
        />
      </FormControl>

      {/* Edit Created By */}
      <FormControl id="createdBy">
        <FormLabel>Created By:</FormLabel>
        <Select
          name="createdBy"
          value={formData.createdBy}
          onChange={handleInputChange}
          aria-label="Created By"
          width="100%"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Delete button */}
      <ModalFooter>
        <Button type="submit" colorScheme="blue" mr={3}>
          Save
        </Button>
        <Button colorScheme="red" mr={3} onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </form>
  );
};
