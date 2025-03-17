'use client';
import React, { useState } from 'react';
import {
  List,
  ListItem,
  CardProps,
  DonutChartProps
} from '@tremor/react';
import { DonutChart as TremorDonutChart } from '@/features/charts/tremor-donut-component';


// Helper function to join class names
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Type for data item
export interface DataItem {
  name: string;
  amount: number;
  share?: string;
  color?: string;
}

// Type for category
export interface Category {
  name: string;
  data: DataItem[];
}

// Define the allowed color types for TremorDonutChart1
type TremorDonutChartColorType = 'cyan' | 'blue' | 'indigo' | 'violet' | 'fuchsia' | 'emerald' | 'amber' | 'gray' | 'pink' | 'lime';

// Helper function to ensure colors are valid for TremorDonutChart1
const validateTremorColors = (colors: string[]): TremorDonutChartColorType[] => {
  const validColors: TremorDonutChartColorType[] = [];
  const allowedColors: TremorDonutChartColorType[] = ['cyan', 'blue', 'indigo', 'violet', 'fuchsia', 'emerald', 'amber', 'gray', 'pink', 'lime'];
  
  colors.forEach(color => {
    if (allowedColors.includes(color as TremorDonutChartColorType)) {
      validColors.push(color as TremorDonutChartColorType);
    } else {
      // Default to a safe color if the provided one isn't valid
      validColors.push('blue');
    }
  });
  
  return validColors;
};

// Props for the ConfigurableDonutChart component
export interface ConfigurableDonutChartProps {
  // Title and description
  title?: string;
  description?: string;
  
  // Data categories
  categories: Category[];
  
  // Format functions
  valueFormatter?: (value: number) => string;
  shareFormatter?: (value: number) => string;
  
  // Chart options
  showTooltip?: boolean;
  colors?: string[];
  
  // Card options
  cardProps?: Omit<CardProps, 'children'>;
  
  // Additional chart options
  chartProps?: Omit<DonutChartProps, 'data' | 'category' | 'index' | 'valueFormatter' | 'showTooltip' | 'colors'>;
  
  // Custom labels
  categoryLabel?: string;
  amountLabel?: string;
}

export const DonutChart: React.FC<ConfigurableDonutChartProps> = ({
  title,
  description,
  categories,
  valueFormatter = (number) => '$' + Intl.NumberFormat('us').format(number).toString(),
  shareFormatter = (value) => `${(value * 100).toFixed(1)}%`,
  showTooltip = false,
  colors = ['cyan', 'blue', 'indigo', 'violet', 'fuchsia'],
  cardProps = {},
  chartProps = {},
  categoryLabel = 'Category',
  amountLabel = 'Amount / Share'
}) => {
  // Use state to track the active tab index
  const [activeTab, setActiveTab] = useState(0);

  // Create a mapping between colors and data items for consistent coloring
  const getItemColor = (item: DataItem, categoryIndex: number, itemIndex: number) => {
    if (item.color) return item.color;
    return `bg-${colors[itemIndex % colors.length]}-500`;
  };
  
  // Create chart colors array for the current active category
  const getChartColors = (categoryIndex: number) => {
    return categories[categoryIndex].data.map((_, index) => 
      colors[index % colors.length]
    );
  };

  // Get validated colors for TremorDonutChart1
  const getValidatedColors = (categoryIndex: number) => {
    return validateTremorColors(getChartColors(categoryIndex));
  };

  // Render only the active tab content
  const renderActiveTabContent = () => {
    const category = categories[activeTab];
    
    // Transform data for TremorDonutChart1 if needed
    const chartData = category.data.map(item => ({
      name: item.name,
      amount: item.amount,
      // Add any other properties needed
    }));
    
    return (
      <div className='flex items-center gap-4 w-full'>
        <div className='flex justify-center items-center p-4 w-full'>
          <TremorDonutChart
            className="w-[200px] h-[200px]" // w-[200px]
            data={chartData}
            category="name"
            value="amount"
            valueFormatter={valueFormatter}
            showTooltip={showTooltip}
            colors={getValidatedColors(activeTab)}
            variant="donut"
            {...chartProps}
          />
        </div>
        <div className='w-full text-sm'>
          <p className="flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content font-semibold mb-1">
            <span>{category.name}</span>
            <span>#{amountLabel}</span>
          </p>
          <List className="flex flex-col w-full">
            {category.data.map((item, itemIndex) => (
              <ListItem key={item.name} className="p-0 flex gap-8">
                <div className="flex items-center space-x-1 truncate">
                  <span
                    className={classNames(
                      getItemColor(item, activeTab, itemIndex),
                      'size-2.5 shrink-0 rounded-sm',
                    )}
                    aria-hidden={true}
                  />
                  <span className="truncate dark:text-dark-tremor-content-emphasis ">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {valueFormatter(item.amount)}
                  </span>
                  <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                    {item.share || shareFormatter(item.amount / category.data.reduce((acc, curr) => acc + curr.amount, 0))}
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-0 border-none" {...cardProps}>
      {(title || description) && (
        <div className="px-6">
          {title && (
            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content text-sm">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div>
        {/* Tab navigation */}
        <div className="px-6 pt-1">
          <div className="flex">
            {categories.map((category, index) => (
              <button
                key={category.name}
                className={`px-4 py-2 text-sm font-regular border-b-2 ${
                  activeTab === index
                    ? 'border-b-4 border-gray-500 font-medium'
                    : 'text-tremor-content dark:text-dark-tremor-content'
                }`}
                onClick={() => setActiveTab(index)}
              >
                By {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab content */}
        <div className="px-6 pb-6">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;