import { Card, Tooltip, Result, Button, Modal, Form, TreeSelect, Input, InputNumber, Upload, message } from "antd";
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import contractInfo from "contracts/contractInfo.json";
import Address from "components/Address/Address";
import { useMoralis } from "react-moralis";
import Arweave from 'arweave'



const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
    color: "rgb(33, 191, 150)",
    fontWeight: "600",
    borderColor:""
    
  },
  text: {
    color: "#21BF96",
  },
};

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});



export const PTModalButton = () => {
  const { user, authenticate, isAuthenticated, Moralis } = useMoralis();
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [form] = Form.useForm();
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setVisible(false);
  };
  
  return (
    <div>
    <Button
    type="primary"
    onClick={() => {
      if(!isAuthenticated) {
        authenticate({ signingMessage: "Log in to upload." }).then(() => {
          if(!isAuthenticated) {
            return
          }
          setVisible(true);
          form.resetFields();
          setLocked(true);
        });
      }
      else {
        setVisible(true);
        form.resetFields();
        setLocked(true);
      }
    }}
    style={styles.account}
    >
    Upload
    </Button>
    <UploadPopup
    visible={visible}
    onCreate={onCreate}
    onCancel={(...funcs) => {
      setVisible(false);
      form.resetFields();
      funcs.forEach(func => func());
    }}
    locked={locked}
    setLock={setLocked}
    form={form}
    />
    </div>
    );
  };
  
  export const UploadPopup = ({ visible, onCreate, onCancel, locked, setLock, form }) => {
    const [uploaded_file, setUploaded] = useState(null);
    const [uploadingAr, setUploadingAr] = useState(false);
    const [uploadingIPFS, setUploadingIPFS] = useState(false);
    const [alertTitle, setalertTitle] = useState("Successfully Uploaded to Paper Trail!");
    const [alertState, setalertState] = useState("success");
    const [showAlert, setShowAlert] = useState(false);
    const [feeMsg, setArFee] = useState(null);
    const [arTransaction, setArTransaction] = useState(null);
    const [alertSubtitle, setalertSubtitle] = useState(<p>Post ID: 345345345 | URL: <a href="www.papertrail.io/post/345345345">www.papertrail.io/post/345345345</a></p>);
    const props = {
      name: 'file',
      async onChange(info) {
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          var reader = new FileReader();
          reader.onload = async function (event) {
            setUploaded({name: info.file.name, base64: reader.result})
            console.log(uploaded_file);
            if(uploaded_file == null) {
              return
            }
            var blobby = await (await fetch(uploaded_file.base64)).blob();
            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = async function(event) {
              arrayBuffer = event.target.result;
              var tx = await arweave.createTransaction({data: arrayBuffer}).catch(displayError);
              tx.addTag('Content-Type', blobby.type);
              setArFee(parseFloat(tx.reward)/(10**(12)))
              console.log(tx)
              setArTransaction(tx)
            };
            fileReader.readAsArrayBuffer(blobby);
            form
            .validateFields()
            .then(() => {setLock(false);})
            .catch((e) => {console.log(e);});
          }
          reader.readAsDataURL(info.file.originFileObj);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    
    function displayError(e) {
      setalertTitle("Error Uploading to Arweave");
      setalertState("error");
      setalertSubtitle(e.message);
      setShowAlert(true);
      setUploadingAr(false);
      setUploadingIPFS(false);
    }
    
    async function connectArweave() {
      return await window.arweaveWallet.connect("ACCESS_ADDRESS");
    }
    
    async function uploadAr() {
      form
      .validateFields()
      .then(async (values) => {
        await arweave.transactions.sign(arTransaction).catch(displayError);
        let uploader = await arweave.transactions.getUploader(arTransaction);
        while (!uploader.isComplete) {
          await uploader.uploadChunk();
          console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        }
        console.log(uploader)
        console.log(arTransaction)
        console.log(values);
        const database_item = PTObject.spawn(values.title, values.desc, "https://arweave.net/tx/" + arTransaction.id, values.fee, values.license)
        database_item.save().then((item) => {
          // Execute any logic that should take place after the object is saved.
          setalertTitle("Successfully Uploaded to Paper Trail!");
          setalertState("success");
          setalertSubtitle(<p>Post ID: {database_item.id} | URL: <a href={window.location.protocol + "//" + window.location.host + + "/post/" + database_item.id}>{window.location.protocol + "//" + window.location.host + "/post/" + database_item.id}</a></p>);
          setShowAlert(true);
          setLock(true);
          setUploadingAr(false);
        }, (e) => {
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          displayError(e)
        });
        console.log(database_item)
        setUploaded(database_item)

      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
    }
    
    async function uploadIPFS() {
      form
      .validateFields()
      .then(async (values) => {
        const file = new Moralis.File(uploaded_file.name, {base64: uploaded_file.base64});
        var uploaded_new = await file.saveIPFS();
        console.log(uploaded_new)
        console.log(values);
        const database_item = PTObject.spawn(values.title, values.desc, uploaded_new._ipfs, values.fee, values.license)
        database_item.save().then((item) => {
          // Execute any logic that should take place after the object is saved.
          setalertTitle("Successfully Uploaded to Paper Trail!");
          setalertState("success");
          setalertSubtitle(<p>Post ID: {database_item.id} | URL: <a href={window.location.protocol + "//" + window.location.host + "/post/" + database_item.id}>{window.location.protocol + "//" + window.location.host + "/post/" + database_item.id}</a></p>);
          setShowAlert(true);
          setUploadingIPFS(false);
          setLock(true);
        }, (e) => {
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          displayError(e)
        });
        console.log(database_item)
        setUploaded(database_item)

      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
    }
    function visit() {
      window.open(window.location.protocol + "//" + window.location.host + "/post/" + uploaded_file?.id)
    }
    const normFile = (e) => {
      console.log('Upload event:', e);
      
      if (Array.isArray(e)) {
        return e;
      }
      
      return e && e.fileList;
    };
    const { user, Moralis } = useMoralis();
    class PTObject extends Moralis.Object {
      constructor() {
        // Pass the ClassName to the Moralis.Object constructor
        super('PTObject');
      }
      static spawn(title, desc, url, fee, license) {
        const bundle = new PTObject();
        bundle.set('title', title);
        bundle.set('desc', desc);
        bundle.set('author', user.attributes.ethAddress);
        bundle.set('url', url);
        bundle.set('fee', fee);
        bundle.set('date', Date.now());
        var license_url = license.substring(license.indexOf(",") + 1);
        bundle.set('license_name', license.substring(0, license.indexOf(",")));
        bundle.set('license_url', license_url);
        return bundle;
      }
    }
    const tailLayout = {
      wrapperCol: {
        offset: 8,
        span: 16,
      },
    };
    return (
      <Modal
      visible={visible}
      title="Upload Post"
      onCancel={() => {onCancel(setUploadingAr, setUploadingIPFS, setShowAlert, setArFee)}}
      footer={[]}
      >
      <Form
      form={form}
      layout="vertical"
      name="form_in_modal"
      initialValues={{
        modifier: 'public',
        fee: "0",
        license:"none"
        
      }}
      onChange={() => {
        form
        .validateFields()
        .then(() => {setLock(false);})
        .catch((e) => {setLock(true);});
      }}
      >
      <Form.Item
      name="title"
      label="Title"
      placeholder="Title of the post"
      rules={[
        {
          required: true,
          message: 'Please input the title of your post!',
        },
      ]}
      >
      <Input />
      </Form.Item>
      <Form.Item name="desc" label="Description" placeholder="briefly describe the post."
      rules={[
        {
          required: true,
          message: 'Please input the description of your post!',
        },
      ]}>
      <Input type="textarea" />
      </Form.Item>
      <Form.Item
      name="fee"
      label="Comemrcial Licensing Fee (ETH)"
      rules={[
        {
          required: true,
          message: 'Please select a license for unpaid use.',
        }
      ]}
      >
      <InputNumber
      style={{
        width: 200,
      }}
      min="0"
      max="10"
      step="0.00000000000001"
      stringMode/>
      </Form.Item>
      <Form.Item
      label="Default License"
      name="license"
      rules={[
        {
          required: true,
          message: 'Please select a license for unpaid use.',
        }
      ]}
      >
      <TreeSelect
      treeData={[
        {
          title: 'Creative Commons',
          value: 'Creative Commons',
          selectable: false,
          children: [
            {
              title: 'CC BY 4.0',
              value: 'CC BY 4.0,https://creativecommons.org/licenses/by/4.0/',
            },
            {
              title: 'CC BY-SA 4.0',
              value: 'CC BY-SA 4.0,https://creativecommons.org/licenses/by-sa/4.0/',
            },
            {
              title: 'CC BY-NC 4.0',
              value: 'CC BY-NC 4.0,https://creativecommons.org/licenses/by-nc/4.0/',
            },
            {
              title: 'CC BY-NC-SA 4.0',
              value: 'CC BY-NC 4.0,https://creativecommons.org/licenses/by-nc-sa/4.0/',
            },
            {
              title: 'CC BY-ND 4.0',
              value: 'CC BY-ND 4.0,https://creativecommons.org/licenses/by-nd/4.0/',
            },
            {
              title: 'CC BY-NC-ND 4.0',
              value: 'CC BY-NC-ND 4.0,https://creativecommons.org/licenses/by-nc-nd/4.0/',
            },
            {
              title: 'CC Zero 1.0 (Public Domain)',
              value: 'CC Zero 1.0 (Public Domain),https://creativecommons.org/publicdomain/zero/1.0/',
            },
          ],
        },
        {
          title: 'All Rights Reserved',
          value: 'none'
        },
      ]}
      />
      </Form.Item>
      <Form.Item
      name="upload"
      label="Upload"
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[
        {
          required: true,
          message: 'Please select your files!',
        },
      ]}
      >
      <Upload {...props}>
      <Button icon={<UploadOutlined />}>Select File(s)</Button>
      </Upload>
      </Form.Item>
      <div style={{display:"flex", gap: "10px" }}>
      { window.arweaveWallet == null ?
        <Tooltip placement="topLeft" title={<p>You must install the <a href="https://www.arconnect.io/">ArConnect Wallet</a> to upload your files to Arweave</p>}>
        <Button type="primary" disabled="true" shape="round">Upload to Arweave</Button>
        </Tooltip>
        :
        <Tooltip placement="bottomLeft" title="Pay with $AR to upload your files to Arweave">
        <Button type="primary" disabled={uploadingIPFS || locked} loading={uploadingAr} shape="round"
        onClick={() => {
          async function upload() {
            setUploadingAr(true);
            uploadAr();
          }
          upload()
        }}>
        Upload to Arweave
        </Button>
        {feeMsg && <b sttyle={{position: "realtive", textAlign: "center"}}><br/>{"Fee: " + feeMsg + " AR"}</b>}
        </Tooltip>
      }
      <Tooltip placement="topRight" title={<p>If you do not have AR, you can upload to a <a href="https://docs.moralis.io/moralis-server/files/ipfs">centralized IPFS node.</a></p>}>
      <Button shape="round" disabled={uploadingAr || locked } loading={uploadingIPFS} onClick={() => {
        async function upload() {
          setUploadingIPFS(true);
          uploadIPFS();
        }
        upload()
      }}>Upload to IPFS</Button>
      </Tooltip>
      </div>
      {showAlert &&
        <Result
        status={alertState}
        title={alertTitle}
        subTitle={alertSubtitle}
        extra={[
          <Button type="primary" disabled={alertState != "success"} key="post" onClick={visit}>
          View Post
          </Button>,
          <Button key="exit" onClick={() => {onCancel(setUploadingAr, setUploadingIPFS, setShowAlert, setArFee)}}>Exit</Button>,
        ]}
        />
      }
      </Form>
      </Modal>
      );
    };
    
    export default function PTUpload() {
      const props = {
        name: 'file',
        async onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.file.data);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            var reader = new FileReader();
            reader.onload = async function (event) {
              const file = new Moralis.File(info.file.name, { base64: reader.result});
              var uploaded = await file.saveIPFS();
              console.log(uploaded)
            }
            reader.readAsDataURL(info.file.originFileObj);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
      const { user, Moralis } = useMoralis();
      class PTObject extends Moralis.Object {
        constructor() {
          // Pass the ClassName to the Moralis.Object constructor
          super('PTObject');
        }
        static spawn(title, desc, url, date) {
          const bundle = new PTObject();
          bundle.set('title', title);
          bundle.set('desc', desc);
          bundle.set('author', user.attributes.ethAddress);
          bundle.set('url', url);
          bundle.set('date', Date.now());
          return bundle;
        }
      }
      
      
      
      return (
        <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
        <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Paper Trail File Upload
          </div>
        }
        size="large"
        style={{
          width: "60%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
        >
        <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
        </Card>
        </div>
        );
      }
      