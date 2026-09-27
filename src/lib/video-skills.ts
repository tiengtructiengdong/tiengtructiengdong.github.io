/**
 * video-skills.ts
 * Types and data loader for the video-editor skills feature.
 * Mirrors `skills.ts` but loads video-editing tools from
 * `src/data/video-skills.json`.
 */
import videoSkillsData from "../data/video-skills.json";
import type { SkillCategory } from "./skills";

export const videoSkillCategories: SkillCategory[] =
	videoSkillsData as SkillCategory[];
