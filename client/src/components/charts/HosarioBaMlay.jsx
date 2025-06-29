import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const HosarioBaMlay = ({ data }) => {
  // data זה מערך הזמנות עם שדות id ו-preparation_time_in_seconds לדוגמה


  // ממירים את הזמן לשניות או דקות להצגה נוחה

  console.log(data)
  const formattedData = data.map((order, i) => ({
  
    name: `מוצר  ${order.name}`,
    limit: order.total_orders || 0,
  }));

  return (
    <div style={{ width: '100%', height: 400, marginTop: '50px' }}>
      <ResponsiveContainer>
        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: '  כמות הזמנות', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `${value} כמות הזמנות`} />
          <Bar dataKey="orders" fill="#0000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HosarioBaMlay;
