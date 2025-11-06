import ReusableChart from '@/components/chart'
import { Icon } from '@iconify/react'
import './index.scss'

interface IProps {
  data: any
  title: string
  icon: string
}

const ChartCard = ({ data, title, icon }: IProps) => {
  const labels = data?.map((item: any) => item.name)
  const cData = data?.map((item: any) => item.count)
  const backgroundColor = data?.map((item: any) => item.color)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '',
        data: cData,
        backgroundColor: backgroundColor
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      labels: {
        usePointStyle: false
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const index = context.dataIndex
            const label = context.label || ''
            const value = context.parsed

            const icon = data?.[index]?.icon || ''

            return `${icon} ${label}: ${value}`
          }
        }
      },
      title: {
        display: false,
        text: ''
      }
    }
  }

  return (
    <div className='common_card_main_div chart-card mb-4 p-0 gap-0'>
      <div className='card-header p-3'>
        <Icon icon={icon} width='20' height='20' />
        <span>{title}</span>
      </div>
      <div className='p-3'>
        <ReusableChart type='doughnut' data={chartData} options={chartOptions} height={250} />
      </div>
    </div>
  )
}

export default ChartCard
