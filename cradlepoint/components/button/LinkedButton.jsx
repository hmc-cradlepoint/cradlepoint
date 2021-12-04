import { Button } from "@mui/material"
import Link from 'next/link'

export default function LinkedButton({href, name}) {
    // Must add passHref to Link
    // console.log(name);
    return (
      <Link href={href} passHref>
        <Button>{name}</Button>
      </Link>
    )
  }
  