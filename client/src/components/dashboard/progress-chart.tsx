import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Button } from '@/components/ui/button';

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

type ChartPeriod = 'week' | 'month' | 'year';

export function ProgressChart() {
  const [period, setPeriod] = useState<ChartPeriod>('week');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Fetch chart data
  const { data = { labels: [], datasets: [] }, isLoading } = useQuery<{
    labels: string[];
    datasets: any[];
  }>({
    queryKey: ['/api/analytics/weekly'],
  });

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const unit = (context.dataset as any).unit || '';
              return `${label}: ${context.parsed.y} ${unit}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Progress'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any) => ({
          ...dataset,
          tension: 0.4,
          fill: true
        }))
      },
      options
    });

    return () => {
      // Clean up chart on unmount
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  const handlePeriodChange = (newPeriod: ChartPeriod) => {
    setPeriod(newPeriod);
    // In a real implementation, we would fetch data for the new period
    // and update the chart
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Weekly Progress</h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={period === 'week' ? 'secondary' : 'ghost'}
            onClick={() => handlePeriodChange('week')}
            className={period === 'week' ? 'bg-indigo-50 text-primary hover:bg-indigo-100' : ''}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={period === 'month' ? 'secondary' : 'ghost'}
            onClick={() => handlePeriodChange('month')}
            className={period === 'month' ? 'bg-indigo-50 text-primary hover:bg-indigo-100' : ''}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={period === 'year' ? 'secondary' : 'ghost'}
            onClick={() => handlePeriodChange('year')}
            className={period === 'year' ? 'bg-indigo-50 text-primary hover:bg-indigo-100' : ''}
          >
            Year
          </Button>
        </div>
      </div>
      <div className="w-full h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
