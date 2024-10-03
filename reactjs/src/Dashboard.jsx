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

    const [pieceData, setPieceData] = useState([]);
    useEffect(() => {
        getRbyppiece();
    }, []);
    const getRbyppiece = () => {
        axiosClient
            .get("/retoursbypiece")
            .then(({ data }) => {
                console.log(data.data);
                const formattedData = data.map((item) => ({
                    name: item.piecesname, // Customize as needed
                    retours: item.total_retours,
                }));
                setPieceData(formattedData);
                //setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [issueData, setIssueData] = useState([]);

    useEffect(() => {
        getRbyissue();
    }, []);

    const getRbyissue = () => {
        axiosClient
            .get("/retoursbyissue")
            .then(({ data }) => {
                console.log(data); // Removed .data if the structure is simpler
                const formattedData = data.map((item) => ({
                    piece: item.piece_name, // Column name from your API
                    issuename: item.issue_description,
                    issuecount: item.total_issues,
                }));
                setIssueData(formattedData);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [distData, setDistData] = useState([]);

    useEffect(() => {
        getRbydist();
    }, []);

    const getRbydist = () => {
        axiosClient
            .get("/retoursbydist")
            .then(({ data }) => {
                console.log(data); // Removed .data if the structure is simpler
                const formattedData = data.map((item) => ({
                    distname: item.dist_name,
                    count: item.total_retours,
                }));
                setDistData(formattedData);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { piece, issuename, issuecount } = payload[0].payload; // Get data from the first payload
            return (
                <div className="bg-white border border-gray-300 rounded-lg p-2">
                    <p className="font-semibold">{`Piece: ${piece}`}</p>
                    <p className="text-gray-600">{`Issue: ${issuename}`}</p>
                    <p className="text-gray-600">{`Count: ${issuecount}`}</p>
                </div>
            );
        }
        return null;
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
                {/* <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        Retours by Piece
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={pieceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="retours"
                                stroke="#82ca9d"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div> */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        Retours by Piece
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={pieceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="retours" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        Pieces by Issue
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={issueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="piece" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />{" "}
                            {/* Use the custom tooltip */}
                            <Bar dataKey="issuecount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold">
                        Retours by distributeurs
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={distData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="distname" />
                            <YAxis />
                            <Tooltip />
                            {/* Use the custom tooltip */}
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
