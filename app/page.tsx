'use client';

import React, { useState, FormEvent } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Heading, useToast } from '@chakra-ui/react';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const toast = useToast();

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    if (username === 'admin' && password === 'adminpassword') {
      toast({
        title: 'Admin Login successful.',
        description: 'Redirecting to admin dashboard...',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.href = '/admin'; // Redirect to admin page
      }, 1500);
    } else if (username === 'user' && password === 'userpassword') {
      toast({
        title: 'User Login successful.',
        description: 'Redirecting to user dashboard...',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.href = '/user'; // Redirect to user page
      }, 1500);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
    >
      <VStack
        as="form"
        onSubmit={handleLogin}
        spacing={4}
        w="full"
        maxW="md"
        p={6}
        bg="white"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h1" size="lg">
          Login
        </Heading>
        {error && <Text color="red.500">{error}</Text>}
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" w="full">
          Login
        </Button>
        <Text fontSize="sm" color="gray.500" mt={4}>
          For testing: Use <b>admin/adminpassword</b> for admin or <b>user/userpassword</b> for user.
        </Text>
      </VStack>
    </Box>
  );
}
