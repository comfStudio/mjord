import { Resp, serve } from "common/serve";
import constant, { ServiceType } from "constant";

export const handler = await serve("group", async (body, req) => {
  const service = constant.service.get(ServiceType.Group);

  switch (body.type) {
    case "get": {
      const data = await service.getGroup(req.client, body.id);
      return new Resp({ data });
    }
  }
});
