import { Resp, serve } from "common/serve";
import constant, { ServiceType } from "constant";

export const handler = await serve("featured", async (body, req) => {
  switch (body.type) {
    case "get": {
      switch (body.entity) {
        case "group": {
          const service = constant.service.get(ServiceType.Group);
          const data = await service.getFeaturedGroups(req.client);
          return new Resp({ data });
        }
        case "event": {
          const service = constant.service.get(ServiceType.User);
          const data = await service.getProfile(req.client);
          return new Resp({ data });
        }
      }
    }
  }
});
