export type ResponseData<T> = {
    data: T;
};
export type DataPostType = "get" | "update";
export type PostType = DataPostType;
export interface Post {
    type: PostType;
}
export interface DataPost {
    type: DataPostType;
}
//# sourceMappingURL=index.d.ts.map