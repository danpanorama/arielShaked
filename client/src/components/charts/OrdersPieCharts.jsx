import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const renderCustomizedLabel = ({ percent, name, cx, cy, midAngle, outerRadius }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN); 
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#000" textAnchor="middle" dominantBaseline="central" fontSize={16}>
      {`${name} - ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const OrdersPieCharts = ({ orders }) => {
  if (!orders || !orders.length) return null;

  const receivedOrders = orders.filter((order) => order.is_received);
  const partiallyPaid = receivedOrders.filter((o) => o.amount_paid > 0 && !o.is_paid);
  const notReceived = orders.filter((order) => order.is_received == 0 && order.is_paid == 0);

  const pieData1 = [
    { name: 'הזמנות ששולמו חלקית', value: partiallyPaid.length },
    { name: ' הזמנות שהתקבלו וטרם שולמו', value: receivedOrders.length - partiallyPaid.length },
  ];

  const pieData2 = [
    { name: 'לא התקבלו', value: notReceived.length },
    { name: 'שאר ההזמנות הפתוחות', value: orders.length - notReceived.length },
  ];

  return (
    <div className="charts-container" style={{ display: 'flex', gap: '80px', justifyContent: 'center', marginBottom: '40px' }}>
      <div>
        <h3>      הזמנות ששולמו חלקית מתוך ההזמנות שהתקבלו למלאי וטרם נסגרו</h3>
        <ResponsiveContainer width={500} height={300}>
          <PieChart>
            <Pie
              data={pieData1}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderCustomizedLabel}
            >
              {pieData1.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersPieCharts;
