// utils/skillUtils.js
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

let skillMapCache = {};

export const getSkillMap = async () => {
  if (Object.keys(skillMapCache).length > 0) return skillMapCache;

  try {
    const res = await axios.get(`${API_BASE_URL}/HouseKeeperSkills/HousekeeperSkillList`, {
      params: { pageNumber: 1, pageSize: 100 },
    });

    skillMapCache = {};
    res.data.forEach((skill) => {
      skillMapCache[skill.houseKeeperSkillID] = skill.name;
    });

    return skillMapCache;
  } catch (err) {
    return {};
  }
};
