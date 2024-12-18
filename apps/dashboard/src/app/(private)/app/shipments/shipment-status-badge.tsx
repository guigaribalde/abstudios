import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

type BadgeVariants =
  | 'success'
  | 'error'
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | null
  | undefined;
const mapStatus: Record<string, BadgeVariants> = {
  pending: 'success',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'error',
};

const ShipmentStatusBadge = ({
  status,
}: {
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}) => {
  return (
    <Badge variant={mapStatus[status]}>
      {mapStatus[status] === 'success' ? <Check size={12} /> : <X size={12} />}
      {status}
    </Badge>
  );
};

export default ShipmentStatusBadge;
