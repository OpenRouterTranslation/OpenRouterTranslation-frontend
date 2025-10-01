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
    originalId: number, // Add this parameter
    chunks: any[],
    model: string,
    language: string,
    batchSize: number = 10
) => {
  const requestBody = {
    originalId: originalId, // Add this field
    chunks: chunks,
    model: model,
    language: language,
    batchSize: batchSize
  };

  return sendRequest("/api/openrouter/translate/chunks", HttpMethod.POST, requestBody);
};

export async function uploadFileToApi(file: File, movieId: number) {
  const formData = new FormData();
  formData.append("file", file); // match the key with your API

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
