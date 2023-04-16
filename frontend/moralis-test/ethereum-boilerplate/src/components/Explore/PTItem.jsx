
import React, { useState } from 'react';
import { Card, Avatar } from 'antd';
import { FolderViewOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Address from 'components/Address/Address';
import { useMoralis } from 'react-moralis';
const { Meta } = Card;

function PTItem(args) {
  var date = null
  if(args.loading) {
    date = 0
  }
  else {
    date = args.ele?.attributes.date
  }
  const { authenticate, isAuthenticated, Moralis } = useMoralis();
  function visit() {
    window.open(args.ele?.attributes.url)
  }
  var buttons = []
  if(args.ele?.attributes.fee == null || args.ele?.attributes.fee == 0) {
    buttons.push(<FolderViewOutlined key="view" onClick={visit} />)
    buttons.push(<CheckCircleOutlined />)
  }
  else {
    buttons.push(<FolderViewOutlined key="view" onClick={visit} />)
    buttons.push(<DollarOutlined key="buy" onClick={payFee}/>)
  }
  
  async function payFee(){
    if(args.ele?.attributes.fee == null || args.ele?.attributes.fee == 0) {
      return
    }
    if(!isAuthenticated) {
      authenticate({ signingMessage: "Log in to pay." })
    }
    else {
      const options = {type: "native", amount: Moralis.Units.ETH(args.ele?.attributes.fee), receiver: args.ele?.attributes.author}
      let result = await Moralis.transfer(options)
    }
  }
  console.log(args.ele)
  return (
    <>
    <Card style={{ width: 300, marginTop: 16 }} key={args.ele?.id} loading={args.loading} actions={buttons}
    title={<Address address={args.ele?.attributes.author} size="6" copyable />}
    extra={new Date(date).toLocaleDateString("en-US")}>
    <Meta
    avatar={<Avatar src="https://ipfs.moralis.io:2053/ipfs/QmTNj36C7xSgpR5BYYzP1GSapSMVW8rj6T5VE5GjBabDsw" />}
    title={<a href={window.location.protocol + "//" + window.location.host + "/post/" + args.ele?.id}>{args.ele?.attributes.title}</a>}
    description={args.ele?.attributes.desc}
    />
    { args.ele?.attributes.license_url == "none" ?
      <p style={{fontSize: 12}}><br/>© {new Date(date).getFullYear()}. All rights reserved.</p>:
      <p style={{fontSize: 12}}><br/>© {new Date(date).getFullYear()}. This work is licensed under a <a href={args.ele?.attributes.license_url}>{args.ele?.attributes.license_name}</a> license.</p>
    }
    </Card>
    </>
    );
  }
  
  export default PTItem;