import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import PropTypes from 'prop-types';
import { Field, Formik} from 'formik';
import DropDown from "../components/fields/DropDown";
import { useRouter } from 'next/router'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";

/**
 * 
 * @param {*} props 
 *      - onBack: called when user wants to close modal without submitting form
 *      - isOpen: whether the model is visible
 * @returns div of Engagement modal
 */
export default function DeviceModalForm(props) {
    const router = useRouter();
    const initialData = {
      deviceName: "",
      codeVersion: "",
      SKU: "",
      deviceType: "Software",
    }

    // state variable to keep track of all the fields
    const [data, setData] = useState(initialData);
    
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
      console.log(data)
    }

    /**
     * triggers by onClick of the Done button and calls the corresponding api 
     */
    async function handleSubmitData() {
      let newData = {
        "deviceName":data.deviceName, 
        "codeVersion":data.codeVersion, 
        "SKU":data.SKU,
        "deviceType": data.deviceType
      }
      try{
        const res = await fetch('/api/addLibraryDevice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        })
      } catch (err){
        console.log("Error:",err)
      }
      props.onBack();
      
    }

  // Optionals for the device type drop down  
  const options = ["Software", "Hardware"];
  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Add New Device to Library</h2>
        {/* Fields */}
        <div style={{alignItems:borderLeft}}>
          <SmallTextInput label="Device Name:" name='deviceName' value={data.deviceName} onChange={handleChange}/>
          <SmallTextInput label="Code Version:" name='codeVersion' value={data.codeVersion} onChange={handleChange} />
          <SmallTextInput label="SKU:" name='SKU' value={data.SKU} onChange={handleChange} />
          <DropDown title="Device Type: " fieldName="deviceType" value={data.deviceType} 
              onChange={handleChange} options={options}/>
        </div>

        {/* Buttons */}
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <CPButton text='Back' onClick={()=>{
            setData(initialData);
            props.onBack()
          }}/>
          <CPButton text='Create' onClick={handleSubmitData}/>
        </div>
      </Modal>
  );
}


