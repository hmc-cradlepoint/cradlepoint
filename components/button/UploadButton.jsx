
export default function UploadButton(props) {
    const uploadPhoto = async (e) => {
      const file = e.target.files[0];
      const filename = encodeURIComponent(file.name);
      const finalFilename = props.filename + "." + filename.split('.').pop()
      const res = await fetch(`/api/uploadUrl?file=${finalFilename}`);
      const { url, fields } = await res.json();
      const formData = new FormData();
      
  
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const upload = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      await props.updateDocument(finalFilename)
  
      if (upload.ok) {
        console.log('Uploaded successfully!');
      } else {
        console.error('Upload failed.');
      }
    };
  
    return (
      <>
        {/* <p>Upload a file</p> */}
        <input
          onChange={uploadPhoto}
          type="file"
        //   accept="image/png, image/jpeg"
        />
      </>
    );
  }