import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import useUser from '../../util/useUser';
import { useRouter } from 'next/router';
import fetchJson from '../../util/fetchJson';


export default function MenuBar() {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  return (
    // TODO: add navigation
    <Stack direction="row" spacing={4} padding={2} borderBottom="1px solid">
      <Button >Home</Button>
      <Button>Test Plan Library</Button>
      <Button>Device Library</Button>
      <Button>Notifications</Button>
      {user?.isLoggedIn && (
        <Button onClick={async (e) => {
          e.preventDefault()
          mutateUser( await fetchJson('/api/logout', { method: 'POST' }),
                      false)
          router.push('/login')
        }}>Logout</Button>
      )}
      <Button>Help</Button>
    </Stack>
    )
}
