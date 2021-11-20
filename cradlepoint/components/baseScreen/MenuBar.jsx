import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function MenuBar() {
    return (
    // TODO: add navigation
    <Stack direction="row" spacing={4} padding={2} borderBottom="1px solid">
      <Button >Home</Button>
      <Button>Test Plan Library</Button>
      <Button>Test Case Library</Button>
      <Button>Device Library</Button>
      <Button>Notifications</Button>
      <Button>Logout</Button>
      <Button>Help</Button>
    </Stack>
    )
}
