import { ChampionRoleType } from "../../LolRate/ChampionRoleType";
import { ChampionDto } from "../general/ChampionDto";
import { SkillLevelTypes } from "./SkillLevelTypes";

export interface PlayerChampionDto {
  id: number;
  userId?: number;
  playerId: number;

  champion?: ChampionDto;
  championId?: number;

  role: ChampionRoleType;
  skillLevel: SkillLevelTypes;

  createdAt: string;
  updatedAt: string;
}

export const getEmptyPlayerChampionDto = (
  playerId: number,
  championId: number,
  skillLevel: SkillLevelTypes, role: ChampionRoleType
): PlayerChampionDto => ({
  id: null,
  playerId,
  role,
  championId,
  skillLevel,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
