import UploadButton from "./button/UploadButton";
import CPButton from '../components/button/CPButton';

export default function UploadComponents(props) {
  console.log(props.downloadLink)
  if (props.downloadLink != '') {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <UploadButton 
          filename = {props.filename} 
          updateDocument = {props.updateDocument}
        />
        <CPButton 
          href={props.downloadLink}
          text="Download File"
        />
      </div>
    )
  }
  else {
    return (
      <UploadButton filename = {props.filename} updateDocument = {props.updateDocument}/>
    );
  }
  

}