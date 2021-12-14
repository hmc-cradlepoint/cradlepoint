import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router'
import { ObjectID } from 'bson';

export default function TestModalForm(props) {
  const router = useRouter();
  const [data, setData] = useState({
    _id: new ObjectID(),
    name: "",
    details: "",
    results: [],
    testCaseId: props.ID,
  })

  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }

  async function addNew() {
    const res = await fetch(`/api/addNewTest`, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    router.push("/6TestDetails?_id=" + data._id);
  }

  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Test Info</h2>

        <div style={{alignItems:borderLeft}}>
          <SmallTextInput label="Subject" name='name' value={data.subject} onChange={handleChange} />
          <BigTextInput label="Description" name='details' value={data.description} onChange={handleChange} />
        </div>

        <CPButton text='Back' onClick={props.onBack} />
        <CPButton text='Create' onClick={addNew} />
      </Modal>
  );
}
