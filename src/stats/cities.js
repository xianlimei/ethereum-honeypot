/* @flow */

import { firestore } from 'firebase-admin';

import { errorLogger } from '../utils/errorLogger';

import { DOCUMENTS, UNDEFINED } from './defaults';

const { GeoPoint } = firestore;

/**
 * Track the number of times a unique contry has made a request to the honeypot
 * It makes use of the `statsGenerator()` helper method.
 *
 * @method citiesStats
 *
 * @param {string} city The city name to track the stats of
 */
export const citiesStats = (
  city: string,
  geoLocation: Object = new GeoPoint(
    parseFloat('0.0'),
    parseFloat('0.0'),
  ),
): Object => {
  if (!city || typeof city !== 'string') {
    /*
     * @TODO Move message string to `messages.json`
     */
    errorLogger(
      "Stats city name not available, we're counting it",
      city || UNDEFINED,
    );
  }
  return {
    documentId: DOCUMENTS.CITIES,
    propName: city,
    additionalData: { geoLocation },
  };
};

export default citiesStats;
