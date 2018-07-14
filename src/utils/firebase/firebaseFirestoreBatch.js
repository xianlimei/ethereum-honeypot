/* @flow */

import { errorLogger } from '../errorLogger';

import firestoreDatabase from './firebaseFirestoreConnector';

import { STATS_COLLECTION, UNDEFINED } from './defaults';

/**
 * Helper to write batch documents to a Firestore collection
 *
 * The method takes in an Array of Objects containing batch write instructions and data.
 * The object needs to have the following structure:
 * {
 *   collection -- name of the collection to select
 *   documentId -- the id of the document to select
 *   batchMethod -- the batch write method name as a string. Possible: `set`, `update`, `delete`
 *   dataObject -- the object to update/write to the document id
 * }
 *
 * Usage example:
 *
 * await firebaseFirestoreBatch([
 *   {
 *     documentId: 'countries',
 *     batchMethod: 'set',
 *     dataObject: { Netherlands: 1 },
 *   },
 *   {
 *     documentId: 'cities',
 *     batchMethod: 'set',
 *     dataObject: { Rotterdam: 1 },
 *   },
 * ]);
 *
 * @method firebaseFirestoreBatch
 *
 * @param {Array} batchArray Array containing objects that contain the batch instructions and data.
 */
export const firebaseFirestoreBatch = async (batchArray: Array<Object>): Promise<*> => {
  if (!batchArray && !Array.isArray(batchArray)) {
    return errorLogger(
      'The paramenter you provided is not an Array',
      batchArray || UNDEFINED,
    );
  }
  try {
    const firestoreBatch = firestoreDatabase.batch();
    batchArray.map(({
      collection = STATS_COLLECTION,
      documentId,
      batchMethod = 'set',
      dataObject = {},
    }: {
      collection: string,
      documentId: string,
      batchMethod: string,
      dataObject: Object,
    },
    index: number) => {
      if (!documentId) {
        return errorLogger('Batch `documentId` was not set', batchArray[index] || UNDEFINED);
      }
      const batchReference = firestoreDatabase.collection(collection).doc(documentId);
      return firestoreBatch[batchMethod](batchReference, dataObject);
    });
    return firestoreBatch.commit();
  } catch (caughtError) {
    return errorLogger(
      'Could not run the Firestore batch',
      batchArray,
      caughtError.message,
    );
  }
};

export default firebaseFirestoreBatch;
