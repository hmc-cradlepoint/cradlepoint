import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { useRouter } from 'next/router'
import { PlainTable } from "../components/tables/Table";
import CPButton from '../components/button/CPButton';
import EngagementModalForm from './ModalForms/EngagementModalForm';
import DeleteModalForm from './ModalForms/DeleteModalForm';
import { modalFormType } from '../util/modalUtils';
import { engagementColumns } from '../util/tableColumns';
import styling from '../styles/tableStyling';
import { useNavContext } from '../context/AppWrapper';
import NavDir from '../components/navDir';
import {getActiveEngagements} from "./api/getActiveEngagements";

/**
 * 
 * @param {*} props data: all the active engagements
 * Passed in from getServerSideProps() function on the bottom of this document
 * @returns Home Page as a div
 */
export default function HomeScreen(props) {
  // TOOD: figure out with not clearing the history when going back
  // used for refreshing data after changes are made 
    const router = useRouter();
    const refreshData = ( () => {
      router.replace(router.asPath);
    })

    // styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    // navigation
    const { directory, dispatch } = useNavContext();
    function handleNavigation(id) {
      const nextPage = "/3EngagementDetails?_id=" + id;
      const payload = {title: "Engagement Details", url: nextPage};
      router.push(nextPage);
      dispatch({type: "ADD_PAGE", payload: payload});
    }

    // Delete: variables and functions related to deleting an Engagement
    // an instance variable to store id of the engagement to delete 
    let paramId;
    const getParams = (id) => {paramId = id}
    
    // controls whether delete modal is visiable
    const [deleteModal, setDeleteModal] = useState(false);
    
    // helper function that is passed into the deleteModal
    const handleDelete = () => {
      deleteData(paramId);
      setDeleteModal(false);
    }

    /**
     * 
     * @param {*} resId the Engagement id that needs to be deleted
     * calls deleteEngagement api
     */
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
    //----------------------------------------------------------
    

    /**
     * 
     * @param {*} id the engagementId of the engagement that is being exported to a json file
     * calls getEngagementDetails api, exports all details to a json file and download for automatically
     */
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

  
    // the Engagement table columns
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
            <CPButton text="Delete" onClick={() => {setDeleteModal(true)}}/>
            {getParams(params.id)}
           </div>
          ),
        }
      ]);
    
    // state to control whether EngagementModalForm modal is visible
    const [createNewFlow, setCreateNewFlow] = useState(false);
  
    return(
      <div >
        <EngagementModalForm  modalFormType={modalFormType.NEW} 
                              isOpen={createNewFlow} 
                              onBack={() => setCreateNewFlow(false)} 
                              onClose={()=> {setCreateNewFlow(false); refreshData();}}/>
        <DeleteModalForm isOpen={deleteModal} onBack={() => setDeleteModal(false)} handleDelete={() => handleDelete()}/>
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

/**
 * 
 * @param {*} context 
 * @returns retrives all the necessary props to load the page
 */
export async function getServerSideProps(context) {
  // get all the active engagements
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