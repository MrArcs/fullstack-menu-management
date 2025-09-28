import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Enable CORS
    const allowedOrigins =
        process.env.NODE_ENV === 'production'
            ? [
                  `https://${process.env.DOMAIN_NAME}`,
                  `https://www.${process.env.DOMAIN_NAME}`,
                  `https://api.${process.env.DOMAIN_NAME}`,
              ].filter(Boolean)
            : ['http://localhost:3000', 'http://localhost:3002']

    app.enableCors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    })

    await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
