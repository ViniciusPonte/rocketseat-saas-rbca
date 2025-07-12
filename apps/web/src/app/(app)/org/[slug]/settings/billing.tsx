import { getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getBilling } from '@/http/billing/get-billing'
import { price } from '@/utils/price'

export async function Billing() {
  const currentOrg = await getCurrentOrg()
  const { billing } = await getBilling(currentOrg!)

  return (
    <>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Information about your organization costs
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost type</TableHead>
                <TableHead className="text-right" style={{ width: 240 }}>
                  Quantity
                </TableHead>
                <TableHead className="text-right" style={{ width: 240 }}>
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Amount of projects</TableCell>
                <TableCell className="text-right">
                  {billing.projects.amount}
                </TableCell>
                <TableCell className="text-right">
                  {price(billing.projects.price)} (
                  {price(billing.projects.unit)} each)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount of seats</TableCell>
                <TableCell className="text-right">
                  {billing.seats.amount}
                </TableCell>
                <TableCell className="text-right">
                  {price(billing.seats.price)} ({price(billing.seats.unit)}{' '}
                  each)
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="text-right">Total</TableCell>
                <TableCell className="text-right">
                  {price(billing.total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
