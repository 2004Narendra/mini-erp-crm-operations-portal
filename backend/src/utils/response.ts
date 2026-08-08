export const successResponse = (data: unknown) => ({ success: true, data });
export const errorResponse = (message: string) => ({ success: false, message });
