import { NativeModules } from 'react-native';
export const {request, clearCookies}  = NativeModules.AcornModule;
export const METHOD = {
  GET: 0,
  POST: 1,
  PUT: 2,
  DELETE: 3,
  HEAD: 4,
  OPTIONS: 5,
  TRACE: 6,
  PATCH: 7
}
