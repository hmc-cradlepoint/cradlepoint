import UploadButton from "./button/UploadButton";
import {downloadUrl} from "../pages/api/downloadUrl";

export default function UploadComponents(props) {
  console.log(props.downloadLink)
  if (props.downloadLink != '') {
    console.log('here')
    return (
      <div>
        <a href={props.downloadLink} > Link </a>
        <UploadButton filename = {props.filename} updateDocument = {props.updateDocument}/>
      </div>

    )
  }
  
  else {
    console.log('there')
    return (
      <UploadButton filename = {props.filename} updateDocument = {props.updateDocument}/>
    );
  }
  

}