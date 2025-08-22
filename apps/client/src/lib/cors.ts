// lib/cors.ts
import { NextResponse } from 'next/server'

export function withCors(
  handler: (request: Request) => Promise<NextResponse>,
  allowedOrigins: string[] = ['https://onetime.sendexa.co']
) {
  return async (request: Request) => {
    const origin = request.headers.get('origin')
    const response = await handler(request)
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    return response
  }
}