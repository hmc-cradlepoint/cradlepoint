import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LinkedButton from '../../components/button/LinkedButton';

export default function MenuBar() {
    return (
    <Stack direction="row" spacing={4} padding={2} borderBottom="1px solid">
      <LinkedButton href="/2home" name="Home"/>
      <LinkedButton href="/TestPlanLibrary" name="Test Plan Library"/>
      <LinkedButton href="/TestCaseLibrary" name="Test Case Library"/>
      <LinkedButton href="/DeviceLibrary" name="Device Library"/>
      <Button>Notification</Button>
      <Button>Logout</Button>
      <Button>Help</Button>
    </Stack>
    )
}
