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

const OpenOrderChart = ({ orders }) => {
  if (!orders || !orders.length) return null;

  // עוגה 1 - הזמנות שהתקבלו אך לא שולמו
  const receivedOrders = orders.filter((order) => order.is_received);
  const partiallyPaid = receivedOrders.filter((o) => o.amount_paid > 0 && !o.is_paid);
  const pieData1 = [
    { name: 'הזמנות ששולמו חלקית', value: partiallyPaid.length },
    { name: 'הזמנות שהתקבלו וטרם שולמו', value: receivedOrders.length - partiallyPaid.length },
  ];

  // עוגה 2 - הזמנות שלא התקבלו
  const notReceived = orders.filter((order) => order.is_received === 0 && order.is_paid === 0);
  const pieData2 = [
    { name: 'טרם התקבלו', value: notReceived.length },
    { name: 'שאר ההזמנות הפתוחות', value: orders.length - notReceived.length },
  ];

  // ✅ עוגה 3 - מתוך כל ההזמנות שלא שולמו, כמה לא התקבלו
  const unpaidOrders = orders.filter((order) => order.is_paid === 0 || order.amount_paid < order.price);
  const unpaidAndNotReceived = unpaidOrders.filter((order) => order.is_received === 0);
  const unpaidAndReceived = unpaidOrders.length - unpaidAndNotReceived.length;

  const pieData3 = [
    { name: 'הזמנות שטרם התקבלו', value: unpaidAndNotReceived.length },
    { name: 'התקבלו אך לא שולמו', value: unpaidAndReceived },
  ];

  return (
    <div className="charts-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '80px', justifyContent: 'center', marginBottom: '40px' }}>
  

      {/* עוגה 2 */}
      <div>
        <h3>הזמנות שלא התקבלו מתוך כלל ההזמנות</h3>
        <ResponsiveContainer width={500} height={300}>
          <PieChart>
            <Pie
              data={pieData2}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderCustomizedLabel}
            >
              {pieData2.map((entry, index) => (
                <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ עוגה 3 */}
     
    </div>
  );
};

export default OpenOrderChart;
