/**
 * Module  - Admin Survey Module
 * Date -  13/12/2022
 */

import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../../core/middify";
import formatJSONResponse from "../../core/formatJsonResponse";
import SurveyService from "../../service/Survey";
import ICreateSurvey from "src/dtos/getMpDto";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { SurevyLimitValidator } from "src/helpers/validators/schema/SurevyLimitValidator";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & ICreateSurvey,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    const { body } = event;
    try {
      const surveys = await SurveyService.getMpSurvey({
        userId: authorizer?.claims?.email,
        limit: body?.limit,
      });
      return formatJSONResponse(StatusCodes.OK, surveys);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: SurevyLimitValidator }));
