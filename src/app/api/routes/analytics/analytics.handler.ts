import { AppRouteHandler } from "../../lib/types";
import { ListRoute } from "./analytics.route";
import { getShipments } from "./analytics.repository";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const query = c.req.query();
  
  const data = await getShipments({
    fiscal_year: query.fiscal_year,
    status: query.status,
    division: query.division,
    shipment_name: query.shipment_name,
    page: Number(query.page),
    limit: Number(query.limit),
    sort_by: query.sort_by as any,
    order: query.order as "asc" | "desc",
  });

  return c.json({
    ...data,
    pagination: {
      ...data.pagination,
      total_items: data.pagination.total_items ?? 0,
    },
  });
};
