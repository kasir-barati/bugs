import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'corsConfigs',
    (): CorsOptions => ({
        origin: function (_origin, callback) {
            // TODO: implement cors properly
            return callback(null, true);
        },
    }),
);
