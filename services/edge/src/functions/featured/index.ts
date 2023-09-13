import { Resp, serve } from 'common/serve';
import constant, { ServiceType } from 'constant';

export const handler = await serve("featured", async (body, req) => {
  const service = constant.service.get(ServiceType.User);

  switch (body.type) {
    case "get": {


      const data = await service.getProfile(req.client);
      return new Resp({ data });
    }
    default:
      return new Resp({
        error: {
          message: "Invalid type",
        },
      });
  }
});
