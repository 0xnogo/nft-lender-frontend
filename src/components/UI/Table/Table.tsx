import {Table as TableFlowBite} from "flowbite-react"
interface TableProps {
  title?: string;
  headCells: string[];
  bodyCells: string[][];
}

export const Table = ({title, headCells, bodyCells}: TableProps): JSX.Element => {
  const createTableContent = (): any[] => {
    let indents = [];
    for (let i = 0; i < bodyCells.length; i++) {
      let rows = bodyCells[i];
      let rowsResult = []
      for (let j = 0; j < rows.length; j++) {
        rowsResult.push(<TableFlowBite.Cell key={j} className="whitespace-nowrap font-medium text-white">{rows[j]}</TableFlowBite.Cell>)
      }
      indents.push(
        <TableFlowBite.Row key={i} className='border-gray-700 bg-gray-800'>
          {rowsResult}
        </TableFlowBite.Row>);
    }
    return indents;
  }

  return (
    <div>
      {title && <h2 className="mb-2 font-semibold text-lg">{title}</h2>}
      {bodyCells.length > 0 && <TableFlowBite>
        <TableFlowBite.Head>
          {headCells.map((cell, i) => {
            return (
              <TableFlowBite.HeadCell key={i}>
                {cell}
              </TableFlowBite.HeadCell>
            )
          })}
        </TableFlowBite.Head>
        <TableFlowBite.Body className="divide-y">
          {createTableContent()}
        </TableFlowBite.Body>
      </TableFlowBite>}
      {bodyCells.length === 0 && <p className="italic">No item to display</p>}
    </div>
  )
}