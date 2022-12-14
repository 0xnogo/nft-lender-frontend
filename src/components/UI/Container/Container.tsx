interface ContainerProps {
  title: string;
  children: React.ReactNode;
}
export const Container = ({title, children}: ContainerProps): JSX.Element => {
  return (<div className="flex flex-col rounded-md p-4 bg-gray-800 gap-y-4 h-96">
    <h1 className="font-bold text-lg mb-3">{title}</h1>
    {children}
  </div>)
}