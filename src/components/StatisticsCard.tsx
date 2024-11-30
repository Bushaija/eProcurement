interface StatisticsCardProps {
  icon: React.ReactNode;
  value: string;
  name: string;
  isUSD?: boolean;
}

const StatisticsCard: React.FunctionComponent<StatisticsCardProps> = ({
  icon,
  value,
  name,
  isUSD,
}) => {
  return (
    <div className="bg-white flex items-center gap-2 rounded-[10px] p-4 w-[400px] h-[100px]">
      <div>{icon}</div>
      <div>
        <p className="text-[#121417] text-2xl font-semibold">
          {isUSD && "$"}
          {value}
        </p>
        <p className="text-[#64707D] font-light">{name}</p>
      </div>
    </div>
  );
};

export default StatisticsCard;

