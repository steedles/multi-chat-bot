import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Multi Chat Bot")
    .setDescription("The Multi Chat Bot API description")
    .setVersion("1.0")
    .addTag("multi-chat")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT, "0.0.0.0", () =>
    console.log(`Listening on port: ${process.env.PORT}`)
  );
}

bootstrap();
