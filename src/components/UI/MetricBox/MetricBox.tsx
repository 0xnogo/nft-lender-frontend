interface MetricBoxProps {
  title: string;
  text: string;
  icon: React.ReactNode;
}


export const MetricBox = ({title, text, icon}: MetricBoxProps): JSX.Element => {
  return (<div className='flex flex-row justify-center items-center rounded-md px-4 bg-gray-800 gap-x-4'>
  <div>{icon}</div>
  <div className='flex flex-col justify-between'>
    <h2 className="text-sm">{title}</h2>
    <p className='font-bold text-lg'>{text}</p>
  </div>
</div>)
}