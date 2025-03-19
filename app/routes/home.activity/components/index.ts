type ActivityStageData = {
  source: string;
  destination: string;
};

export const parseActivityStageData = (data?: string | null) => {
  try {
    if(!data) return undefined
    const d = JSON.parse(data) as ActivityStageData;
    return d;
  } catch (err) {}
};
