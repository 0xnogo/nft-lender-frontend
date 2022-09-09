interface ContainerProps {
  title: string;
  children: React.ReactNode;
}
export const Container = ({title, children}: ContainerProps): JSX.Element => {
  return (<div className="rounded-md p-4 bg-gray-800 flex flex-col gap-y-2">
    <h1>{title}</h1>
    {children}
  </div>)
}