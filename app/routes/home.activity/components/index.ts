type ActivityStageData = {
  source: string;
  destination: string;
};

type ActivityInfoData = {
  title: string;
  description: string;
};

export const parseActivityStageData = (data?: string | null) => {
  try {
    if(!data) return undefined
    const d = JSON.parse(data) as ActivityStageData;
    return d;
  } catch (err) {}
};



export const parseActivityInfoData = (data?: string | null) => {
  try {
    if(!data) return undefined
    const d = JSON.parse(data) as ActivityInfoData;
    return d;
  } catch (err) {}
};