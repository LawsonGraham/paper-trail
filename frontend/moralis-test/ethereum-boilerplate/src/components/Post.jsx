
import React, { useState } from 'react';
import { Card, Avatar } from 'antd';
import { FolderViewOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Address from 'components/Address/Address';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useParams } from 'react-router-dom';

const { Meta } = Card;

function Post(args) {
  const { authenticate, isAuthenticated, Moralis } = useMoralis();
  const { id } = useParams();
  const { data, error, isLoading } = useMoralisQuery("PTObject", query =>
  query
  .equalTo("objectId", id)
  .limit(1),
  );
  var date = null
  if(isLoading) {
    date = 0
  }
  else {
    date = data[0]?.attributes?.date
  }
  function visit() {
    window.open(data[0]?.attributes?.url)
  }
  var buttons = []
  if(data[0]?.attributes?.fee == null || data[0]?.attributes?.fee == 0) {
    buttons.push(<FolderViewOutlined key="view" onClick={visit} />)
    buttons.push(<CheckCircleOutlined />)
  }
  else {
    buttons.push(<FolderViewOutlined key="view" onClick={visit} />)
    buttons.push(<DollarOutlined key="buy" onClick={payFee}/>)
  }
  
  async function payFee(){
    if(data[0]?.attributes?.fee == null || data[0]?.attributes?.fee == 0) {
      return
    }
    if(!isAuthenticated) {
      authenticate({ signingMessage: "Log in to pay." })
    }
    else {
      const options = {type: "native", amount: Moralis.Units.ETH(data[0]?.attributes?.fee), receiver: data[0]?.attributes?.author}
      let result = await Moralis.transfer(options)
    }
  }
  console.log(data[0]?.attributes, error, isLoading)
  return (
    <div>
    <Card style={{ marginTop: 16 }} key={data[0]?.attributes?.id} loading={args.loading} actions={buttons}
    title={<Address address={data[0]?.attributes?.author} copyable />}
    extra={new Date(date).toLocaleDateString("en-US")}>
    <Meta
    avatar={<Avatar src="https://ipfs.moralis.io:2053/ipfs/QmTNj36C7xSgpR5BYYzP1GSapSMVW8rj6T5VE5GjBabDsw" />}
    title={data[0]?.attributes?.title}
    description={data[0]?.attributes?.desc}
    />
    { data[0]?.attributes?.license_url == "none" ?
    <p style={{fontSize: 12}}><br/>© {new Date(date).getFullYear()}. All rights reserved.</p>:
    <p style={{fontSize: 12}}><br/>© {new Date(date).getFullYear()}. This work is licensed under a <a href={data[0]?.attributes?.license_url}>{data[0]?.attributes?.license_name}</a> license.</p>
  }
  </Card>
  <iframe src={data[0]?.attributes?.url} frameborder="0" style={{width:"100%", height:"100%"}}/>
  </div>
  );
}

export default Post;