import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Dummy2Module, DummyModule, MessagingModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule,
    DummyModule,
    Dummy2Module,
  ],
})
export class AppModule {}
