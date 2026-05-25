export function ComparisonTable() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-card text-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 font-medium text-muted-foreground">Feature</th>
            <th className="p-4 font-semibold border-l min-w-[200px]">IIT Bombay</th>
            <th className="p-4 font-semibold border-l min-w-[200px]">IIT Delhi</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="p-4 text-muted-foreground">NIRF Ranking</td>
            <td className="p-4 border-l font-medium">#3</td>
            <td className="p-4 border-l font-medium">#2</td>
          </tr>
          <tr>
            <td className="p-4 text-muted-foreground">Location</td>
            <td className="p-4 border-l">Mumbai, Maharashtra</td>
            <td className="p-4 border-l">New Delhi, Delhi</td>
          </tr>
          <tr>
            <td className="p-4 text-muted-foreground">CS Cutoff (Open)</td>
            <td className="p-4 border-l">67</td>
            <td className="p-4 border-l">118</td>
          </tr>
          <tr>
            <td className="p-4 text-muted-foreground">Campus Size</td>
            <td className="p-4 border-l">550 acres</td>
            <td className="p-4 border-l">320 acres</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
