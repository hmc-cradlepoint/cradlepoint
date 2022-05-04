import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';
import {modalFormType} from '../../util/modalUtils';

/**
 * 
 * @param {*} props 
 *      - modalFormType: what kind of flow this should be (edit or create new)
 *      - onClose: called when user is done with the modal
 *      - isOpen: whether the model is visible
 *      - onBack: close modal without submitting
 *      - [ONLY for create new flow] testPlanId: the parent testPlan id 
 *      - [ONLY for create new flow] cloneData: data of the testCase we want to clone if cloning, else null if add from scratch
 *      - [ONLY for create new flow] isClone: boolean of whether we are cloning a test case
 *      - [ONLY for edit flow] data: original data of a test case 
 * @returns div of Test Case modal
 */
export default function TestCaseModalForm(props) {
  const router = useRouter();

  // initial data is different depending on whether we are cloning
  const initialData = (props.isClone)? 
    {
      _id: new ObjectID(),
      name: (props.cloneData?.name??"") + " (copy)",
      description: props.cloneData?.description??"",
      config: props.cloneData?.config??"",
      topology: props.cloneData?.topology??"",
      BOM: props.cloneData?.BOM??[],
      tests: props.cloneData?.tests??[]
    }:{
      _id: props.data?._id??new ObjectID(),
      name: props.data?.name??"",
      description: props.data?.description??"",
      config: props.data?.config??"",
      topology: props.data?.topology??"",
      BOM: [],
      tests: []
    }
  
  // state variable to keep track of the fields
  const [data, setData] = useState(initialData)

  /**
   * calls whenever user make changes to the fields to update the data variable
   * @param {*} evt onChange event
   */
  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }

  /**
   * triggers by onClick of the Done button and calls the corresponding api 
   */
  async function handleSubmitData() {
    let newData = {
      ...props.data, 
      "_id":data._id.toString(), 
      "name":data.name, 
      "description":data.description,
      "testPlanId": props.testPlanId,
      "topology": data.topology,
      "config": data.config,
      "BOM": data.BOM,
      "tests": data.tests,
    }
    
    // Calls corresponding api depending on modalFormType and whether we are cloning
    let endPoint = '/api/edit/TestCase';
    let method = 'PUT';
   
    if (props.modalFormType===modalFormType.NEW){
      method = 'POST';
      endPoint = props.isClone?'/api/cloneTestCase':'/api/add/NewTestCase';
    } 

    console.log(newData);
    const d = JSON.stringify(newData);
    console.log("d ", d);

    try{
      const d = JSON.stringify(newData);
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(d)
        },
        body: d
      })
      console.log("RES:", res)
    } catch (err){
      console.log("Error:",err)
    }
    props.onClose();
    if (props.modalFormType==modalFormType.NEW){
      setData(initialData);
    }
  }

  return (
    <Modal className={styles.content} isOpen={props.isOpen} overlayClassName={styles.overlay}>
        <h2>Fill in New Test Case Info</h2>
        {/* fields */}
        <div style={{alignItems:borderLeft}}>
          <SmallTextInput label="Name:" name='name' value={data.name} onChange={handleChange}/>
          {/* TODO: will be a file upload here instead */}
          <SmallTextInput label="Topology:" name='topology' value={data.topology} onChange={handleChange}/>
          <BigTextInput label="Description:" name='description' value={data.description} onChange={handleChange}/>
          <BigTextInput label="Config:" name='config' value={data.config} onChange={handleChange}/>
        </div>
        
        {/* Buttons */}
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <CPButton text='Back' onClick={()=>{
            setData(initialData);
            props.onBack();}}/>
          <CPButton text='Done' onClick={handleSubmitData}/>
        </div>
      </Modal>
  );
}
