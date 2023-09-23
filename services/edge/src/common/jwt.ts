import { LRUCacheMap } from "common/utils";
import constant from "constant";
import * as jose from "jose";

export type DecodedJWT = Record<string, unknown>;

// mirrors the supabase jwt token, see https://supabase.com/docs/learn/auth-deep-dive/auth-deep-dive-jwts
export interface SupabaseJWTToken extends DecodedJWT {
  aud?: string;
  exp?: number;
  sub: string;
  email: string;
  app_metadata: Record<string, unknown>;
  user_metadata: null | Record<string, unknown>;
  role?: string;
  [key: string]: unknown;
}

/**
 * Decodes a jwt token. Generally, we expect the token has already been verified.
 *
 * @param token the jwt token to decode
 */
export function decode<T extends DecodedJWT = SupabaseJWTToken>(token: string) {
  return jose.decodeJwt(token) as T;
}

const JWT_CACHE = new LRUCacheMap<string, string>(
  constant.JWT_ENCODED_CACHE_LIMIT
);

export async function encode(
  data: DecodedJWT,
  opts?: Partial<{
    fillDetails: boolean;
    defaultAud: string;
    defaultRole: string;
  }>
) {
  const {
    fillDetails = true,
    defaultAud = constant.DEFAULT_BACKEND_AUD,
    defaultRole = constant.DEFAULT_BACKEND_ROLE,
  } = opts ?? {};

  // If the token is already cached, return it
  const cacheKey = JSON.stringify({ data, fillDetails });

  const cachedToken = JWT_CACHE.get(cacheKey);
  if (cachedToken) {
    // ensure not expired
    const decoded = await decode(cachedToken);
    if (decoded?.exp && decoded.exp > Date.now() / 1000) {
      return cachedToken;
    }
  }

  const key = constant.env.JWT_SECRET;

  if (!key) {
    throw new Error("JWT_SECRET is not set");
  }

  if (fillDetails) {
    if (!data?.role) {
      data.role = defaultRole;
    }
  }

  let jwt = new jose.SignJWT(data).setProtectedHeader({
    alg: constant.JWT_ALGORITHM,
    typ: "JWT",
  });

  if (fillDetails) {
    jwt = jwt
      .setIssuedAt()
      .setIssuer(constant.JWT_ISSUER)
      .setExpirationTime(constant.JWT_EXPIRES_IN);

    if (!data?.aud) {
      jwt = jwt.setAudience(defaultAud);
    }
  }

  const token = await jwt.sign(new TextEncoder().encode(key));

  // cache
  JWT_CACHE.set(cacheKey, token);

  return token;
}
