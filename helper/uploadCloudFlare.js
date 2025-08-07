import axios from "axios";
import FormData from "form-data";
import fs from 'fs';
import { ApiUrl } from "../common/constants.js";

export const uploadToCloudflare = async (file, accountId, authKey) => {
  if (!file) throw new Error("No file uploaded.");

  const form = new FormData();
  form.append("file", fs.createReadStream(file.path), {
    filename: file.originalname,
    contentType: file.mimetype,
  });
  form.append("metadata", JSON.stringify({ title: file.originalname }));

  const options = {
    method: "POST",
    url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${authKey}`,
    },
    data: form,
  };

  const response = await axios.request(options);

  // Remove local file
  fs.unlink(file.path, (err) => {
    if (err) console.error("Error deleting file:", err);
  });

  if (!response?.data?.success) {
    throw new Error("Image upload failed");
  }

  return response.data;
};