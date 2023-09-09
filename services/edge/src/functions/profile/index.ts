import { Resp, serve } from "common/serve";
import constant, { ServiceType } from "constant";

await serve("profile", async (req) => {
  const service = constant.service.get(ServiceType.User);

  const data = await service.getProfile(req.client);

  return new Resp(data);
});
