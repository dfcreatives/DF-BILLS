import React, { useMemo } from 'react';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { IndianRupee, Users, FileText, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="stat-card">
    <div className="stat-content">
      <div>
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
      <div className={`stat-icon-bg ${color}`}>
        <Icon size={24} className="stat-icon" />
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const { invoices, clients, services } = useApp();

  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    const totalClients = clients.length;
    const totalInvoices = invoices.length;
    
    // Monthly Earnings (simplified for now, grouped by month)
    const monthlyEarnings = invoices.reduce((acc, inv) => {
        const date = new Date(inv.date);
        const month = date.toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + (Number(inv.total) || 0);
        return acc;
    }, {});
    
    const chartData = Object.keys(monthlyEarnings).map(month => ({
        name: month,
        amount: monthlyEarnings[month]
    }));

    // Services breakdown
    const serviceSales = {};
    invoices.forEach(inv => {
        inv.items.forEach(item => {
            serviceSales[item.description] = (serviceSales[item.description] || 0) + 1;
        });
    });

    const pieData = Object.keys(serviceSales).map(service => ({
        name: service,
        value: serviceSales[service]
    })).slice(0, 5); // Top 5

    return { totalRevenue, totalClients, totalInvoices, chartData, pieData };
  }, [invoices, clients, services]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <StatCard 
            title="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={IndianRupee} 
            color="bg-primary"
        />
        <StatCard 
            title="Clients" 
            value={stats.totalClients} 
            icon={Users} 
            color="bg-success"
        />
        <StatCard 
            title="Invoices" 
            value={stats.totalInvoices} 
            icon={FileText} 
            color="bg-warning"
        />
        <StatCard 
            title="Avg. Invoice" 
            value={`₹${stats.totalInvoices ? (stats.totalRevenue / stats.totalInvoices).toFixed(2) : 0}`} 
            icon={TrendingUp} 
            color="bg-info"
        />
      </div>

      <div className="charts-grid">
        <Card title="Revenue Overview" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                        itemStyle={{ color: 'var(--text-main)' }}
                    />
                    <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>

        <Card title="Top Services" className="chart-card">
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
      </div>
      
      <style jsx>{`
        .dashboard-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
        }
        .stat-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .stat-title {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-main);
        }
        .stat-icon-bg {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.1;
        }
        .stat-icon {
           opacity: 1; /* Reset opacity for icon itself if needed, but usually bg opacity affects children unless rgba */
           color: inherit;
        }
        /* Color Utilites for this page */
        .bg-primary { background-color: var(--primary); color: var(--primary); }
        .bg-success { background-color: var(--success); color: var(--success); }
        .bg-warning { background-color: var(--warning); color: var(--warning); }
        .bg-info { background-color: #06b6d4; color: #06b6d4; }

        .charts-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
        }
        @media (max-width: 1024px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
