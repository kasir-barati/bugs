import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export interface ErrorResponse {
    statusCode: number;
    message: string[] | string;
    error: 'Bad Request';
}

export const transformErrorResponse = (
    response: FetchBaseQueryError,
): string[] => {
    const error = response.data as ErrorResponse;

    if (!error && response.status === 'FETCH_ERROR') {
        return [
            'There is an problem on our server, please try again later!',
        ];
    }
    if (!error || !error.message) {
        return ['Something went wrong, Please try again later!'];
    }

    return typeof error.message === 'string'
        ? [error.message]
        : error.message;
};
