// export type FragmentType<T extends Record<string, any>> = T

export class ProfileFragments {
  static profile() {
    return `
                *,
                id::text,
                media!media_id (
                    ${MediaFragments.media()}
                )
            ` as const;
  }
}

export class GroupFragments {
  static group() {
    return `
                *,
                id::text,
                members:group_members (count),
                media!media_id (
                    ${MediaFragments.media()}
                )
            ` as const;
  }
}

export class MediaFragments {
  static media() {
    return `
                id::text,
                type,
                thumbnail_url,
                url
            ` as const;
  }
}
