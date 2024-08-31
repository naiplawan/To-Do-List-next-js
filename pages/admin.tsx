'use client';
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Checkbox,
  Container,
  Heading,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function AdminPage() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const defaultRoomID = "defaultRoom"; // Default roomID

  const ws = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
      ws.current?.send(JSON.stringify({ action: 'joinRoom', roomID: defaultRoomID }));

      // Start sending pings every 30 seconds to keep the connection alive
      pingIntervalRef.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ action: 'ping' }));
        }
      }, 30000);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tasks) {
        setTodos(data.tasks);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Failed to connect to the server.');
    };

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      ws.current?.close();
    };
  }, [defaultRoomID]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && ws.current && ws.current.readyState === WebSocket.OPEN) {
      const newTask = {
        text: event.currentTarget.value,
        completed: false,
        assignee: "assigneeName",
      };
      ws.current.send(JSON.stringify({ action: 'newTask', roomID: defaultRoomID, newTask }));
      event.currentTarget.value = "";
    }
  };

  const handleDeleteToDo = (index: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'deleteTask', roomID: defaultRoomID, index }));
    }
  };

  return (
    <Container
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      centerContent
      bg="linear-gradient(to right, var(--background-start-rgb), var(--background-end-rgb))"
    >
      <Box
        bg="var(--card)"
        color="var(--card-foreground)"
        p={8}
        borderRadius="var(--radius)"
        shadow="lg"
        maxW="sm"
        w="full"
        textAlign="center"
      >
        <Heading as="h1" size="lg" mb={6}>
          Admin To-do List 📝
        </Heading>
        <Input
          mb={4}
          bg="var(--input)"
          color="var(--foreground)"
          placeholder="Enter a new task"
          onKeyDown={handleKeyDown}
        />
        <VStack spacing={4} align="stretch">
          {todos.map((todo, index) => (
            <HStack
              key={index}
              bg={todo.completed ? "var(--chart-1)" : "var(--card)"}
              color="var(--foreground)"
              p={4}
              borderRadius="var(--radius)"
              shadow="md"
              justifyContent="space-between"
              alignItems="center"
            >
              <Checkbox
                isChecked={todo.completed}
                colorScheme="green"
              >
                {todo.text}
              </Checkbox>
              <IconButton
                aria-label="Delete task"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => handleDeleteToDo(index)}
              />
            </HStack>
          ))}
        </VStack>
      </Box>
    </Container>
  );
}
