export type ApiResponse<TData> = {
    data: TData;
};
export type HelloResponse = ApiResponse<{
    message: string;
}>;
