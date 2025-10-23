
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import kpiData from '../data/kpiData.json';
import './SolarEnergy.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0'];

const SolarEnergy = () => {
  const [inputData] = useState({
    Actual_Energy_MWh: 5000, Installed_Capacity_MW: 100, Days: 30, Expected_Output_MWh: 6000, AC_Output_MWh: 4800,
    DC_Input_MWh: 5000, Connected_Time_h: 700, Total_Time_h: 720, Unplanned_Downtime_h: 10, Aux_Power_MWh: 50,
    Gross_Generation_MWh: 5050, Actual_Energy_kWh: 5000000, DC_Capacity_kWp: 120000, Clean_Output: 100, Soiled_Output: 97,
    Actual_PR: 0.8, PR_at_STC: 0.82, Operating_Time_h: 5000, Failures_Count: 2, Total_Repair_Time_h: 10, Repairs_Count: 2,
    PM_Completed: 95, PM_Planned: 100, Correct_Predictions: 7, Total_Failures: 10, OM_Cost: 100000, Capex_Amort: 50000,
    Revenue_Total: 200000, Energy_Sold_kWh: 4900000, EBITDA: 150000, Cash_Flow_Operations: 120000, Debt_Service: 100000,
    Total_Investment: 1000000, Annual_Cash_Inflow: 200000, DIO: 30, DRO: 45, DPO: 60, Energy_Supplied_MWh: 4900,
    Energy_Sent_to_Grid_MWh: 5000, Energy_Billed_MWh: 4800, Revenue_Collected: 190000, Revenue_Billed: 200000,
    Accurate_Reads: 980, Total_Reads: 1000, Average_Load_MW: 60, Peak_Load_MW: 100, Total_Customer_Interruption_Min: 10000,
    Customers_Served: 1000, Total_Interruptions: 50, Lost_Customers: 10, Total_Customers: 1000, Complaints: 20,
    Energy_Billed_kWh: 4800000, Solar_Energy_MWh: 5000, Grid_Emission_Factor_tCO2_per_MWh: 0.8, Water_Used_kL: 100,
    Solar_Supplied_MWh: 5000, Total_Supplied_MWh: 10000, Land_Area_ha: 200, Recycled_Waste_kg: 800, Total_Waste_kg: 1000,
    Suppliers_Compliant: 90, Total_Suppliers: 100, SCADA_Online_h: 710, Forecast_MWh: 4900, Available_Energy_MWh: 5100,
    Curtailed_Energy_MWh: 100, Nuisance_Alarms: 50, Total_Alarms: 1000, Recordable_Incidents: 1, Work_Hours: 100000,
    Near_Misses: 5, Compliant_Checks: 95, Total_Checks: 100, Milestones_Completed: 9, Milestones_Planned: 10,
    Capex_Actual: 1100000, Capex_Budget: 1000000, Punchlist_Closed: 95, Punchlist_Total: 100,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = useMemo(() => [...new Set(kpiData.map(item => item.category))], []);

  const evaluateFormula = (formula) => {
    try {
      const keys = Object.keys(inputData);
      const values = Object.values(inputData);
      const func = new Function(...keys, `return ${formula}`);
      const result = func(...values);
      if (isNaN(result) || !isFinite(result)) return "N/A";
      return parseFloat(result.toFixed(2));
    } catch (error) {
      return "N/A";
    }
  };

  const calculatedKpis = useMemo(() => kpiData.map(kpi => ({ ...kpi, value: evaluateFormula(kpi.formula) })), [inputData]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const renderChartForCategory = (category, data) => {
    const chartColor = COLORS[categories.indexOf(category) % COLORS.length];

    switch (category) {
        case 'Financial':
          return(
            <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={chartColor} fill={chartColor} />
          </AreaChart>
          )
        case 'Customer':
            return (
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            );
        case 'Asset Health':
        case 'HSE':
            return (
                <div className="progress-bar-grid">
                    {data.map((kpi, index) => (
                        <div className="progress-bar-item-new" key={index}>
                            <CircularProgressbar value={kpi.value} text={`${kpi.value}%`} styles={buildStyles({ pathColor: COLORS[index % COLORS.length], textColor: '#fff', trailColor: '#333'})} />
                            <p>{kpi.name}</p>
                        </div>
                    ))}
                </div>
            );
        case 'Environmental':
             return (
                <RadarChart cx="50%" cy="50%" outerRadius={50} data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar name="Value" dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.6} />
                    <Tooltip />
                </RadarChart>
            );
        case 'Sustainability/ESG':
            return (
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} />
                </LineChart>
            );
            case 'Projects':
            return (
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} />
                </LineChart>
            );
        case 'Safety & Compliance':
            return (
                <RadarChart cx="50%" cy="50%" outerRadius={50} data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar name="Value" dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.6} />
                    <Tooltip />
                </RadarChart>
            );
        case 'Digital & Analytics':
            return (
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            );
        default:
            return (
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={chartColor} />
                </BarChart>
            );
    }
  }

  const renderKpiCards = (category) => {
    const categoryKpis = calculatedKpis.filter(kpi => kpi.category === category);
    return (
      <div className="kpi-cards-view">
        <button onClick={handleBackClick} className="back-button">Back to Overview</button>
        <h2>{category} KPIs</h2>
        <div className="kpi-cards-grid">
          {categoryKpis.map((kpi, index) => (
            <div className="kpi-card" key={index}>
              <h4>{kpi.kpi}</h4>
              <p className="kpi-value">{kpi.value}</p>
              <p className="kpi-description">{kpi.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedCategory ? (
        renderKpiCards(selectedCategory)
      ) : (
        <div className="dashboard-grid-new">
          {categories.map(category => {
            const categoryKpis = calculatedKpis.filter(kpi => kpi.category === category);
            const chartData = categoryKpis.map(kpi => ({ name: kpi.kpi, value: kpi.value }));
            
            return (
              <div className="chart-card-new" key={category} onClick={() => handleCategoryClick(category)}>
                <b>{category}</b>
                <div className="chart-container-new">
                  {category === 'Asset Health' || category === 'HSE' ? 
                    renderChartForCategory(category, chartData) : 
                    <ResponsiveContainer width="100%" height={200}>
                      {renderChartForCategory(category, chartData)}
                    </ResponsiveContainer>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolarEnergy;
