import { guard, assertRequiredConfig } from '@episodehunter/kingsguard';
import { SNSEvent } from 'aws-lambda';
import { updateShow } from './update-show';

assertRequiredConfig('EH_RED_KEEP_URL', 'EH_RED_KEEP_TOKEN', 'THE_TV_DB_API_KEY', 'THE_TV_DB_USER_KEY');

export const update = guard<SNSEvent>(async function updateInner(event, logger) {
  const message = event.Records[0].Sns.Message;
  const theTvDbId = Number(message) | 0;

  logger.log(`Will update the show with theTvDbId: ${theTvDbId} and associated epesodes`);

  if (theTvDbId <= 0) {
    throw new Error('theTvDbId is not a valid id:' + message);
  }

  return updateShow(theTvDbId)
    .then(result => console.log(result))
    .catch(error => console.error(error));
});
