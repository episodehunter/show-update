import { ShowDefinitionType } from './types/show-definition.type';
import { EpisodeDefinitionType } from './types/episode-definition.type';
import { updateShowRequest, addShowRequest } from './red-keep.util';
import { TheTvDbShow, TheTvDbShowEpisode } from '@episodehunter/thetvdb';
import { safeMap, safeFilter, isValidEpisode } from '../util';
import { getInformationFromTvDb } from '../the-tv-db.util';
import { Logger } from '@episodehunter/logger';

export async function updateShow(tvDbId: number, logger: Logger, awsRequestId: string) {
  const [tShow, tEpisodes] = await getInformationFromTvDb(tvDbId, logger);
  const showDef = mapTheTvShowToDefinition(tShow, tEpisodes);
  return updateShowRequest(showDef, awsRequestId);
}

export async function addShow(tvDbId: number, logger: Logger, awsRequestId: string) {
  const [tShow, tEpisodes] = await getInformationFromTvDb(tvDbId, logger);
  const showDef = mapTheTvShowToDefinition(tShow, tEpisodes);
  return addShowRequest(showDef, awsRequestId);
}

function mapTheTvShowEpisodeToDefinition(tEpisodes: TheTvDbShowEpisode): EpisodeDefinitionType {
  return {
    tvdbId: tEpisodes.id,
    name: tEpisodes.episodeName || `Episode #${tEpisodes.airedSeason}.${tEpisodes.airedEpisodeNumber}`,
    season: tEpisodes.airedSeason,
    episode: tEpisodes.airedEpisodeNumber,
    firstAired: tEpisodes.firstAired,
    overview: tEpisodes.overview,
    lastupdated: tEpisodes.lastUpdated
  };
}

function mapTheTvShowToDefinition(tShow: TheTvDbShow, tEpisodes: TheTvDbShowEpisode[]): ShowDefinitionType {
  return {
    tvdbId: tShow.id,
    imdbId: tShow.imdbId,
    name: tShow.seriesName,
    airsDayOfWeek: tShow.airsDayOfWeek,
    airsTime: tShow.airsTime,
    firstAired: tShow.firstAired,
    genre: tShow.genre,
    network: tShow.network,
    overview: tShow.overview,
    runtime: (tShow.runtime as any | 0) || undefined,
    ended: tShow.status === 'Ended',
    lastupdate: tShow.lastUpdated,
    episodes: safeMap(mapTheTvShowEpisodeToDefinition)(safeFilter(isValidEpisode)(tEpisodes))
  };
}
