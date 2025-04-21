import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { BehavioralMetricsData } from "@/lib/types";
import { format } from "date-fns";

interface BehavioralChartProps {
  data: BehavioralMetricsData[];
  height?: number;
}

export function BehavioralChart({ data, height = 320 }: BehavioralChartProps) {
  // Process data for visualization
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: format(new Date(item.date), "MMM dd"),
      pageViews: item.pageViews,
      addToCart: item.addToCart,
      reviewVolume: item.reviewVolume,
      averageRating: item.averageRating,
    }));
  }, [data]);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e2e8f0" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e2e8f0" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 5]}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e2e8f0" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pageViews"
              stroke="#3b82f6"
              name="Page Views"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="addToCart"
              stroke="#10b981"
              name="Add to Cart"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="reviewVolume"
              stroke="#f59e0b"
              name="Reviews"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageRating"
              stroke="#ef4444"
              name="Rating (0-5)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
