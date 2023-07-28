import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AdminController } from "./controllers/adminController";
import SimulatorController from "./controllers/providers/simulatorController";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AdminController, SimulatorController],
  providers: [AppService],
})
export class AppModule {}
