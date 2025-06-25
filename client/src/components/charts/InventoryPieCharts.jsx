import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#ff6b6b', '#4caf50'];

const InventoryPieChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const total = data.length;
  const belowMin = data.filter((item) => item.quantity < item.min_required).length;

  const chartData = [
    { name: 'מתחת למינימום', value: belowMin },
    { name: 'בתקינות', value: total - belowMin },
  ];

  return (
    <div style={{ maxWidth: 400 }}>
      <h4>התפלגות חוסרים במלאי</h4>
      <PieChart width={400} height={250}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${name} - ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default InventoryPieChart;
