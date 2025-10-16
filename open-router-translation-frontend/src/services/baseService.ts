import { apiKeyStorage } from "./apiKeyStorage";

const baseUrl = "http://localhost:8080";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
}

export const sendRequest = async (
    path: string,
    method: HttpMethod,
    data: any
) => {
  return fetch(baseUrl + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === HttpMethod.GET ? undefined : JSON.stringify(data),
  });
};

export const translateChunks = async (
    originalId: number,
    chunks: any[],
    model: string,
    language: string,
    batchSize: number = 10

) => {
<<<<<<< HEAD
=======
  // Get the API key from secure storage
>>>>>>> 6ce1fe9452ef126bfb3ef1e6e56699f20f7836ad
  const apiKey = await apiKeyStorage.getApiKey();

  if (!apiKey) {
    throw new Error('No API key found. Please set your OpenRouter API key in settings.');
  }

  const requestBody = {
    originalId: originalId,
    chunks: chunks,
    model: model,
    language: language,
    batchSize: batchSize,
    apiKey: apiKey  // Include the API key in the request
  };

  return sendRequest("/api/openrouter/translate/chunks", HttpMethod.POST, requestBody);
};

export async function uploadFileToApi(file: File, movieId: number) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(baseUrl + "/subtitles/upload/" + movieId, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}