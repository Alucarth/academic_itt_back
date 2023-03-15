import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors : true});
  const logger = new Logger('Bootstrap');
   // Global Guards (see https://docs.nestjs.com/guards#global-guards)
   const reflector = app.get(Reflector);
   app.useGlobalGuards(new RolesGuard(reflector));
   
   app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,
     }),
   );
   app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema Academico ITT')
    .setDescription('API de sistema academico')
    .setVersion('1.0')
    .addTag('Academico ITT')
    .setBasePath('api')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // SwaggerModule setup (see https://docs.nestjs.com/recipes/swagger)
  SwaggerModule.setup('docs', app, document, {
    explorer: false,
    swaggerOptions:{
      filter:false,
    },
  });

 

  // app starts listening on port 3003
  await app.listen(3005);
  logger.log(`***** Servidor esta corriendo en  ${await app.getUrl()}`);
}
bootstrap();
