import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { FiPieChart, FiBarChart2 } from "react-icons/fi";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {payload[0].value} <span className="text-xs font-medium text-slate-500">applications</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts({ data, role }) {

  // ─── Employer: Bar Chart ─────────────────────────────────────────────────
  if (role === "employer") {
    const chartData = [
      { name: "Live Postings", value: data.jobs?.length || 0 },
      { name: "Total Applicants", value: data.totalApplicants || 0 },
    ];

    const hasData = chartData.some(d => d.value > 0);

    return (
      <div className="mt-4">
        {!hasData ? (
          <EmptyState message="Post a job to start seeing analytics here." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // ─── Jobseeker: Pie Chart ─────────────────────────────────────────────────
  const statusData = [
    { name: "Pending",  value: data.applications?.filter(a => a.status === "pending").length  || 0 },
    { name: "Accepted", value: data.applications?.filter(a => a.status === "accepted").length || 0 },
    { name: "Rejected", value: data.applications?.filter(a => a.status === "rejected").length || 0 },
  ];

  const COLORS = ["#fbbf24", "#10b981", "#f43f5e"];
  const hasData = statusData.some(s => s.value > 0);

  return (
    <div className="mt-4">
      {!hasData ? (
        <EmptyState message="Apply for jobs to see your application stats here." />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={8}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "11px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {s.name} ({s.value})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[260px] text-center">
      <FiPieChart className="w-10 h-10 text-slate-200 dark:text-slate-700 mb-3" />
      <p className="text-slate-400 font-semibold text-sm">No data yet</p>
      <p className="text-slate-400 text-xs mt-1 max-w-[220px]">{message}</p>
    </div>
  );
}