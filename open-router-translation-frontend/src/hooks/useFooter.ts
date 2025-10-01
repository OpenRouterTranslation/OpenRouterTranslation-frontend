import { useEffect, useState } from "react";
import { HttpMethod, sendRequest } from "../services/baseService";
export type Model = { modelId: string };
export const useFooter = () => {
  const [checked, setChecked] = useState(true);
  const [models, setModels] = useState<Model[]>([
    { modelId: "model1" },
    { modelId: "model2" },
  ]);

  useEffect(() => {
    const fetchModels = async () => {
      const path = checked ? "/api/openrouter/models/free" : "/api/openrouter/models";
      try {
        const response = await sendRequest(path, HttpMethod.GET, null);
        const data = await response.json();
        setModels(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchModels();
  }, [checked]);

  return { checked, setChecked, models };
};
