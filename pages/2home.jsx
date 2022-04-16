import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { useRouter } from 'next/router'
import { PlainTable } from "../components/tables/Table";
import CPButton from '../components/button/CPButton';
import EngagementModalForm from './ModalForms/EngagementModalForm';
import { modalFormType } from '../util/modalUtils';
import { engagementColumns } from '../util/tableColumns';
import styling from '../styles/tableStyling';
import { useNavContext } from '../context/AppWrapper';
import NavDir from '../components/navDir';
import {getActiveEngagements} from "./api/getActiveEngagements";

// TOOD: figure out with not clearing the history when going back

export default function HomeScreen(props) {
    const router = useRouter();
    const refreshData = ( () => {
      router.replace(router.asPath);
  })
    const useStyles = makeStyles({styling});
    const classes = useStyles();
    
    const { directory, dispatch } = useNavContext();
    
    function handleNavigation(id) {
      const nextPage = "/3EngagementDetails?_id=" + id;
      const payload = {title: "Engagement Details", url: nextPage};
      router.push(nextPage);
      dispatch({type: "ADD_PAGE", payload: payload});
    }

    // TODO: put this in a util folder
    async function exportToJson(id) {
      // get export data
      const jsonData = await (await fetch(`/api/getEngagementDetails?_id=${id}`)).json();
      // style json
      let dataStr = JSON.stringify(jsonData, null, "\t");
      // export to downloadable json file  
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      let fileName = jsonData[0].name +'.json';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
    }

    async function deleteData(resId) {
      let data = { "_id": resId }
      try {
          const res = await fetch("/api/deleteEngagement", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          })
          console.log("RES:", res)
      } catch (err) {
          console.log("Error:",err)
      }
      refreshData();
    }

    const engagementColumnsWithActions = engagementColumns.concat([
        { 
          field: 'button', 
          flex: 3,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          renderCell: (params) => (
            <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="View" onClick={() => handleNavigation(params.id)}/>
            <CPButton text="Export as json" onClick={() => exportToJson(params.id)}/>
            <CPButton text="Delete" onClick={() => deleteData(params.id)}/>
           </div>
          ),
        }
      ]);

    const [createNewFlow, setCreateNewFlow] = useState(false);
  
    return(
      <div >
        <EngagementModalForm  modalFormType={modalFormType.NEW} 
                              isOpen={createNewFlow} 
                              onBack={() => setCreateNewFlow(false)} 
                              onClose={()=> {setCreateNewFlow(false); refreshData();}}/>
     
        <PlainScreen>
        <NavDir pages={directory} />
        <h1>Home</h1>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <h2>Engagements</h2>
              <CPButton 
              text="Add New"
              onClick={() => setCreateNewFlow(true)}
            />
          </div>
          <PlainTable rows={props.data} columns={engagementColumnsWithActions} className={classes.root}/>
      </PlainScreen>
      </div>
    )
}

export async function getServerSideProps(context) {
  const data = await getActiveEngagements();
  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: {data}, // will be passed to the page component as props
  }
}