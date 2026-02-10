import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentDistribution = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#704214', '#C5A572', '#D4C5B0', '#FFD9B3', '#FFFDF1'];

  useEffect(() => {
    fetchPaymentDistribution();
  }, []);

  const fetchPaymentDistribution = async () => {
    try {
      const response = await api.get('/orders');
      const orders = response.data.data || [];

      // Filter only paid and completed orders
      const paidCompletedOrders = orders.filter(
        order => order.status === 'completed' && order.payment_status === 'paid'
      );

      // Count payment methods
      const paymentCount = {};
      
      paidCompletedOrders.forEach(order => {
        const method = order.payment_method || 'Unknown';
        paymentCount[method] = (paymentCount[method] || 0) + 1;
      });

      // Convert to array for pie chart - exclude 'online' payment method and map gcash to Online Payment
      const chartData = Object.entries(paymentCount)
        .filter(([name]) => name.toLowerCase() !== 'online')
        .map(([name, value]) => {
          let displayName = name.charAt(0).toUpperCase() + name.slice(1);
          // Map gcash to Online Payment
          if (name.toLowerCase() === 'gcash') {
            displayName = 'Online Payment';
          }
          return { name: displayName, value };
        });

      if (chartData.length > 0) {
        setData(chartData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Failed to fetch payment distribution:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-6 border-2" style={{ 
      backgroundColor: '#FFEFD5', 
      borderColor: '#704214',
      boxShadow: '0 10px 25px rgba(112, 66, 20, 0.15)'
    }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: '#704214' }}>PAYMENT DISTRIBUTION</h2>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>Loading payment data...</p>
        </div>
      ) : data.length > 0 ? (
        <div style={{ position: 'relative', height: '250px' }}>
          <Pie
            data={{
              labels: data.map(d => d.name),
              datasets: [
                {
                  data: data.map(d => d.value),
                  backgroundColor: COLORS.slice(0, data.length),
                  borderColor: '#FFEFD5',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#704214',
                    font: { size: 12 },
                    padding: 15,
                  },
                },
                tooltip: {
                  backgroundColor: '#FFF5E6',
                  titleColor: '#704214',
                  bodyColor: '#704214',
                  borderColor: '#704214',
                  borderWidth: 2,
                  padding: 10,
                  callbacks: {
                    label: (context) => {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = ((context.parsed / total) * 100).toFixed(0);
                      return `${context.label}: ${context.parsed} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>No payment data available</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDistribution;
