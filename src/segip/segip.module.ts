import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SegipService } from './segip.service';
import { HttpModule } from "@nestjs/axios";


@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get("IOP_SEGIP_URL"),
        headers: {
          //authorization: `Bearer JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJXREdHc3VvQ1dVS1VFdDgxWFdnRk9NSnlBdzVRZDBxQyIsInVzZXIiOiJzaWVhY2FkZW1pY28iLCJleHAiOjE2MjUyMzg0MjB9.mZAIX3k76FkMxLKH8BlJ5CiGPlKEyKAFrsLTYG21Bqs`,
          authorization: `${configService.get("IOP_SEGIP_TOKEN")}`,
        },
      }),
    }),
  ],
  providers: [SegipService],
  exports: [SegipService],
})
export class SegipModule {}
