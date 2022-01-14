export interface MangaResultDto {
  mal_id: number;
  url: string;
  image_url: string;
  title: string;
  publishing: boolean;
  synopsis: string;
  type: string;
  chapters: number;
  volumes: number;
  score: number;
  start_date?: string;
  end_date?: string;
  members: number;
}

export interface MangaResultResponseDto {
  request_hash: string;
  request_cached: boolean;
  request_cache_expiry: number;
  results: MangaResultDto[];
  last_page: number;
}
