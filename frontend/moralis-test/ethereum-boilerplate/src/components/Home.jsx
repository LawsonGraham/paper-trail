import { Card, Statistic, Typography } from "antd";
import React, { useMemo } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import PTItem from "./Explore/PTItem";


const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function Home({ isServerInfo }) {
  const { user, Moralis } = useMoralis();
  const { data, error, isLoading } = useMoralisQuery("PTObject", query =>
  query,
  );
  const [results, setResults] = useState(
    <div>
    <Row gutter={16}>
    <Col>{ <PTItem loading = {true}/> }</Col>
    <Col>{ <PTItem loading = {true}/> }</Col>
    <Col>{ <PTItem loading = {true}/> }</Col>
    </Row>
    </div>);
    useEffect(() => {
      async function getData() {
        if(isLoading || data.length === 0 || error !== null) {
          return
        }
        var flip = [...data].reverse();
        var elements =
        <Row gutter={16}>
        {
          flip.slice(0,3).map((col) => (
            <Col>{ <PTItem ele={col} /> }</Col>
            ))
          }
          </Row>
          setResults(elements);
        }
        getData();
      }, [data])
      return (
        <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <Card
          style={styles.card}
          title={
            <>
            📝 <Text strong>Statistics</Text>
            </>
          }
          >
           <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Total Contributors" value={5} />
            </Col>
            <Col span={12}>
              <Statistic title="Total Uploads" value={data?.length}/>
            </Col>
          </Row>
          </Card>
          <Card
          style={{ marginTop: "10px", ...styles.card }} title={
            <>
            📝 <Text strong>Recent Uploads</Text>
            </>
          }
          >
            {results}
          </Card>
        </div>
      </div>
        );
      }
      