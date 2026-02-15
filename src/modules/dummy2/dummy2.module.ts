import { Module } from "@nestjs/common";
import { Dummy2Service } from "./dummy2.service.js";

@Module({
  providers: [Dummy2Service],
  exports: [Dummy2Service],
})
export class Dummy2Module {}
