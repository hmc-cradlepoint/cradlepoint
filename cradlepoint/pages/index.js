import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';

import Select from 'react-select'

import PlainScreen from '../components/baseScreen/PlainScreen';
import SplitScreen from '../components/baseScreen/SplitScreen';
import CPButton from '../components/button/CPButton';
import {CheckBoxTable, PlainTable } from '../components/tables/Table';
import { SmallTextInput, BigTextInput } from '../components/fields/Text';

export default function Home() {
  return (
    <>
      <PlainScreen>
        <CPButton text="I'm at Cradlepoint Button!"/>
        
      </PlainScreen>
      <SplitScreen
        leftSection={
          <h1>test</h1>
        }
        rightSection={
          <h1>test2</h1>
        }
      />

    </>
  )
}

export async function getServerSideProps(context) {

  let isConnected;
  try {
    const client = await clientPromise
    isConnected = true;
  } catch(e) {
    console.log(e);
    isConnected = false;
  }

  return {
    props: { isConnected },
  }
}