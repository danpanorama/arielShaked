import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B388EB', '#FFA69E'];

function RemovalPieChart({ data }) {
  if (!data || data.length === 0) return null;

  // סכימת כמויות לפי סיבה
  const summary = data.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + Number(item.quantity);
    return acc;
  }, {});

  // יצירת מערך שמתאים לגרף
  const chartData = Object.entries(summary).map(([reason, totalQuantity]) => ({
    name: reason,
    value: totalQuantity,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', direction: 'rtl' }}>
      <PieChart width={320} height={320}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={110}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} פריטים`, name]} />
      </PieChart>

      <div style={{ textAlign: 'right' }}>
        <h3>התפלגות סיבות להוצאה מהמלאי</h3>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '16px', color: '#000' }}>
          {chartData.map((item, index) => (
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
}

export default RemovalPieChart;
