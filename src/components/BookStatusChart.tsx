import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Card } from "./Card";

interface Props {
  available: number;
  checkedOut: number;
  overdue: number;
}

export const BookStatusChart = ({ available, checkedOut, overdue }: Props) => {
  const data = [
    { name: "Available", value: available },
    { name: "Checked Out", value: checkedOut },
    { name: "Overdue", value: overdue },
  ];

  const COLORS = ["#22c55e", "#fbbf24", "#ef4444"];

  return (
    <Card className="p-6 min-w-[250px]">
      <h2 className="text-lg font-semibold">Book Status Overview</h2>
      <p className="text-sm text-gray-500 mb-4">Current inventory status</p>

      <div className="h-[330px] flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={90}
              outerRadius={140}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Legend
              verticalAlign="bottom"
              iconType="square"
              formatter={(value) => (
                <span className="text-sm text-gray-700 ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
