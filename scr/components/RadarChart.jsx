import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

export default function RadarChartComponent({ data }) {
  if (!data) return null;
  const chartData = Object.keys(data).map(key => ({ dimension: key, score: data[key] }));
  return (
    <RadarChart outerRadius={90} width={500} height={300} data={chartData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="dimension" />
      <PolarRadiusAxis angle={30} domain={[0, 5]} />
      <Radar name="得分" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
    </RadarChart>
  );
}
