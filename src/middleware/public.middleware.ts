import { Middleware, Request, Response } from "@decorators/express";
import { NextFunction } from "express";

export class PublicMiddleware implements Middleware{
  public use(@Response() response, @Request() request, next: NextFunction): void {
    console.log('Aqui no public');
    next();
  }
}