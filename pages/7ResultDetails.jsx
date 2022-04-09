import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import styles from '../styles/EngagementDetails.module.css';
import { resultColumns } from '../util/tableColumns';
import ResultModalForm from './ResultModalForm';
import styling from '../styles/tableStyling';
import EditModalFlow from './editModalFlow';
import { flowType } from '../util/modalUtils';
import NavDir from '../components/navDir';
import { useNavContext } from '../context/AppWrapper';

export default function ResultDetails(props) {
    const { directory, dispatch } = useNavContext();

    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })
    

    const [editModalFlow, setEditModalFlow] = useState(false);

    
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
            <p>Evidence: {props.resultData.evidence}</p>
            <p>Status: {props.resultData.resultStatus}</p>
            <p>Date Created: {props.resultData.createdOn}</p>
        </div>
        )
    }
    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
               <h2>Detailed Description</h2>
               <p>{props.resultData.description}</p>
           </div>
        )
    }

    return (
        <div>
        <EditModalFlow data={props.resultData} type={flowType.RESULT} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
        <SplitScreen
            topChildren={
                <>
                <NavDir pages={directory} />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <h1>Result Details</h1>
                    <CPButton text="Edit"
                    onClick={()=>setEditModalFlow(true)}/>
                </div>
                </>
                }
            leftSection={details()}
            rightSection={description()}
            bottomChildren={
                <div>
   
                </div>
            }
        />
        </div> 
 
    )
}

import {getResult} from "./api/getResult";

export async function getServerSideProps(context) {
    const res = await getResult(context.query._id);
    const resultData = res[0];
    
    return {
      props: {resultData}, // will be passed to the page component as props
    }
  }