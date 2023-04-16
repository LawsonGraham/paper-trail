import PTItem from "./PTItem";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useState, useEffect } from 'react';
import { Col, Row } from 'antd';

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    width: "450px",
    fontSize: "16px",
    fontWeight: "500",
  },
};

function Explore() {
  const { user, Moralis } = useMoralis();
  const { data, error, isLoading } = useMoralisQuery("PTObject");
  
  const [results, setResults] = useState(
    <div>
      <Row gutter={16}>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
      </Row>
      <Row gutter={16}>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
      </Row>
      <Row gutter={16}>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
        <Col>{ <PTItem loading = {true}/> }</Col>
      </Row>
    </div>);
  
  function array_chunks(arr, size) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Input should be Array');
    }
    
    if (typeof size !== 'number') {
      throw new TypeError('Size should be a Number');
    }
    
    var result = [];
    for (var i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, size + i));
    }
    
    return result;
  };
  useEffect(() => {
    async function getData() {
      if(isLoading || data.length === 0 || error !== null) {
        return
      }
      console.log(data)
      var rows = array_chunks(data, 4)
      var elements = rows.map((row) => (
         <Row gutter={16} justify="space-around" align="middle">
         {
           row.map((col) => (
            <Col>{ <PTItem ele={col} /> }</Col>
           ))
         }
         </Row>
       ))
      setResults(elements);
    }
    getData();
  }, [data])
  return (
    <div>
    {results}
    </div>
    );
  }
  
  export default Explore;