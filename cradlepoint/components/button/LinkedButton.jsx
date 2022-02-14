import Button from '@mui/material/Button';
import Link from 'next/link';

export default function LinkedButton({href, name, onClick}) {
    // Must add passHref to Link
    // console.log(name);
    return (
      <Link href={href} passHref>
        <Button onClick={onClick}>{name}</Button>
      </Link>
    )
  }
  