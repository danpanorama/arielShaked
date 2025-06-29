import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const translateHeader = (key) => {
  const map = {
    total_open_orders: 'סך ההזמנות הפתוחות',
    total_order_value: 'סך הערך הכולל',
    total_paid: 'סך ששולם',
    total_remaining_to_pay: 'סכום שנותר לתשלום',
    unpaid_received_orders: 'הזמנות שהתקבלו ולא שולם',
    unpaid_received_total: 'סכום שלא שולם בהזמנות שהתקבלו',
  };
  return map[key] || key;
};

const COLORS = ['#4B9CD3', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#FFCA28'];

const SummaryPieChart = ({ summary }) => {
  if (!summary) return null;

  const data = Object.entries(summary).map(([key, value]) => ({
    name: translateHeader(key),
    value: Number(value),
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ display: 'flex',  alignItems: 'center', gap: '40px', direction: 'rtl' }}>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value.toLocaleString()} פריטים`, name]}
        />
      </PieChart>

      <div>
        <h3 style={{ textAlign: 'right' }}>תרשים סיכום</h3>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '16px', color: '#000' }}>
          {data.map((item, index) => (
            <li key={index} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 14,
                height: 14,
                backgroundColor: COLORS[index % COLORS.length],
                marginLeft: 8,
              }}></div>
              {item.name} - {(item.value / total * 100).toFixed(1)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryPieChart;
