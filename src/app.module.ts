import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AdminController } from "./controllers/adminController";
import SimulatorController from "./controllers/providers/simulatorController";
import { ConfigModule } from "@nestjs/config";
import { DiscordController } from "./controllers/providers/discordController";
import { FacebookController } from "./controllers/providers/facebookController";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AdminController, SimulatorController, DiscordController, FacebookController],
  providers: [AppService],
})
export class AppModule {}
