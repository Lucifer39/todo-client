import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const VisualData = () => {
  const height = 500;
  const width = 1000;
  const [data, setData] = useState([]);
  const ref = useRef();

  useEffect(() => {
    fetch("/get/visualData")
      .then((response) => {
        if (response.status !== 200) {
        } else {
          return response.json();
        }
      })
      .then((info) => {
        setData(info);
      });
  }, []);

  useEffect(() => {
    const svg = d3.select(ref.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach((d) => {
      d.date = parseTime(d.date);
    });

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([innerHeight, 0]);

    const area = d3
      .area()
      .x((d) => xScale(d.date))
      .y0(innerHeight)
      .y1((d) => yScale(d.count));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "#FF3366")
      .attr("d", area)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`).call(yAxis);
  }, [data, height, width]);

  return (
    <div className="visual-data">
      <svg ref={ref} width={width} height={height}>
        <g />
      </svg>
    </div>
  );
};

export default VisualData;
