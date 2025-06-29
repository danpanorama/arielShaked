import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const InventoryPieChart = ({ data, products }) => {
  if (!data || data.length === 0) return null;

  const total = products.length;
  const belowMin = data.filter(item => Number(item.quantity) < Number(item.min_required)).length;
  const inStock = total - belowMin;

  const chartData = [
    { name: 'מלאי תקין', value: inStock },
    { name: 'מלאי מתחת למינימום', value: belowMin },
  ];

  const COLORS = ['#4caf50', '#ff6b6b']; // ירוק לתקין, אדום לחוסר

  // חישוב אחוזים
  const totalItems = inStock + belowMin;
  const legendPayload = chartData.map((entry, index) => ({
    value: `${entry.name} - ${((entry.value / totalItems) * 100).toFixed(0)}%`,
    type: 'square',
    color: COLORS[index],
    id: index,
  }));

  return (
    <div style={{ maxWidth: 600, display: 'flex', alignItems: 'center', gap: '40px' }}>
      <PieChart width={300} height={250}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} פריטים`, name]} />
      </PieChart>

      {/* טקסט בצד ימין */}
      <div style={{ direction: 'rtl' }}>
        <h4 style={{ marginBottom: 10 }}>התפלגות חוסרים במלאי</h4>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '16px', color: '#000' }}>
          {legendPayload.map((item) => (
            <li key={item.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 14,
                height: 14,
                backgroundColor: item.color,
                marginLeft: 8,
              }}></div>
              {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryPieChart;
