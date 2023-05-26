import { Box, BoxProps } from '@mui/material';

export function Image(
    props: Omit<BoxProps, 'component'> & { src?: string },
) {
    return <Box component="img" {...props} />;
}
