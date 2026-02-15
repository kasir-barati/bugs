import { Global, Module } from "@nestjs/common";
import { DummyService } from "./dummy.service.js";

@Global()
@Module({
  providers: [DummyService],
  exports: [DummyService],
})
export class DummyModule {}
