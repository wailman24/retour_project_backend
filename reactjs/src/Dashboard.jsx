import axiosClient from "./axios-client";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Sample data for charts
const data = [
    { name: "Jan", sales: 4000, users: 2400 },
    { name: "Feb", sales: 3000, users: 1398 },
    { name: "Mar", sales: 2000, users: 9800 },
    { name: "Apr", sales: 2780, users: 3908 },
    { name: "May", sales: 1890, users: 4800 },
    { name: "Jun", sales: 2390, users: 3800 },
    { name: "jul", sales: 4000, users: 2400 },
    { name: "aut", sales: 3000, users: 1398 },
    { name: "sep", sales: 2000, users: 9800 },
    { name: "oct", sales: 2780, users: 3908 },
    { name: "nov", sales: 1890, users: 4800 },
    { name: "dec", sales: 2390, users: 3800 },
];

const pieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
};
// Tooltip content for the chart
const ChartTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border p-2 rounded shadow">
                <p>{`${label} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

function Dashboard() {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        getRbyproduct();
    }, []);
    const getRbyproduct = () => {
        axiosClient
            .get("/retoursbyproduct")
            .then(({ data }) => {
                console.log(data.data);
                const formattedData = data.map((item) => ({
                    name: `Product ${item.prodname}`, // Customize as needed
                    retours: item.total_retours,
                }));
                setChartData(formattedData);
                //setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [cretours, setCretours] = useState("");
    useEffect(() => {
        getCRetours();
    }, []);
    const getCRetours = () => {
        axiosClient
            .get("/completedretours")
            .then(({ data }) => {
                console.log(data.data);
                setCretours(data);
                //setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [iretours, setIretours] = useState("");
    useEffect(() => {
        getIRetours();
    }, []);
    const getIRetours = () => {
        axiosClient
            .get("/initialretours")
            .then(({ data }) => {
                console.log(data.data);
                setIretours(data);
                //setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [progretours, setProgretours] = useState("");
    useEffect(() => {
        getProgRetours();
    }, []);
    const getProgRetours = () => {
        axiosClient
            .get("/inprogresretours")
            .then(({ data }) => {
                console.log(data.data);
                setProgretours(data);
                //setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    return (
        <div className="sm:ml-120">
            <div className="p-4 border-gray-200 dark:border-gray-700 mt-14">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-2 text-lg font-semibold">
                            initiated Retours
                        </h2>
                        <p className="text-2xl font-bold">{iretours}</p>
                        {/* <p className="text-sm text-gray-500">
                            Compared to last month
                        </p> */}
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-2 text-lg font-semibold">
                            retours in progress
                        </h2>
                        <p className="text-2xl font-bold">{progretours}</p>
                        {/* <p className="text-sm text-gray-500">
                            Compared to last month
                        </p> */}
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-2 text-lg font-semibold">
                            Retours completed
                        </h2>
                        <p className="text-2xl font-bold">{cretours}</p>
                        {/* <p className="text-sm text-gray-500">
                            Compared to last month
                        </p> */}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                {/* Bar Chart */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        Retours by Product
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="retours" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Line Chart */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        Users by Month
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#82ca9d"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                {/* Pie Chart */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        User Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Area Chart */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">Sales Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#8884d8"
                                fill="#8884d8"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
