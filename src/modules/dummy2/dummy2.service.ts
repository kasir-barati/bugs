import { Injectable, OnModuleInit } from "@nestjs/common";
import { DummyService } from "../dummy";

@Injectable()
export class Dummy2Service implements OnModuleInit {
  constructor(private readonly dummyService: DummyService) {}

  onModuleInit() {
    console.log("Dummy2Service initialized " + this.dummyService.tempMethod());
  }
}
