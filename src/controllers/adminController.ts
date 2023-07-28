import { Controller, Get } from "@nestjs/common";

@Controller("admin")
export class AdminController {
  @Get("health")
  healthCheck(): string {
    return "Healthy as an ox";
  }
}
