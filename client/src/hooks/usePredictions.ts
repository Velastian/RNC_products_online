import { useState } from "react";
import { toast } from "sonner";
import { type Prediction } from "@/types";
import { generatePredictionId } from "@/utils";

interface usePredictionsProps {
  image: File | null;
  imagePreview: string | null;
  handleIsOpen: (value: boolean) => void;
};

type PredictionResponse = Omit<Prediction, "coffeMaker" | "id" | "imagen"> & {
  coffee_maker: number;
};

const usePredictions = ({ image, imagePreview, handleIsOpen }: usePredictionsProps) => {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!image) return;

    const formData = new FormData();
    formData.append("imagen", image);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/prediccion/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      const scores: PredictionResponse = result.predicciones;
      const newId = generatePredictionId(data.length);

      const prediction: Prediction = {
        id: newId,
        imagen: imagePreview || "/placeholder.svg?height=40&width=40",
        bicycle: scores.bicycle ?? 0,
        cabinet: scores.cabinet ?? 0,
        chair: scores.chair ?? 0,
        coffeMaker: scores.coffee_maker ?? 0,
        fan: scores.fan ?? 0,
        kettle: scores.kettle ?? 0,
        lamp: scores.lamp ?? 0,
        mug: scores.mug ?? 0,
        sofa: scores.sofa ?? 0,
        stapler: scores.stapler ?? 0,
        table: scores.table ?? 0,
        toaster: scores.toaster ?? 0,
      };
      
      setData((prev) => [...prev, prediction]);
      handleIsOpen(false);
      toast.success("Prediccion realizada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al realizar la predicción");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    handleSubmit,
  };
};

export default usePredictions;