import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { lookupNumber } from './number'
import { lookupString, lookupArrayOfString } from './string'

type HttpError = {
  statusCode: number
  message: string[]
}

export type RequestError = {
  code: string
  httpError: O.Option<HttpError>
}

const tryMakeHttpError: (v: unknown) => O.Option<HttpError> =
  (v) => pipe(
    O.fromNullable(v),
    O.chain(obj => pipe(
      lookupNumber('statusCode')(obj),
      O.chain(statusCode => O.some({
        statusCode: statusCode,
        message: pipe(
          lookupArrayOfString('message')(obj),
          O.alt(() => pipe(lookupString('message')(obj), O.chain(message => O.some([message])))),
          O.getOrElse(() => [] as string[]),
        ),
      }))
    ))
  )

export const tryMakeRequestError: (v: unknown) => O.Option<RequestError> =
  (v) => pipe(
    O.fromNullable(v),
    O.chain(obj => pipe(
      lookupString('code')(obj),
      O.chain(code => O.some({
        code: code,
        httpError: tryMakeHttpError((obj as any).response?.data),
      }))
    )),
  )

export function errorMessages(error: RequestError): string[] {
  switch (error.code) {
    case 'ERR_NETWORK':
      return ['Failed to connect to server. Please check your network connection or try again leter.']

    case 'ERR_BAD_REQUEST':
      if (O.isSome(error.httpError)) {
        return error.httpError.value.message
      }

    default:
      return ['Unknown error occurred. Please contact to admin for assistance.']
  }
}
